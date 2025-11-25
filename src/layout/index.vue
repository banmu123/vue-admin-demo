<template>
<!-- 页面布局 -->
  <div class="layout">
    <!-- 左侧导航 -->
    <div class="menu" :class="{ 'menu-collapsed': isMenuCollapsed }">
      <Menu @menu-collapsed="handleMenuCollapse"></Menu>
    </div>
    <!-- 右侧内容 -->
    <div class="content" :class="{ 'content-collapsed': isMenuCollapsed }">
      <Content></Content>
    </div>
  </div>
</template>
<script>
import Menu from './menu/index.vue'
import Content from './content/index.vue'
export default {
    name: 'Layout-Index',
  components: {
    Menu,
    Content
  },
  data() {
    return {
      isMenuCollapsed: false // 菜单是否收缩
    }
  },
  methods: {
    // 处理菜单收缩状态变化
    handleMenuCollapse(isCollapsed) {
      this.isMenuCollapsed = isCollapsed;
    }
  }
}
</script>
<style lang="less" scoped>
  .layout {
    display: flex;
    height: 100vh; // 占满整个视口高度
    overflow: hidden;
    
    .menu {
      transition: width 0.3s;
      width: 200px;
      background-color: #888;
      position: relative;
      flex-shrink: 0;
      
      &.menu-collapsed {
        width: 64px;
      }
    }
    
    .content {
      flex: 1;
      transition: padding-left 0.3s;
      padding-left: 0;
      overflow: hidden;
      
      &.content-collapsed {
        padding-left: 0;
      }
    }
  }
</style>