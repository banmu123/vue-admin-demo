// 导入需要的组件
import Layout from '@/layout/index.vue'
import IframeComponent from '@/components/Iframe.vue'

// 定义组件映射表 - 包含所有可能的路由路径
const componentMap = {
  // 首页相关
  '': () => import('@/view/home/index.vue'), // 首页特殊处理，空字符串对应根路径
  'home': () => import('@/view/home/index.vue'),
  
  // SSO单点登录相关
  'sso/login': () => import('@/view/sso/login.vue'),
  'sso/auth': () => import('@/view/sso/auth.vue'),
  'sso/callback': () => import('@/view/sso/callback.vue'),
  
  // 系统管理相关 - 一级路径
  'system': () => import('@/view/system/settings.vue'),
  
  // 用户管理相关 - 二级和三级路径
  'user/list': () => import('@/view/user/list.vue'),
  'user/create': () => import('@/view/user/create.vue'),
  
  // 角色管理相关 - 二级和三级路径
  'role/list': () => import('@/view/role/list.vue'),
  'role/permission': () => import('@/view/role/permission.vue'),
  
  // 内容管理相关
  'content': () => import('@/view/article/list.vue'),
  'article': () => import('@/view/article/list.vue'),
  'article/list': () => import('@/view/article/list.vue'),
  'article/create': () => import('@/view/article/create.vue'),
  
  // 系统设置相关
  'setting': () => import('@/view/system/settings.vue'),
  'system/config': () => import('@/view/system/settings.vue'),
  
  // 错误页面
  '404': () => import('@/view/error/404.vue'),
  
  // 特殊类型：iframe嵌入组件（直接返回组件，不需要动态导入）
  '__iframe__': IframeComponent
}

/**
 * 根据路径获取组件
 * @param {string} path - 路由路径
 * @param {string} fullPath - 完整路由路径（包含父路径）
 * @param {Object} meta - 路由元信息，可能包含iframe配置
 * @returns {Function|Object} 组件的动态导入函数或组件对象
 */
export function getComponentByPath(path, fullPath = null, meta = null) {
  // 检查是否为iframe类型的路由
  if (meta && meta.iframe && meta.iframe.url) {
    console.log('检测到iframe类型路由，使用IframeComponent组件:', meta.iframe.url)
    return componentMap['__iframe__']
  }
  
  // 去除路径前的斜杠，标准化路径格式
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const fullNormalizedPath = fullPath ? (fullPath.startsWith('/') ? fullPath.slice(1) : fullPath) : null
  
  console.log('获取组件 - 路径:', normalizedPath, '完整路径:', fullNormalizedPath)
  
  // 优先尝试使用完整路径匹配（如果提供）
  if (fullNormalizedPath && componentMap[fullNormalizedPath]) {
    console.log('使用完整路径匹配成功:', fullNormalizedPath)
    return componentMap[fullNormalizedPath]
  }
  
  // 尝试直接匹配
  if (componentMap[normalizedPath]) {
    console.log('直接匹配成功:', normalizedPath)
    return componentMap[normalizedPath]
  }
  
  // 如果没有精确匹配，尝试拆分路径进行匹配
  const pathSegments = normalizedPath.split('/')
  
  // 尝试不同级别的路径组合
  for (let i = pathSegments.length; i > 0; i--) {
    const partialPath = pathSegments.slice(0, i).join('/')
    if (componentMap[partialPath]) {
      console.log('找到部分匹配:', partialPath)
      return componentMap[partialPath]
    }
  }
  
  // 默认返回404组件
  console.log('未找到匹配组件，返回404组件')
  return componentMap['404']
}

/**
 * 格式化路由配置，添加组件信息
 * @param {Array} routes - 原始路由配置数组
 * @returns {Array} 格式化后的路由配置数组
 */
export function formatRoutes(routes) {
  console.log('开始格式化路由，原始路由数量:', routes.length)
  
  if (!routes || routes.length === 0) {
    console.log('无路由需要格式化')
    return []
  }
  
  // 处理所有顶级路由
  return routes.map(route => processRoute(route, true))
  
  /**
   * 处理单个路由配置
   * @param {Object} route - 单个路由配置
   * @param {boolean} isTopLevel - 是否为顶级路由
   * @returns {Object} 处理后的路由配置
   */
  function processRoute(route, isTopLevel) {
    // 创建一个新的路由对象，避免直接修改原始数据
    let processedRoute
    
    if (isTopLevel) {
      // 顶级路由使用Layout作为组件，包含children数组
      processedRoute = {
        path: route.path || '',
        name: route.name || '',
        meta: route.meta || {},
        component: Layout,
        children: []
      }
      
      // 为顶级路由添加默认子路由，用于显示实际内容
      const fullPath = route.path === '/' ? '' : route.path
      processedRoute.children.push({
        path: '',
        name: route.name ? (route.path === '/' ? route.name + 'Default' : route.name) : '',
        meta: route.meta || {},
        component: getComponentByPath(route.path, fullPath, route.meta),
        // 如果是iframe路由，添加props传递iframe配置
        ...(route.meta && route.meta.iframe ? {
          props: {
            url: route.meta.iframe.url,
            title: route.meta.title
          }
        } : {})
      })
      
      // 递归处理子路由，但不再包装Layout
      if (route.children && route.children.length > 0) {
        route.children.forEach(child => {
          const childRoute = processRoute(child, false)
          processedRoute.children.push(childRoute)
        })
      }
    } else {
      // 子路由直接使用对应的组件，不包装Layout
      const parentPath = isTopLevel ? '' : route.parentPath || ''
      const pathToUse = route.path || ''
      const fullPath = parentPath ? `${parentPath}/${pathToUse}` : pathToUse
      processedRoute = {
        path: pathToUse,
        name: route.name || '',
        meta: route.meta || {},
        component: getComponentByPath(pathToUse, fullPath, route.meta),
        // 如果是iframe路由，添加props传递iframe配置
        ...(route.meta && route.meta.iframe ? {
          props: {
            url: route.meta.iframe.url,
            title: route.meta.title
          }
        } : {})
      }
      
      // 递归处理子路由的子路由
      if (route.children && route.children.length > 0) {
        processedRoute.children = route.children.map(child => processRoute(child, false))
      }
    }
    
    return processedRoute
  }
}

/**
 * 注册动态路由
 * @param {VueRouter} router - Vue Router实例
 * @param {Array} routes - 格式化后的路由配置
 */
export function registerRoutes(router, routes) {
  console.log('开始注册动态路由:', routes.length, '个路由')
  
  // 先清除可能存在的404路由
  const existingRoutes = router.getRoutes()
  const notFoundRoute = existingRoutes.find(r => r.name === '404')
  if (notFoundRoute) {
    console.log('移除已存在的404路由')
    router.removeRoute('404')
  }
  
  // 注册所有路由
  routes.forEach(route => {
    console.log('注册路由:', route.path, '-', route.name)
    router.addRoute(route)
  })
  
  // 添加404路由作为最后一个路由
  const newNotFoundRoute = {
    path: '*',
    name: '404',
    component: componentMap['404'],
    meta: {
      title: '404页面不存在'
    }
  }
  
  console.log('注册404路由')
  router.addRoute(newNotFoundRoute)
  
  // 打印注册后的路由列表，用于调试
  const allRoutes = router.getRoutes()
  console.log('路由注册完成，当前注册的路由总数:', allRoutes.length)
  console.log('已注册的路由:', allRoutes.map(r => r.path))
}