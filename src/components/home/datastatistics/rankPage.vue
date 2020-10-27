<template>
  <div id="trendPage">
    <div style="width: 100%; height: 180px;" class="trend" ref="trendChart"></div>
  </div>
</template>

<script>
export default	{
  name:	'trendPage',
  data() {
    return {
      chartInstance: null, //初始化echarts
      datas: {}, //服务器返回数据
      titleFontSize: 0, //计算后的页面尺寸值
      startNum: 0, //滑块初始值
      endNum: 8, //滑块结束值
      setInter: null, //定时器
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
    this.getData()
    //调用窗口监听函数
    window.addEventListener('resize', this.screenAdapter)
    //打开窗口之后就调用方法测算窗口大小来改变样式
    this.screenAdapter()
    //调用无限循环方法平移图表
    this.setIntervalWay()

    this.$bus.$on('abc', () => {
      this.getStyleName()
      this.chartInstance.dispose() //销毁图表
      this.initCharts()
      this.screenAdapter()
      this.upDateCharts()
    })
  },
  destroyed () {
    //销毁容器大小监听器监听器
    window.removeEventListener('resize', this.screenAdapter)
    //销毁定时器
    window.clearInterval(this.setInter)
  },
  methods: {
    getStyleName () {
      this.styleName = this.$store.state.count
    },
    initCharts () {
      this.chartInstance = this.$echarts.init(this.$refs.trendChart, this.styleName)
      //初始化图表把除数据的所有设置初始化好 方便维护
      const option = {
        title: {
          text: '▮ 地区销售排行',
          left: 20,
          top: 20
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [ //区域缩放组件
          {
            startValue: this.startNum, //初始化滑块开始筛选值
            endValue: this.endNum, 
          }
        ],
        grid: { //图表大小
          top: '40%',
          right: '5%',
          bottom: '5%',
          left: '5%',
          containLabel: true
        },
        tooltip: { //提示框
          show: true
        },
        series: [
          {
            type: 'bar',
          }
        ]
      }
      this.chartInstance.setOption(option)
      this.chartInstance.on('MouseOver', () => {
        window.clearInterval(this.setInter)
      })
      this.chartInstance.on('MouseOut', () => {
        this.setIntervalWay()
      })
      this.chartInstance.on('dataZoom', (data) => {
        console.log('13213');
      })
    },
    // 获取页面展示所需数据
    async getData () {
      const data = await this.$http2({
        method: 'get',
        url: 'rank'
      })
      if(data.status != 200) return this.message.error('获取横状柱形图数据失败')
      this.datas = data.data
      //对数据进行从大到小的排序 a，b的正序谁在前面谁是更小的数
      this.datas.sort((a, b) => {
        return a.value - b.value
      })
      console.log(this.datas);
      this.upDateCharts()
    },
    // 对页面数据进行处理
    upDateCharts () {
      //循环提取y轴的值
      const sellerValues = this.datas.map((item) => {
        return item.name
      })
      //循环遍历x轴的值
      const sellerNames = this.datas.map((item) => {
        return item.value
      })
      //渐变色的提取
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      //柱状渐变色方法
      function color(color1, color2) {
        return { //渐变色形成 支持回调函数
          type: 'linear', //线性渐变
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0, color: color1 //0时颜色为红色 不支持回调函数 
            },
            {
              offset: 1, color: color2 //100%时为蓝色 不支持回调函数
            }
          ]
        }
      }
      //对数据进行更新
      const dataOption = {
        xAxis: {
          data: sellerValues
        },
        series: [
          {
            data: sellerNames,
            itemStyle: { //颜色的渐变
              color: arg => {
                if(arg.data >= 300) {
                  return color(colorArr[0][0], colorArr[0][1])
                } else if(arg.data >= 200)  {
                  return color(colorArr[1][0], colorArr[1][1])
                } else {
                  return color(colorArr[2][0], colorArr[2][1])
                }
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 改变刷新页面尺寸大小
    screenAdapter () {
      this.titleFontSize = this.$refs.trendChart.offsetWidth / 100 * 3.6
      const adapteroption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            barWidth: this.titleFontSize,
            itemStyle: { // 调整柱的样式
	            barBorderRadius: [this.titleFontSize / 2, this.titleFontSize / 2, 0,  0] //圆角
            }
          }
        ]
      }
      this.chartInstance.setOption(adapteroption)
      // 当容器大小发送改变时手动刷新
      this.chartInstance.resize()
    },
    setIntervalWay () {
      if(this.setInter) {
        window.clearInterval(this.setInter)
      }
      let startNum2 = this.startNum
      let endNum2 = this.endNum
      let flag = 1
      this.setInter = setInterval(() => {
        if(startNum2 === 0 || flag === 1) {
          startNum2++; endNum2++
          if(endNum2 === this.datas.length - 1) {
            flag = 2
          }
        } else if(endNum2 === this.datas.length - 1 || flag === 2) {
          startNum2--; endNum2--
          if(startNum2 === 0) {
            flag = 1
          }
        }
        this.startNum = startNum2
        this.endNum = endNum2
        const setOption = {
          dataZoom: [ //区域缩放组件
          {
            startValue: this.startNum, //初始化滑块开始筛选值
            endValue: this.endNum, 
          }
        ],
        }
        this.chartInstance.setOption(setOption)
      }, 3000)
    }
  }
}
</script>

<style scoped>

</style>