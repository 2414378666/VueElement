import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('components/login')
const Home = () => import('components/home/home')

Vue.use(Router)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new Router({
  routes,
  mode : 'history',
})

router.beforeEach((to , from, next) => {
  //记得return 只要满足一个条件的时候要return
  if(to.path == '/login') {
    return next()
  } 
  const token = sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router