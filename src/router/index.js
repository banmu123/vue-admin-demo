import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Login from '@/view/login/index.vue'
import { formatRoutes, registerRoutes } from '@/utils/router-util'

Vue.use(VueRouter)
 
// 基础路由，不需要权限的路由
const baseRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录'
    }
  }
]
 
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: baseRoutes
})

// 导出router实例


// 路由守卫已移至 permission.js 文件中

export default router;