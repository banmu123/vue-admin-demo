import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Login from '@/view/login/index.vue'
import { formatRoutes, registerRoutes } from '@/utils/router-util'

Vue.use(VueRouter)
 
// 导入SSO相关组件
const SsoLogin = () => import('@/view/sso/login.vue')
const SsoAuth = () => import('@/view/sso/auth.vue')
const SsoCallback = () => import('@/view/sso/callback.vue')

// 基础路由，不需要权限的路由
const baseRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  // SSO相关路由
  {
    path: '/sso',
    redirect: '/sso/login'
  },
  {
    path: '/sso/login',
    name: 'ssoLogin',
    component: SsoLogin,
    meta: {
      title: 'SSO单点登录'
    }
  },
  {
    path: '/sso/auth',
    name: 'ssoAuth',
    component: SsoAuth,
    meta: {
      title: '统一身份认证'
    }
  },
  {
    path: '/sso/callback',
    name: 'ssoCallback',
    component: SsoCallback,
    meta: {
      title: 'SSO认证回调'
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