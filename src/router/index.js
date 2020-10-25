import Vue from 'vue'
import Router from 'vue-router'
// import bus from '../utils/bus'

const Login = () => import(/* webpackChunkName: "group-Login" */ 'components/login')

const Home = () => import(/* webpackChunkName: "group-Home" */ 'components/home/home')

const Users = () => import(/* webpackChunkName: "group-Users" */ 'components/home/user/Users')

const Messge = () => import(/* webpackChunkName: "group-Messge" */ 'components/home/messge')

const Rights = () => import(/* webpackChunkName: "group-jurisdiction" */ 'components/home/jurisdiction/rights')
const Roles = () => import(/* webpackChunkName: "group-jurisdiction" */ 'components/home/jurisdiction/roles')

const GoodsCategory = () => import(/* webpackChunkName: "group-commodity" */ 'components/home/commodity/GoodsCategory')
const ProductList = () => import(/* webpackChunkName: "group-commodity" */ 'components/home/commodity/ProductList')
const SortingParameter = () => import(/* webpackChunkName: "group-commodity" */ 'components/home/commodity/SortingParameter')
const AddGoods = () => import(/* webpackChunkName: "group-commodity" */ 'components/home/commodity/addGoods')

const OrderList = () => import(/* webpackChunkName: "group-OrderList" */ 'components/home/ordermanagement/OrderList')

const DataReport = () => import(/* webpackChunkName: "group-DataReport" */ 'components/home/datastatistics/DataReport')
const SellerPage = () => import(/* webpackChunkName: "group-DataReport" */ 'components/home/datastatistics/SellerPage')


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
    component: Home,
    children: [
      {
        path: '/home',
        component: Messge
      },
			{
				path: '/users',
				component: Users,
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: ProductList
      },
      {
        path: '/goods',
        component: GoodsCategory,
      },
      {
        path: '/params',
        component: SortingParameter
      },
      {
        path: '/orders',
        component: OrderList
      },
      {
        path: '/reports',
        component: DataReport
      },
      {
        path: '/goods/addgoods',
        component: AddGoods
      },
      {
        path: '/sellerpage',
        component: SellerPage
      }
		]
  }
]

const router = new Router({
  routes,
  mode : 'history',
})

// try {
//路由守卫 当触发路由则做判断
router.beforeEach((to , from, next) => {
  //记得return 只要满足一个条件的时候要return
  if(to.path == '/login') {
    return next()
  }
  const token = sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  // if(to.path == '/home') {
  //   bus.$emit('getpath')
  // }
  next()
})

export default router