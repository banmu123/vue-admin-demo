<template>
  <div class="error-404-container">
    <div class="error-content">
      <div class="error-number">404</div>
      <div class="error-message">页面不存在</div>
      <p class="error-description">抱歉，您访问的页面不存在或已被移除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error-404-Index',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
.error-404-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f0f2f5;
  
  .error-content {
    text-align: center;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 60px 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    max-width: 500px;
    width: 100%;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .error-number {
      font-size: 120px;
      font-weight: bold;
      color: #409EFF;
      line-height: 1;
      margin-bottom: 20px;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        width: 100px;
        height: 8px;
        background-color: #409EFF;
        border-radius: 4px;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    
    .error-message {
      font-size: 32px;
      font-weight: 600;
      color: #303133;
      margin: 30px 0 15px;
    }
    
    .error-description {
      color: #909399;
      font-size: 16px;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    
    .el-button {
      font-size: 16px;
      padding: 12px 24px;
      border-radius: 6px;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

@media (max-width: 768px) {
  .error-404-container {
    .error-content {
      padding: 40px 20px;
      
      .error-number {
        font-size: 80px;
      }
      
      .error-message {
        font-size: 24px;
      }
    }
  }
}
</style>