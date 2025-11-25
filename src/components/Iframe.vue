<template>
  <div class="iframe-container">
    <!-- iframe加载状态 -->
    <!-- <div v-if="loading" class="iframe-loading">
      <el-alert :title="`正在加载 ${iframeTitle}`" type="info" :closable="false" show-icon>
        <template slot="description">
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="progress" :stroke-width="2" />
            </el-col>
          </el-row>
        </template>
      </el-alert>
    </div> -->
    
    <!-- iframe嵌入区域 -->
    <iframe
      ref="iframeRef"
      :src="iframeSrc"
      :title="iframeTitle"
      class="iframe-content"
      frameborder="0"
      scrolling="auto"
      @load="handleLoad"
      @error="handleError"
    ></iframe>
    
    <!-- 错误提示 -->
    <div v-if="error" class="iframe-error">
      <el-alert
        :title="`加载${iframeTitle}失败`"
        :description="errorMessage"
        type="error"
        show-icon
        :closable="false"
      >
        <div slot="actions">
          <el-button size="small" type="primary" @click="reloadIframe">重新加载</el-button>
        </div>
      </el-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IframeComponent',
  props: {
    // 外部网站URL
    url: {
      type: String,
      required: true
    },
    // 页面标题
    title: {
      type: String,
      default: '外部网站'
    }
  },
  data() {
    return {
      loading: true,
      progress: 0,
      error: false,
      errorMessage: '',
      progressTimer: null
    }
  },
  computed: {
    iframeSrc() {
      // 确保URL以http开头
      let url = this.url
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url
      }
      return url
    },
    iframeTitle() {
      return this.title || '外部网站'
    }
  },
  mounted() {
    // 模拟加载进度
    this.simulateProgress()
  },
  beforeDestroy() {
    // 清理定时器
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
    }
  },
  methods: {
    // 模拟加载进度
    simulateProgress() {
      this.progressTimer = setInterval(() => {
        if (this.progress < 90) {
          this.progress += Math.random() * 10
        }
      }, 200)
    },
    
    // 处理iframe加载完成
    handleLoad() {
      clearInterval(this.progressTimer)
      this.progress = 100
      this.loading = false
      this.error = false
      
      // 设置一个小延迟确保进度条动画完成
      setTimeout(() => {
        this.progress = 0
      }, 500)
      
      console.log('Iframe loaded successfully:', this.iframeSrc)
    },
    
    // 处理iframe加载错误
    handleError(event) {
      clearInterval(this.progressTimer)
      this.loading = false
      this.error = true
      this.errorMessage = '无法加载该网站，请检查URL是否正确或该网站是否允许嵌入iframe。'
      console.error('Iframe loading error:', event)
    },
    
    // 重新加载iframe
    reloadIframe() {
      this.loading = true
      this.error = false
      this.progress = 0
      this.simulateProgress()
      
      // 重新加载iframe
      if (this.$refs.iframeRef) {
        this.$refs.iframeRef.src = this.iframeSrc
      }
    }
  }
}
</script>

<style scoped>
.iframe-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f5f7fa;
}

.iframe-loading {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.iframe-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  z-index: 100;
}

.iframe-content {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 200px); /* 确保有最小高度 */
}
</style>