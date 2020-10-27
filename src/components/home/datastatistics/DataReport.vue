<template>
  <div class="screen-container" :style="getStyle">
    <header class="screen-header">
      <div>
        <img :src="getHeader + header">
      </div>
      <span class="logo">
        <img :src="getLogo + logo">
      </span>
      <span class="title" :style="getTitleStyle">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="getQiehuan + qiehuan" @click="qiehuanAce" class="qiehuan">
        <span class="datetime" :style="getTitleStyle">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top">
          <!-- 销量趋势图表 -->
          <trendPage/>
        </div>
        <div id="left-bottom">
          <!-- 商家销售金额图表 -->
          <sellerPage/>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top">
          <!-- 商家分布图表 -->
          <mapPage/>
        </div>
        <div id="middle-bottom">
          <!-- 地区销量排行图表 -->
          <rankPage/>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top">
          <!-- 热销商品占比图表 -->
          <hotPage/>
        </div>
        <div id="right-bottom">
          <!-- 库存销量分析图表 -->
          <stockPage/>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import sellerPage from './SellerPage'
import trendPage from './trendPage'
import mapPage from './mapPage'
import rankPage from './rankPage'
import hotPage from './hotPage'
import stockPage from './stockPage'
import { getThemeValue } from '@/utils/theme_utils'

export default {
  data() {
    return {
      header: 'dark.png',
      logo: 'black.png',
      qiehuan: 'dark.png',
      flag: true,
      style: 'backgroundColor: RGB(34,39,51)',
      titleStyle: 'color: #333'
    }
  },
  mounted() {
  },
  computed : {
    getHeader () {
      return '/static/img/header_border_'
    },
    getLogo () {
      return '/static/img/'
    },
    getQiehuan () {
      return '/static/img/qiehuan_'
    },
    getStyle () {
      return this.style
    },
    getTitleStyle () {
      return this.titleStyle
    }
  },
  components: {
    sellerPage,
    trendPage,
    mapPage,
    rankPage,
    hotPage,
    stockPage,
  },
  methods: {
    qiehuanAce () {
      this.flag = !this.flag
      if(this.flag) {
        this.header = 'dark.png'
        this.logo = 'black.png'
        this.qiehuan = 'dark.png'
        this.style = 'backgroundColor: RGB(34,39,51)'
        this.titleStyle = 'color: #fff'
        this.$store.commit('increment', 'chalk')
        this.$bus.$emit('abc')
      } else {
        this.header = 'light.png'
        this.logo = 'while.png'
        this.qiehuan = 'light.png'
        this.style = 'backgroundColor: #fff'
        this.titleStyle = 'color: #333'
        this.$store.commit('increment', 'vintage')
        this.$bus.$emit('abc')
      }
      
    }
  }
}
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  // background-color: #fff;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
      img {
        width: 100%;
      }
    }
  .title {
    position: absolute;
    left: 50%;
    top: 40%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position:absolute;
    right: 0px;
    top: 40%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 33px;
      width: 128px;
      background-color: #161522;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
</style>
