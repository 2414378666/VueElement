<template>
  <div id="trendPage">
    <el-tag class="alert" ref="tagRef" type="info" size="mini">{{getTitle}}</el-tag>
    <div class="el-icon-arrow-left left" @click="leftCut"></div>
    <div style="width: 100%; height: 290px;" class="trend" ref="hotChart"></div>
    <div class="el-icon-arrow-right right" @click="rightCut"></div>
  </div>
</template>

<script>
export default	{
  name:	'trendPage',
  data() {
    return {
      chartInstance: null, //初始化echarts
      datas: {}, //服务器返回数据
      dataNum: 0, //滚动时页面的下标
      dataName: '',
      styleName: '',
      setInter: ''
    }
  },
  beforeMount () {
    this.getStyleName()
  },
  mounted () {
    //调用获取数据
    this.getData()
     //调用初始化
    this.initCharts()
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
  destroyed () {
    //销毁容器大小监听器监听器
    window.removeEventListener('resize', this.screenAdapter)
    //销毁定时器
    window.clearInterval(this.setInter)
  },
  computed: {
    getTitle () {
      if(!this.datas) {
        return ''
      } else {
        return this.dataName
      }
    },
  },
  methods: {
    getStyleName () {
      this.styleName = this.$store.state.count
    },
    initCharts () {
      this.chartInstance = this.$echarts.init(this.$refs.hotChart, this.styleName)
      //初始化图表把除数据的所有设置初始化好 方便维护
      const option = {
        title: {
          text: '▮ 热销商品的占比',
          left: 20,
          top: 20,
        },
        legend: {
          top: '5%',
          icon: 'circle',
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
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
    // 获取页面展示所需数据
    async getData () {
      const data = await this.$http2({
        method: 'get',
        url: 'hot'
      })
      if(data.status != 200) return this.message.error('获取横状柱形图数据失败')
      this.datas = data.data
      console.log(this.datas);
      this.upDateCharts()
    },
    // 对页面数据进行处理
    upDateCharts () {
      //获得饼图的数据
      let seriesData = this.datas[this.dataNum].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      //获得图例的数据
      let legendData = this.datas[this.dataNum].children.map(item => {
        return item.name
      })
      const dataOption = {
        tooltip: {
          formatter: (arg) => {
            let thirdCategory = arg.data.children
            let num = 0
            thirdCategory.forEach(element => {
              num += element.value
            });
            let retStr = ''
            thirdCategory.forEach(element => {
              retStr += `${element.name} ${parseInt(element.value / num * 100)}% <br/>`
            })
            return retStr
          }
        },
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData,
          }
        ]
      }
      this.dataName = this.datas[this.dataNum].name
      this.chartInstance.setOption(dataOption)
    },
    // 改变刷新页面尺寸大小
    screenAdapter () {
      const titleFontSize = this.$refs.hotChart.offsetWidth / 100 * 3
      const adapteroption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          top: '15%',
          itemWidth: titleFontSize,
          itemHeight: titleFontSize,
          itemGap: titleFontSize / 1.5,
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            radius: titleFontSize * 5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adapteroption)
      // 当容器大小发送改变时手动刷新
      this.chartInstance.resize()
    },
    leftCut () {
      if(this.dataNum === 0) {
        this.dataNum = this.datas.length - 1
      } else {
        this.dataNum--   
      }
      this.upDateCharts()
    },
    rightCut () {
      if(this.dataNum === this.datas.length - 1) {
        this.dataNum = 0
      } else {
        this.dataNum++
      }
      this.upDateCharts()
    },
    startInterval () {
      if(this.setInter) {
        window.clearInterval(this.setInter)
      }
      this.setInter = setInterval(() => {
        this.rightCut()
      }, 3000)
    }
  }
}
</script>

<style scoped lang="less">
  @fontSize: 50px;
  @top: 45%;
  @around: 10%;
  @arrowsColor: #DCDFE6;
  #trendPage {
    position: relative;
  }
  .left {
    position: absolute;
    top: @top;
    left: @around;
    z-index: 10;
    font-size: @fontSize;
    color: @arrowsColor;
  }
  .right {
    position: absolute;
    top: @top;
    right: @around;
    z-index: 10;
    font-size: @fontSize;
    color: @arrowsColor;
  }
  .alert {
    position: absolute;
    z-index: 10;
    bottom: 20px;
    right: 20px;
    color: #333;
  }
</style>