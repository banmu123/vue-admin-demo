<template>
  <div class="sso-login-container">
    <div class="login-card">
      <h2 class="login-title">SSO单点登录演示</h2>
      
      <div class="login-description">
        <p>通过统一身份认证服务，您可以使用一套凭证访问多个应用系统。</p>
        <p>本页面展示了SSO单点登录的前端流程演示。</p>
      </div>
      
      <div class="login-actions">
        <el-button 
          type="primary" 
          size="large" 
          @click="initiateSsoLogin"
          class="sso-button"
        >
          <el-icon name="el-icon-link" />
          开始SSO登录流程
        </el-button>
        
        <el-button 
          size="large" 
          @click="backToNormalLogin"
          class="back-button"
        >
          返回常规登录
        </el-button>
      </div>
      
      <div class="process-steps">
        <h3 class="steps-title">SSO登录流程说明:</h3>
        <div class="step-item">
          <div class="step-number">1</div>
          <div class="step-content">点击"开始SSO登录流程"按钮</div>
        </div>
        <div class="step-item">
          <div class="step-number">2</div>
          <div class="step-content">跳转到SSO认证服务器（模拟）</div>
        </div>
        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-content">认证通过后重定向回应用</div>
        </div>
        <div class="step-item">
          <div class="step-number">4</div>
          <div class="step-content">在callback页面处理认证结果并登录系统</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SsoLogin',
  methods: {
    initiateSsoLogin() {
      // 创建state参数，用于保存原始请求信息和防止CSRF攻击
      const state = {
        redirectUrl: this.$route.query.redirect || '/', // 登录成功后跳转的URL
        timestamp: new Date().getTime(),
        nonce: Math.random().toString(36).substring(2, 15) // 随机字符串
      }
      
      // 编码state参数
      const encodedState = encodeURIComponent(JSON.stringify(state))
      
      // 这里模拟SSO认证服务器地址
      // 在实际项目中，应该跳转到真实的SSO认证服务器URL
      const ssoServerUrl = '/sso/auth' // 模拟的SSO服务器认证地址
      
      // 构造完整的跳转URL，包含client_id、redirect_uri和state等参数
      const redirectUri = encodeURIComponent(window.location.origin + '/sso/callback')
      const clientId = 'demo_client_id' // 客户端ID，实际项目中应该使用真实的ID
      
      // 保存state到localStorage，用于后续验证（防止CSRF攻击）
      localStorage.setItem('sso_state', encodedState)
      
      console.log('开始SSO登录流程，state:', state)
      
      // 跳转到模拟的SSO认证服务器
      this.$router.push({
        path: ssoServerUrl,
        query: {
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: 'token',
          state: encodedState
        }
      })
    },
    
    backToNormalLogin() {
      // 返回到传统登录页面
      this.$router.replace({
        path: '/login',
        query: { redirect: this.$route.query.redirect }
      })
    }
  }
}
</script>

<style scoped>
.sso-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 500px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
}

.login-description {
  margin-bottom: 30px;
  color: #606266;
  line-height: 1.8;
}

.login-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.sso-button {
  height: 40px;
}

.back-button {
  height: 40px;
}

.process-steps {
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
}

.steps-title {
  font-size: 16px;
  margin-bottom: 15px;
  color: #303133;
}

.step-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.step-number {
  width: 24px;
  height: 24px;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  margin-right: 12px;
}

.step-content {
  color: #606266;
  font-size: 14px;
}
</style>