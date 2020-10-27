<template>
  <div id="trendPage">
    <div class="el-icon-arrow-left icon left" @click="leftBut" v-show="StartNum === 5" :style="getSize"></div>

    <div style="width: 100%; height: 247px;" class="trend" ref="stockChart"></div>
    <div class="el-icon-arrow-right icon right" @click="rightBut" v-show="endNum === 5" :style="getSize"></div>
  </div>
</template>

<script>
export default	{
  name:	'trendPage',
  data() {
    return {
      chartInstance: null, //初始化echarts
      datas: {}, //服务器返回数据
      StartNum: 0,
      endNum: 5,
      titleFontSize: 0,
      styleName: '',
      setInter: ''
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

    this.$bus.$on('abc', () => {
      this.getStyleName()
      this.chartInstance.dispose() //销毁图表
      this.initCharts()
      this.screenAdapter()
      this.upDateCharts()
      this.setIntervalWay()
    })

    this.setIntervalWay()
  },
  destroyed () {
    //销毁容器大小监听器监听器
    window.removeEventListener('resize', this.screenAdapter)
    //销毁定时器
    window.clearInterval(this.setInter)
  },
  computed: {
    getSize () {
      return {
        fontSize: this.titleFontSize * 1.5 + 'px'
      }
    }
  },
  methods: {
    getStyleName () {
      this.styleName = this.$store.state.count
    },
    initCharts () {
      this.chartInstance = this.$echarts.init(this.$refs.stockChart, this.styleName)
      //初始化图表把除数据的所有设置初始化好 方便维护
      const option = {
        title: {
          text: '▮ 商品库存情况',
          top: 20,
          left: 20
        }
      }
      this.chartInstance.setOption(option)
    },
    // 获取页面展示所需数据
    async getData () {
      const data = await this.$http2({
        method: 'get',
        url: 'stock'
      })
      if(data.status != 200) return this.message.error('获取横状柱形图数据失败')
      this.datas = data.data
      console.log(this.datas);
      this.upDateCharts()
    },
    // 对页面数据进行处理
    upDateCharts () {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const showData = this.datas.slice(this.StartNum, this.endNum)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          name: item.name,
          value: item.value,
          radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          label: {
            position: 'center',
            color: colorArr[0][0]
          },
          data: [
            {
              name: item.name + '\n' + item.stock,
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            },
            {
              value: item.sales,
              itemStyle: {
                color: { //渐变色形成 支持回调函数
                  type: 'linear', //线性渐变
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0, color: colorArr[index][0] //0时颜色为红色 不支持回调函数 
                    },
                    {
                      offset: 1, color: colorArr[index][1] //100%时为蓝色 不支持回调函数
                    }
                  ]
                }
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 改变刷新页面尺寸大小
    screenAdapter () {
      const titleFontSize = this.$refs.stockChart.offsetWidth / 100 * 3.6
      this.titleFontSize = titleFontSize
      const innerRadius = titleFontSize * 2.5
      const outterRadius = innerRadius * 1.315

      // console.log(titleFontSize);
      const adapteroption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5,
              
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
        ]
      }
      this.chartInstance.setOption(adapteroption)
      // 当容器大小发送改变时手动刷新
      this.chartInstance.resize()
    },
    leftBut () {
      this.StartNum = 0; this.endNum = 5
      this.upDateCharts()
      this.screenAdapter()
      this.$nextTick(() => {
        this.$bus.$on('upDate')
      })
    },
    rightBut () {
      this.StartNum = 5; this.endNum = 10
      this.upDateCharts()
      this.screenAdapter()
    },
    setIntervalWay () {
      if(this.setInter) {
        //销毁定时器
        window.clearInterval(this.setInter)
      }
       this.setInter = setTimeout(() => {
         this.screenAdapter()
       }, 100)
    }
  }
}
</script>

<style scoped>
  #trendPage {
    position: relative;
  }
  .icon {
    position: absolute;
    top: 50%;
    z-index: 10;
    font-size: 70px;
    color: aliceblue;
  }
  .right {
    right: 20px;
  }
</style>