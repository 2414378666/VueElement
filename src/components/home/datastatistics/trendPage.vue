<template>
  <div id="trendPage">
    <!-- 创建一个放置标题和可选项的盒子 -->
    <div class="title">
      <span :style="titleFontSizes" >{{showTitle}}</span>
      <span class="iconfont title-icon" :style="titleFontSizes" @click="selectShow">&#xe6eb;</span>
      <div class="select-con" v-for="item in selectTypes" v-show="flag">
        <div class="select-item" :style="titleFontSizes" @click="handleSelect(item.key)">{{item.text}}</div>
      </div>
    </div>
    <!-- echarts的容器盒子 -->
    <div style="width: 100%; height: 600px;" class="trend" ref="trendChart"></div>
  </div>
</template>

<script>
export default	{
  name:	'trendPage',
  data() {
    return {
      chartInstance: null, //初始化echarts
      datas: {}, //服务器返回数据
      flag: false, //可选框的下拉与否
      choiceType: 'map', //下拉可选项
      selectTypes: null, //下拉可选项的全部数据
      titleFontSize: 0 //根据页面大小计算得来的组件尺寸大小
    }
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
  },
  destroyed () {
    //销毁容器大小监听器监听器
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initCharts () {
      this.chartInstance = this.$echarts.init(this.$refs.trendChart, 'chalk')
      //初始化图表把除数据的所有设置初始化好 方便维护
      const option = {
        grid: { //控制图表布局和大小
          left:'3%', //距离盒子方位
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true //根据标题文字来位移
        },
        tooltip: { //提示框 按坐标轴触发
          trigger: 'axis'
        },
        legend: { //图例组件
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false //坐标轴左右留白
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(option)
    },
    // 获得数据的方法
    async getData () {
      const data = await this.$http2({
        method: 'get',
        url: 'trend',
      })
      if(data.status != 200) return this.message.error('获取横状柱形图数据失败')
      this.datas = data.data
      console.log(this.datas)
      this.upDateCharts()
    },
    //更新数据的组件
    upDateCharts () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      //类目轴数据
      const timeArr = this.datas.common.month
      //y轴数据
      const valueArr = this.datas[this.choiceType].data
      //将当前点击的下拉框选择 放进入获得相应数据 
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name, //和图例的每一项数据重合
          type: 'line',
          data: item.data, //
          stack: this.choiceType,
          areaStyle: { 
            color: { //渐变色形成
            type: 'linear', //线性渐变
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [ //从0到1的颜色渐变色
              {
                offset: 0, color: colorArr1[index]
              },
              {
                offset: 1, color: colorArr2[index]
              }
            ]
          }
        }
      }
    })
      const legendArr = valueArr.map(item => { //获得图例的数据
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: { //图例的数据
          data: legendArr
        },
        series: seriesArr
      }
     this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      //根据浏览器尺寸动态获得样式大小
      this.titleFontSize = this.$refs.trendChart.offsetWidth / 100 * 2.6
      const adapteroption = {
        //图例样式大小
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapteroption)
      // 当容器大小发送改变时手动刷新
      this.chartInstance.resize()
    },
    //点击下拉可选列表时的显示与隐藏
    selectShow () {
      this.selectTypes = this.datas.type.filter(item => {
        return item.key !== this.choiceType
      })
      this.flag = !this.flag
    },
    //点击下拉框中的一个选项后
    handleSelect (key) {
      //把点击后的那个选项值给标题
      this.choiceType = key
      //更新数据
      this.upDateCharts()
      //点击选项后隐藏下拉框
      this.flag = false
    }
  },
  computed: {
    //返回选择的标题
    showTitle () {
      if(!this.datas[this.choiceType]) {
        return []
      }
      return this.datas[this.choiceType].title
    },
    //返回下拉框的尺寸值
    titleFontSizes () {
      return {
        'fontSize': this.titleFontSize + 'px'
      }
    }
  }
}
</script>

<style scoped>
  #trendPage {
    position: relative;
  }
  .title {
    position: absolute;
    left: 20px;
    z-index: 10;
    color: aliceblue;
  }
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-item {
    cursor: pointer;
  }
</style>