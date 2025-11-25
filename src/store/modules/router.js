const state = {
  routes: JSON.parse(localStorage.getItem('routes')) || [], // 完整路由
  addRoutes: JSON.parse(localStorage.getItem('addRoutes')) || [] // 动态添加的路由
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes
    // 将路由数据存储到localStorage中，实现页面刷新后保持路由状态
    localStorage.setItem('routes', JSON.stringify(routes))
    localStorage.setItem('addRoutes', JSON.stringify(routes))
  },
  RESET_ROUTES: (state) => {
    state.routes = []
    state.addRoutes = []
    // 清除localStorage中的路由数据
    localStorage.removeItem('routes')
    localStorage.removeItem('addRoutes')
  }
}

const actions = {
  // 生成路由
  generateRoutes({ commit }) {
    return new Promise((resolve) => {
      // 模拟从后端获取路由数据
      const asyncRoutes = [
        {
          path: '/',
          name: 'home',
          meta: {
            title: '首页',
            icon: 'el-icon-s-home',
            affix: true
          }
        },
        {
          path: '/sso',
          name: 'sso',
          meta: {
            title: 'SSO单点登录',
            icon: 'el-icon-link'
          },
          children: [
            {
              path: '/sso/login',
              name: 'ssoLogin',
              meta: {
                title: 'SSO登录演示',
                icon: 'el-icon-user'
              }
            }
          ]
        },
        {
          // 添加iframe嵌入示例 - 使用维基百科（允许iframe嵌入）
          path: '/external',
          name: '外部链接',
          icon: 'link',
          meta: {
            title: '外部链接',
            iframe: {
              url: 'https://element.eleme.cn/2.14/#/zh-CN/component/quickstart' // Vue.js维基百科页面
            }
          }
        },
        {
          path: '/system',
          name: 'system',
          meta: {
            title: '系统管理',
            icon: 'el-icon-menu'
          },
          children: [

            {
              path: '/user/list',
              name: 'userList',
              meta: {
                title: '用户列表',
                icon: 'el-icon-s-order'
              }
            },
            {
              path: '/user/create',
              name: 'userCreate',
              meta: {
                title: '创建用户',
                icon: 'el-icon-plus'
              }
            },
            {
              path: '/role/list',
              name: 'roleList',
              meta: {
                title: '角色列表',
                icon: 'el-icon-s-order'
              }
            },
            {
              path: '/role/permission',
              name: 'rolePermission',
              meta: {
                title: '权限分配',
                icon: 'el-icon-key'
              }
            }

          ]
        },
        {
          path: '/content',
          name: 'content',
          meta: {
            title: '内容管理',
            icon: 'el-icon-document'
          },
          children: [
            {
              path: '/article/list',
              name: 'articleList',
              meta: {
                title: '文章列表',
                icon: 'el-icon-document'
              }
            },
            {
              path: '/article/create',
              name: 'articleCreate',
              meta: {
                title: '创建文章',
                icon: 'el-icon-edit'
              }
            }
          ]
        },
        {
          path: '/setting',
          name: 'setting',
          meta: {
            title: '系统设置',
            icon: 'el-icon-setting'
          },
          children: [
            {
              path: '/system/config',
              name: 'systemConfig',
              meta: {
                title: '系统配置',
                icon: 'el-icon-cog'
              }
            },
            {
              path: '/system/log',
              name: 'systemLog',
              meta: {
                title: '操作日志',
                icon: 'el-icon-document-copy'
              }
            }
          ]
        },
      ]

      commit('SET_ROUTES', asyncRoutes)
      resolve(asyncRoutes)
    })
  },

  // 重置路由
  resetRoutes({ commit }) {
    commit('RESET_ROUTES')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}