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
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.prototype.axios = axios

Vue.prototype.$bus = new Vue()

Vue.use(less)
Vue.use(VueBus)
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

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

//请求拦截器
axios.interceptors.request.use(config => {
  //把token添加到axios 每次使用axios发送请求时都会附加一个token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
