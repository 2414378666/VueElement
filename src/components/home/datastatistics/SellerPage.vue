<template>
  <div id="SellerPage">
      <div style="width: 100%; height: 200px;" class="seller" ref="mainChart"></div>
  </div>
</template>

<script>
export default	{
  name:	'SellerPage',
  data() {
    return {
      chartInstance: null, //初始化echarts
      datas: {}, //服务器返回数据
      currentPage: 1, //当前显示页数
      totalPage: 0, //一共有多少页
      timerId: null, //定时器
      styleName: ''
    }
  },
  beforeMount () {
    this.styleName = this.$store.state.count
  },
  mounted() {
    //调用初始化
    this.initCharts()
    //调用获取数据
    this.getData(),
    //调用窗口监听函数
    window.addEventListener('resize', this.screenAdapter)
    //打开窗口之后就调用方法测算窗口大小来改变样式
    this.screenAdapter()

    this.$bus.$on('abc', () => {
      this.getStyleName()
      this.chartInstance.dispose() //销毁图表
      this.initCharts()
      this.screenAdapter()
      this.upDateCharts()
    })
  },
  //当组件销毁后清除定时器
  destroyed () {
    clearInterval(this.timerId)
    //销毁容器大小监听器监听器
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    getStyleName () {
      this.styleName = this.$store.state.count
    },
    //初始化Echarts 改变样式
    initCharts () {
      this.chartInstance = this.$echarts.init(this.$refs.mainChart, this.styleName)
      //初始化图表把除数据的所有设置初始化好 方便维护
      const option = {
        title: { //标题
          text: '▋ 商家销售统计',
          left: 20,
          top: 20
        },
        grid: { //坐标的调整
          top: '20%',
          left: '3%',
          bottom: '6%',
          right: '3%',
          containLabel: true //距离包含坐标轴的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
        },
        series: [
          {
            type: 'bar',
            label: { //饼图文字显示
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              color: { //渐变色形成
                type: 'linear', //线性渐变
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0, color: '#5052EE' //0时颜色为红色
                  },
                  {
                    offset: 1, color: '#AB6EE5' //100%时为蓝色
                  }
                ]
              }
            }
          }
        ],
        tooltip: { //提示框
          trigger: 'axis',
          axisPointer: { //
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          },
          formatter: `{b}
          {c}`
        }
      }
      this.chartInstance.setOption(option)
      //当鼠标移入时清除定时器
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      //当鼠标移开时调用定时器函数
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    //获取服务器数据
    async getData () {
      const data = await this.$http2({
        method: 'get',
        url: 'seller'
      })
      if(data.status != 200) return this.message.error('获取横状柱形图数据失败')
      this.datas = data.data
      //对数据进行排序
      // console.log(this.datas);
      this.datas.sort((a, b) => {
        return a.value - b.value //从小到大排序
      })
      // 得到每页五条一共多少页的数据 余数为零时得到整数，不为零时得到整除的数加上1
      this.totalPage = this.datas.length % 5 === 0 ? this.datas.length / 5 : this.datas.length / 5 + 1
      //数据获取完就调用数据更新函数
      this.upDateCharts()
      //定时器开始工作
      this.startInterval()
    },
    //更新图表 改变数据
    upDateCharts () {
      //获得循环开始的条数
      const start = (this.currentPage - 1) * 5
      //获得循环结束的条数
      const end = (this.currentPage) * 5
      //截取对应下标的数据展示
      const showData = this.datas.slice(start, end)
      //循环提取y轴的值
      const sellerNames = showData.map((item) => {
        return item.name
      })
      //循环遍历x轴的值
      const sellerValues = showData.map((item) => {
        return item.value
      })
      //更新函数值更新图表数据
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues,
          }
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    //无限循环定时器 更新遍历图表当前展示的数据
    startInterval () {
      //判断定时器是否存在 存在则删除
      if(this.timerId) {
        clearInterval(this.timerId)
      }
      //每循环一次当前页码加一 直到大于总页码数则把当前页码数变回初始
      this.timerId = setInterval(() => {
        this.currentPage++
        if(this.currentPage > this.totalPage) {
           this.currentPage = 1
        }
        //没循环一次就调用一次数据更新函数
        this.upDateCharts()
      }, 3000)
    },
    //当容器大小发送改变时 改变分辨率
    screenAdapter () {
      let titleFontSize = this.$refs.mainChart.offsetWidth / 100 * 3.6
      // console.log(titleFontSize);
      const adapteroption = {
        title: { //标题
          textStyle: {
            fontSize: titleFontSize
          },
        },
        tooltip: { //提示框
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            }
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0], //圆角
            }
          }
        ],
      }
      this.chartInstance.setOption(adapteroption)
      // 当容器大小发送改变时手动刷新
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>
  
</style>
