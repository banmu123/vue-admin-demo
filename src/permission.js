import router from '@/router'
import store from '@/store'
import { formatRoutes, registerRoutes } from '@/utils/router-util'

// 定义路由白名单，不需要token即可访问的路径
const whiteList = ['/login', '/sso/login', '/sso/auth', '/sso/callback']

// 前置守卫
router.beforeEach(async (to, from, next) => {
  console.log('权限守卫: 从', from.path, '到', to.path)
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title + ' - 后台管理系统'
  }
  
  // 获取token
  const hasToken = !!store.getters.token
  console.log('权限守卫: token存在?', hasToken)
  
  // 1. 处理访问登录页的情况
  if (to.path === '/login') {
    if (hasToken) {
      console.log('权限守卫: 访问登录页，token存在，跳转到主页')
      // 如果是从SSO相关页面跳转过来，则避免再次触发重定向
      if (from.path.includes('/sso/')) {
        // 使用全局函数在下一个事件循环执行跳转，避免重定向冲突
        setTimeout(() => {
          window.location.href = '/'
        }, 0)
      } else {
        next({ path: '/', replace: true })
      }
    } else {
      console.log('权限守卫: 访问登录页，token不存在，放行')
      next()
    }
    return // 提前返回避免继续执行
  }
  
  // 2. 对于非登录页的访问
  if (hasToken) {
    // 有token，检查并注册路由
    if (!hasRoutesRegistered(router)) {
      try {
        console.log('权限守卫: 开始生成和注册动态路由')
        // 声明变量asyncRoutes存储异步生成的路由
        const asyncRoutes = await store.dispatch('router/generateRoutes')
        const accessedRoutes = formatRoutes(asyncRoutes)
        registerRoutes(router, accessedRoutes)
        console.log('权限守卫: 动态路由注册完成，重新跳转')
        // 使用replace避免重定向循环
        next({ ...to, replace: true })
      } catch (error) {
        console.error('生成路由失败:', error)
        store.commit('user/SET_TOKEN', '')
        next({ path: '/login', replace: true })
      }
    } else {
      // 已经注册了动态路由，直接放行
      console.log('权限守卫: 路由已注册，直接放行')
      next()
    }
  } else {
    // 没有token，检查是否在白名单
    if (whiteList.includes(to.path)) {
      next()
    } else {
      console.log('权限守卫: 无token访问受保护页面，跳转到登录页')
      next({ path: '/login', query: { redirect: to.path }, replace: true })
    }
  }
})

// 后置守卫
router.afterEach((to, from) => {
  console.log('权限后置守卫: 完成从', from.path, '到', to.path, '的跳转')
  // 可以在这里添加页面跳转后的逻辑，如页面切换动画、统计等
})

/**
 * 检查路由是否已注册
 * @param {Object} router - Vue Router实例
 * @returns {boolean} 是否已注册动态路由
 */
function hasRoutesRegistered(router) {
  const routes = router.getRoutes()
  // 检查是否已经注册了根路径路由（首页），这是动态路由的标识
  return routes.some(route => route.path === '/')
}