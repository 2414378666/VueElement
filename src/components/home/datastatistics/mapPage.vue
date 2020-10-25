<template>
  <div id="trendPage">
    <el-button type="primary" icon="el-icon-rank" v-show="mapFlag" @click="reverMap" circle class="btn"></el-button>
    <!-- <div v-else></div> -->
    <div style="width: 100%; height: 600px;" class="trend" ref="mapChart"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '../../../utils/map_utils'

export default	{
  name:	'trendPage',
  data() {
    return {
      chartInstance: null, //初始化echarts
      titleFontSize: 0, //计算后的页面尺寸值
      mapFlag: false,
      mapData: null
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
    async initCharts () {
      this.chartInstance = this.$echarts.init(this.$refs.mapChart, 'chalk')
      //初始化图表把除数据的所有设置初始化好 方便维护
      const data = await axios.get(`http://localhost:8999/static/map/china.json`)
      if(data.status != 200) return this.message.error('获取横状柱形图数据失败')
      echarts.registerMap('china',data.data)
      const option = {
        title: {
          text: '▮ 商家分布情况',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(option)
      
      this.chartInstance.on('click', async (arg) => {
        const a = getProvinceMapInfo(arg.name)
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
      console.log(this.datas);
      this.upDateCharts()
    },
    //更新数据
    upDateCharts () {
      // 基本数据
      const seriesArr = this.datas.map(item => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5, //涟漪散点大小
            brushType: 'stroke'
          }
        }
      })
      const legendaArr = this.datas.map(item => {
        return item.name
      })
      console.log(seriesArr);
      const dataOption = {
        legend: {
          data: legendaArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
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
    reverMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
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