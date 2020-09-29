import Vue from 'vue'
import App from './App.vue'
import router from 'router/index'
import './plugins/element.js'
import 'assets/css/global.css'
import less from 'less'
import 'assets/font_1869755_mu83kg9mx9n/iconfont.css'
import axios from 'axios'
import VueBus from 'vue-bus'
import TreeTable from 'vue-table-with-tree-grid'

Vue.prototype.axios = axios

Vue.prototype.$bus = new Vue()

Vue.use(less)
Vue.use(VueBus)

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

//请求拦截器
axios.interceptors.request.use(config => {
  //把token添加到axios
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
