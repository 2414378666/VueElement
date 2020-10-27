import Vue from 'vue'
import App from './App.vue'
import router from 'router/index'
import 'assets/css/global.css'
import 'assets/font_1869755_mu83kg9mx9n/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

//bus总线
Vue.prototype.$bus = new Vue()
//导入进度条
import NProgress from 'nprogress'

Vue.prototype.axios = axios
//echarts全局引入
Vue.prototype.$echarts = window.echarts

Vue.use(less)

Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

//管理系统数据接口引入
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

Vue.prototype.$http2 = axios.create({
  baseURL: 'http://127.0.0.1:3000/',
  timeout: 5000,
  headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
  }
})
//请求拦截器

axios.interceptors.request.use(config => {
  //在request拦截器中添加NProgress.start();加载进度条
  NProgress.start();
  //把token添加到axios 每次使用axios发送请求时都会附加一个token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

//在response中停止进度条加载NProgress.done();
axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
