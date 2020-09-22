import Vue from 'vue'
import App from './App.vue'
import router from 'router/index'
import './plugins/element.js'
import global from 'assets/css/global.css'
import less from 'less'
import './assets/font/font_wfpmxnxbpfe/iconfont.css'
import axios from 'axios'

Vue.use(axios)
Vue.use(less)

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
