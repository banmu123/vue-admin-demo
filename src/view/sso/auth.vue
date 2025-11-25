<template>
  <div class="sso-auth-container">
    <div class="auth-card">
      <h2 class="auth-title">统一身份认证服务
        <span class="demo-tag">演示环境</span>
      </h2>
      
      <div class="client-info">
        <p class="info-label">应用系统：</p>
        <p class="info-value">管理后台系统</p>
        <p class="info-label">请求ID：</p>
        <p class="info-value">{{ clientId }}</p>
      </div>
      
      <el-form 
        ref="loginForm" 
        :model="loginForm" 
        :rules="loginRules" 
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入统一账号" 
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入统一密码" 
            prefix-icon="el-icon-lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleSubmit" 
            style="width: 100%"
            :loading="loading"
          >
            登录认证
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="demo-tip">
        <p><el-icon name="el-icon-info" /> 演示账号：admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SsoAuth',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false,
      clientId: '',
      redirectUri: '',
      state: ''
    }
  },
  created() {
    // 从URL查询参数中获取配置信息
    this.clientId = this.$route.query.client_id || 'unknown'
    this.redirectUri = this.$route.query.redirect_uri || ''
    this.state = this.$route.query.state || ''
    
    console.log('SSO认证页面加载，参数:', {
      clientId: this.clientId,
      redirectUri: this.redirectUri,
      state: this.state
    })
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            // 在实际项目中，这里应该调用真实的认证API
            // 这里模拟认证过程
            await this.simulateAuth()
          } catch (error) {
            console.error('认证失败:', error)
            this.$message.error('认证失败，请重试')
          } finally {
            this.loading = false
          }
        }
      })
    },
    
    async simulateAuth() {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 简单的演示账号验证
      if (this.loginForm.username === 'admin' && this.loginForm.password === '123456') {
        // 生成模拟token（在实际项目中，应该由认证服务器返回）
        const mockToken = 'mock_sso_token_' + new Date().getTime()
        
        console.log('认证成功，生成token:', mockToken)
        
        // 构造回调URL
        // 注意：this.redirectUri是已经编码过的，需要解码使用
        let callbackUrl = ''
        if (this.redirectUri) {
          try {
            // 尝试解码获取原始的redirectUri
            callbackUrl = decodeURIComponent(this.redirectUri)
          } catch (e) {
            console.error('解码redirectUri失败，使用默认地址:', e)
            callbackUrl = window.location.origin + '/sso/callback'
          }
        } else {
          callbackUrl = window.location.origin + '/sso/callback'
        }
        
        // 追加查询参数
        const separator = callbackUrl.includes('?') ? '&' : '?'
        callbackUrl += `${separator}token=${mockToken}`
        
        // 如果有state参数，也追加到回调URL
        if (this.state) {
          callbackUrl += `&state=${encodeURIComponent(this.state)}`
        }
        
        console.log('重定向到应用回调URL:', callbackUrl)
        
        // 重定向回应用的回调页面
        window.location.href = callbackUrl
      } else {
        // 认证失败
        this.$message.error('用户名或密码错误，请使用演示账号')
      }
    }
  }
}
</script>

<style scoped>
.sso-auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.auth-card {
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.auth-title {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
  position: relative;
}

.demo-tag {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.client-info {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-label {
  font-size: 14px;
  color: #909399;
  margin: 0;
  line-height: 1.5;
}

.info-value {
  font-size: 16px;
  color: #303133;
  margin: 0 0 10px 0;
  font-weight: 500;
}

.login-form {
  margin-bottom: 20px;
}

.demo-tip {
  text-align: center;
  font-size: 14px;
  color: #606266;
  background-color: #ecf5ff;
  padding: 10px;
  border-radius: 4px;
}

.demo-tip p {
  margin: 0;
}
</style>