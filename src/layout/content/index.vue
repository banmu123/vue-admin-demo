<template>
    <div class="content-index">
        <!-- 顶部导航栏 -->
        <div class="header">
            <div class="logo">
                <span>后台管理系统</span>
            </div>
            <!-- 右侧用户信息 -->
            <div class="user-info">
                <span class="username">管理员</span>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-setting"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>个人信息</el-dropdown-item>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        
        <!-- 标签卡区域 -->
        <div class="tags-container">
            <div class="tags-wrapper" ref="tagsWrapper">
                <transition-group name="tag" mode="out-in">
                    <div
                        v-for="tag in tags"
                        :key="tag.path"
                        :class="['tag-item', { 'active': currentPath === tag.path }]"
                        @click="goToRoute(tag.path)"
                    >
                        {{ tag.title }}
                        <!-- 可关闭的标签，首页除外 -->
                        <i
                            v-if="tag.path !== '/'"
                            class="el-icon-close"
                            @click.stop="closeTag(tag)"
                        ></i>
                    </div>
                </transition-group>
                <!-- 右侧滚动按钮 -->
                <div class="tags-scroll-btns">
                    <el-button
                        v-if="scrollOffset > 0"
                        size="mini"
                        icon="el-icon-arrow-left"
                        @click="scrollLeft"
                    ></el-button>
                    <el-button
                        v-if="showScrollRight"
                        size="mini"
                        icon="el-icon-arrow-right"
                        @click="scrollRight"
                    ></el-button>
                </div>
            </div>
        </div>
        
        <!-- 主内容区域 -->
        <div class="main">
            <router-view v-if="keepAliveRoutes.includes(currentPath)"></router-view>
            <router-view v-else :key="currentPath"></router-view>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Content-Index',
  data() {
    return {
      // 标签列表
      tags: [],
      // 当前路径
      currentPath: '',
      // 滚动偏移量
      scrollOffset: 0,
      // 是否显示右侧滚动按钮
      showScrollRight: false,
      // 需要keepAlive的路由
      keepAliveRoutes: []
    }
  },
  created() {
    // 初始化当前路径
    this.currentPath = this.$route.path
    // 初始化首页标签
    this.initTags()
  },
  mounted() {
    // 监听路由变化
    this.$router.afterEach((to) => {
      this.currentPath = to.path
      this.addTag(to)
      this.updateScrollStatus()
    })
    // 监听窗口大小变化
    window.addEventListener('resize', this.updateScrollStatus)
    // 初始化时更新滚动状态
    this.$nextTick(() => {
      this.updateScrollStatus()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateScrollStatus)
  },
  methods: {
    // 初始化标签
    initTags() {
      // 创建首页标签
      const defaultTag = {
        path: '/',
        title: '首页',
        name: this.$route.name || 'home'
      }
      
      // 清空现有标签
      this.tags = []
      
      // 添加当前路由标签
      const currentTag = {
        path: this.$route.path,
        title: this.$route.meta.title || this.$route.name || this.$route.path,
        name: this.$route.name
      }
      
      // 如果当前不是首页，需要同时添加首页标签和当前标签
      if (this.$route.path !== '/') {
        this.tags.push(defaultTag)
        this.tags.push(currentTag)
      } else {
        // 如果是首页，只添加首页标签
        this.tags.push(defaultTag)
      }
    },
    
    // 添加标签
    addTag(route) {
      const isExist = this.tags.some(tag => tag.path === route.path)
      if (!isExist && route.path !== '/') {
        const newTag = {
          path: route.path,
          title: route.meta.title || route.name || route.path,
          name: route.name
        }
        this.tags.push(newTag)
      }
    },
    
    // 跳转到对应路由
    goToRoute(path) {
      if (this.currentPath !== path) {
        this.$router.push(path)
      }
    },
    
    // 关闭标签
    closeTag(tag) {
      // 首页标签不能关闭
      if (tag.path === '/') return
      
      const index = this.tags.findIndex(item => item.path === tag.path)
      let activePath = this.currentPath
      
      // 如果关闭的是当前激活的标签
      if (activePath === tag.path) {
        // 找到上一个要激活的标签
        let prevTag = null
        if (index > 0) {
          prevTag = this.tags[index - 1]
        } else {
          prevTag = this.tags[1]
        }
        
        // 跳转到上一个标签
        this.$router.push(prevTag.path)
        activePath = prevTag.path
      }
      
      // 移除标签
      this.tags.splice(index, 1)
      this.$nextTick(() => {
        this.updateScrollStatus()
      })
    },
    
    // 滚动到左侧
    scrollLeft() {
      const tagsContainer = this.$refs.tagsWrapper
      const scrollDistance = tagsContainer.scrollWidth > 1000 ? 400 : 200
      tagsContainer.scrollLeft = Math.max(0, tagsContainer.scrollLeft - scrollDistance)
      this.scrollOffset = tagsContainer.scrollLeft
    },
    
    // 滚动到右侧
    scrollRight() {
      const tagsContainer = this.$refs.tagsWrapper
      const scrollDistance = tagsContainer.scrollWidth > 1000 ? 400 : 200
      const maxScroll = tagsContainer.scrollWidth - tagsContainer.clientWidth
      tagsContainer.scrollLeft = Math.min(maxScroll, tagsContainer.scrollLeft + scrollDistance)
      this.scrollOffset = tagsContainer.scrollLeft
    },
    
    // 更新滚动状态
    updateScrollStatus() {
      this.$nextTick(() => {
        const tagsContainer = this.$refs.tagsWrapper
        if (tagsContainer) {
          this.scrollOffset = tagsContainer.scrollLeft
          this.showScrollRight = 
            tagsContainer.scrollWidth > tagsContainer.clientWidth && 
            tagsContainer.scrollLeft < (tagsContainer.scrollWidth - tagsContainer.clientWidth)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content-index {
  display: flex;
  flex-direction: column;
  height: 100vh; // 占满整个视口高度
  background-color: #f5f7fa;
  
  .header {
    height: 60px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 10;
    
    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #409EFF;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .username {
        color: #606266;
      }
      
      .el-dropdown-link {
        cursor: pointer;
        color: #606266;
      }
    }
  }
  
  .tags-container {
    height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 10px;
    display: flex;
    align-items: center;
    position: relative;
    
    .tags-wrapper {
      flex: 1;
      height: 100%;
      overflow: hidden;
      position: relative;
      white-space: nowrap;
      
      .tag-item {
        display: inline-flex;
        align-items: center;
        height: 26px;
        padding: 0 12px;
        margin: 0 4px;
        background-color: #f5f7fa;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        color: #606266;
        transition: all 0.3s;
        
        &:hover {
          background-color: #ecf5ff;
          border-color: #d9ecff;
          color: #409EFF;
        }
        
        &.active {
          background-color: #ecf5ff;
          border-color: #409EFF;
          color: #409EFF;
        }
        
        .el-icon-close {
          margin-left: 4px;
          font-size: 12px;
          width: 16px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s;
          
          &:hover {
            background-color: #409EFF;
            color: #fff;
          }
        }
      }
      
      /* 标签过渡动画 */
      .tag-enter-active,
      .tag-leave-active {
        transition: all 0.3s ease;
      }
      
      .tag-enter-from {
        opacity: 0;
        transform: translateX(20px);
      }
      
      .tag-leave-to {
        opacity: 0;
        transform: translateX(-20px);
      }
    }
    
    .tags-scroll-btns {
      position: absolute;
      right: 10px;
      display: flex;
      gap: 5px;
    }
  }
  
  .main {
    flex: 1;
    padding: 20px;
    overflow: auto;
    background-color: #f5f7fa;
    
    /* 确保内容区域的高度随分辨率自适应 */
    min-height: 0; // 防止flex子元素溢出
  }
}
</style>