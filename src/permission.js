import router from '@/router'
import store from '@/store'
import { formatRoutes, registerRoutes } from '@/utils/router-util'

// 定义路由白名单，不需要token即可访问的路径
const whiteList = ['/login']

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
  
  // 1. 处理访问主页的情况
  if (to.path === '/') {
    if (hasToken) {
      // 有token，放行
      console.log('权限守卫: 访问主页，token存在，检查并注册路由')
      
      // 检查是否需要注册路由
      if (!hasRoutesRegistered(router)) {
        try {
          // 生成和注册路由
          await store.dispatch('router/generateRoutes')
          const accessedRoutes = formatRoutes(store.getters.addRoutes)
          registerRoutes(router, accessedRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          console.error('生成路由失败:', error)
          store.commit('user/SET_TOKEN', '')
          next({ path: '/login' })
        }
      } else {
        next()
      }
    } else {
      // 没有token，检查是否在白名单
      if (whiteList.includes(to.path)) {
        console.log('权限守卫: 访问主页，token不存在但在白名单中，放行')
        next()
      } else {
        console.log('权限守卫: 访问主页，token不存在且不在白名单中，跳转到登录页')
        next({ path: '/login' })
      }
    }
  }
  // 2. 处理访问登录页的情况
  else if (to.path === '/login') {
    if (hasToken) {
      console.log('权限守卫: 访问登录页，token存在，跳转到主页')
      next({ path: '/' })
    } else {
      console.log('权限守卫: 访问登录页，token不存在，放行')
      next()
    }
  }
  // 3. 处理其他路径的情况
  else {
    if (hasToken) {
      // 有token，检查并注册路由
      if (!hasRoutesRegistered(router)) {
        try {
          await store.dispatch('router/generateRoutes')
          const accessedRoutes = formatRoutes(store.getters.addRoutes)
          registerRoutes(router, accessedRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          console.error('生成路由失败:', error)
          store.commit('user/SET_TOKEN', '')
          next({ path: '/login' })
        }
      } else {
        next()
      }
    } else {
      // 没有token，检查是否在白名单
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next({ path: '/login' })
      }
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
  // 判断是否存在除了基础路由外的其他路由
  // 基础路由只有login路由，所以总路由数大于1表示已经注册了动态路由
  return routes.length > 1
}