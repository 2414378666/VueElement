<template>
  <div id="home">
    <el-container class="container">
      <!-- 头部区域 -->
      <el-header class="header">
        <div>
          <i class="iconfont icon-logo"></i>
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" size="small" @click="remtoken" class="buttom">退出登录</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="flag?'60px':'200px'" class="aside">
          <div class="toggle-button" @click="toggleclick">|||</div>
          <!-- 侧边栏菜单区 -->
          <el-menu background-color="#333744" text-color="#fff" 
          active-text-color="#409eff" unique-opened
          :collapse="flag" :collapse-transition="false" router :default-active="active">
            <!-- 一级菜单 -->
            <el-submenu v-for="(item, index) in menulist" :index="item.id + ''" :key="item.id">
              <!-- 模板区 -->
              <template slot="title">
                <i :class="fontlist[index]" style="margin-right: 10px;"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item v-for="itemson in item.children" 
              :index="itemson.path" :key="itemson.id"
              @click="saveNavState(itemson.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{itemson.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
          </el-col>
        </el-aside>
        <!-- 主体区域 -->
        <el-main class="main">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default	{
  name:	'home',
  data() {
    return {
      //左侧数据
      menulist: [],
      //一级菜单图标
      fontlist: [
      'iconfont icon-yonghuguanli', 
      'iconfont icon-header-22', 
      'iconfont icon-shangpinguanli', 
      'iconfont icon-dingdanguanli', 
      'iconfont icon-shujutongji'
      ],
      //是否折叠默认值
      flag: false,
      //被激活的链接地址
      active: '',
    }
  },
  created() {
    // 创建完就调用List方法 获取数据
    this.getMenuList()
    //创建后就把左侧默认点击赋值
    this.active = sessionStorage.getItem('active')
  },
  methods: {
    remtoken() {
      window.sessionStorage.removeItem('token');
      this.$router.push('/login')
    },
    //因为是返回的promise所以使用asyns 和 await简化
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data
    },
    toggleclick() {
      this.flag = !this.flag
    },
    saveNavState(state) {
      let state2 = '/' + state
      window.sessionStorage.setItem('active', state2)
    },
  },
}
</script>

<style scoped lang="less">
  #home {
    height: 100%;
  }
  .container {
    height: 100%;
  }
  .header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    .icon-logo {
      font-size: 60px;
    }
    span {
      position: relative;
      top: -18px;
      display: inline-block;
      font-size: 20px;
      color: #fff;
    }
    .buttom {
      margin-top: 10px;
      height: 40px;
    }
  }
  .aside {
    background-color: #333744;
    .toggle-button {
      background-color: #4a5064;
      cursor: pointer;
      text-align: center;
      line-height: 21px;
      font-size: 10px;
      letter-spacing: 0.2em;
      color: #fff;
    }
  }
  .main {
    background-color: #eaedf1;
  }
</style>