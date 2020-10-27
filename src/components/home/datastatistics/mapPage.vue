<template>
  <div id="trendPage">
    <!-- 创建一个关闭省地图打开中国地图的按钮 -->
    <el-button type="primary" icon="el-icon-rank" v-show="mapFlag" @click="reverMap" circle class="btn"></el-button>
    <div style="width: 100%; height: 364px;" class="trend" ref="mapChart"></div>
  </div>
</template>

<script>
import axios from 'axios'
//引入一个根据中文导出拼音的脚本
import { getProvinceMapInfo } from '../../../utils/map_utils'

export default	{
  name:	'trendPage',
  data() {
    return {
      chartInstance: null, //初始化echarts
      titleFontSize: 0, //计算后的页面尺寸值
      mapFlag: false, //关闭省地图打开中国地图的按钮判定
      mapData: null, //保存上一次点击省地图的key值
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
  },
  methods: {
    getStyleName () {
      this.styleName = this.$store.state.count
    },
    async initCharts () {
      this.chartInstance = this.$echarts.init(this.$refs.mapChart, this.styleName)
      //初始化图表把除数据的所有设置初始化好 方便维护
      //获取静态仓库的数据
      const data = await axios.get(`http://localhost:8999/static/map/china.json`)
      if(data.status != 200) return this.message.error('获取横状柱形图数据失败')
      //注册一个地图实例
      echarts.registerMap('china',data.data)
      const option = {
        title: { //标题
          text: '▮ 商家分布情况',
          left: 20,
          top: 20
        },
        geo: { //地图
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF', //地图区域的颜色
            borderColor: '#333' //省与省的描边颜色
          }
        },
        legend: { //图例组件
          left: '5%',
          bottom: '5%',
          orient: 'vertical' //图例朝上
        }
      }
      this.chartInstance.setOption(option)
      //点击省地图时
      this.chartInstance.on('click', async (arg) => {
        // 调用获得拼音的脚本
        const a = getProvinceMapInfo(arg.name)
        // 当这次点击的省地图和上次一样则不再进行ajax请求
        if(this.mapData === a.key) {
          const option = {
            geo: {
              map: a.key,
            },
          }
          this.chartInstance.setOption(option)
        } else {
          this.mapData = a.key
          const {data: data} = await axios.get(`http://localhost:8999${a.path}`)
          echarts.registerMap(a.key, data)
          const option = {
            geo: {
              map: a.key,
            },
          }
          this.chartInstance.setOption(option)
        }
        // 点击省地图后把按钮显示出来
        this.mapFlag = true
      })
    },
    //获取数据
    async getData () {
      const data = await this.$http2({
        method: 'get',
        url: 'map'
      })
      if(data.status != 200) return this.message.error('获取横状柱形图数据失败')
      this.datas = data.data
      this.upDateCharts()
    },
    //更新数据
    upDateCharts () {
      // 基本数据
      const seriesArr = this.datas.map(item => {
        return {
          type: 'effectScatter', //涟漪效果
          name: item.name, //涟漪特效动画的散点(气泡)图
          data: item.children, //地图数据
          coordinateSystem: 'geo', //指明散点坐标系统 geo
          rippleEffect: {
            scale: 5, //涟漪散点大小
            brushType: 'stroke' //波纹的绘制方式
          }
        }
      })
      //获得和图例相对应的数据
      const legendaArr = this.datas.map(item => {
        return item.name
      })

      const dataOption = {
        legend: {
          data: legendaArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    //页面尺寸大小设置
    screenAdapter () {
      this.titleFontSize = this.$refs.mapChart.offsetWidth / 100 * 2.6
      const adapteroption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          },
        },
        legend: {
          itemWidth: this.titleFontSize / 1.3,
          itemHeight: this.titleFontSize / 1.3,
          itemGap: this.titleFontSize / 1.3,
          textStyle: {
            fontSize: this.titleFontSize / 1.3
          }
        }
      }
      this.chartInstance.setOption(adapteroption)
      // 当容器大小发送改变时手动刷新
      this.chartInstance.resize()
    },
    // 当点击回到中国地图的按钮后
    reverMap () {
      //渲染中国地图
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
      //按钮隐藏
      this.mapFlag = false
    }
  }
}
</script>

<style scoped>
  .btn {
    position: absolute;
    right: 5%;
    top: 15%;
    z-index: 10;
    color: aliceblue;
  }
</style>