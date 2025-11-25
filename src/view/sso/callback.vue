<template>
  <div class="sso-callback-container">
    <div class="loading-spinner">
      <el-spinner type="circle" size="large" />
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SsoCallback',
  data() {
    return {
      message: '正在处理SSO认证，请稍候...'
    }
  },
  created() {
    // 当组件创建时，解析URL中的token和其他参数
    this.handleCallback()
  },
  methods: {
    handleCallback() {
      // 从URL中获取查询参数
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const state = urlParams.get('state')
      const error = urlParams.get('error')
      
      console.log('SSO回调参数:', { token, state, error })
      
      if (error) {
        // 处理认证错误
        this.message = 'SSO认证失败: ' + error
        setTimeout(() => {
          this.$router.replace('/login')
        }, 2000)
        return
      }
      
      if (token) {
        // 成功获取token，存储到本地和Vuex中
        this.processToken(token, state)
      } else {
        this.message = '无效的SSO认证参数'
        setTimeout(() => {
          this.$router.replace('/login')
        }, 2000)
      }
    },
    
    processToken(token, state) {
      try {
        // 存储token到localStorage
        localStorage.setItem('token', token)
        // 提交到Vuex
        this.$store.commit('user/SET_TOKEN', token)
        
        this.message = 'SSO认证成功，正在跳转到应用...'
        
        // 解析state参数，获取原始请求的URL或默认返回首页
        let redirectUrl = '/' // 默认重定向到首页
        if (state) {
          try {
            const decodedState = JSON.parse(decodeURIComponent(state))
            if (decodedState.redirectUrl) {
              redirectUrl = decodedState.redirectUrl
            }
          } catch (e) {
            console.error('解析state参数失败:', e)
          }
        }
        
        // 使用$nextTick确保Vue响应式更新完成后再跳转，避免重定向冲突
        this.$nextTick(() => {
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            // 只在重定向地址为空、为根路径或包含登录相关路径时才跳转到首页
            // 使用window.location.href替代router跳转，避免重定向冲突警告
            let targetUrl = '/' // 默认跳转到首页
            if (redirectUrl && redirectUrl !== '/' && !redirectUrl.includes('/login') && !redirectUrl.includes('/sso/')) {
              targetUrl = redirectUrl
            }
            console.log('SSO认证成功，跳转到:', targetUrl)
            window.location.href = targetUrl
          }, 1000)
        })
        
      } catch (error) {
        console.error('处理SSO token失败:', error)
        this.message = 'SSO认证处理失败'
        setTimeout(() => {
          this.$router.replace('/login')
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
.sso-callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner p {
  margin-top: 20px;
  color: #606266;
  font-size: 16px;
}
</style>