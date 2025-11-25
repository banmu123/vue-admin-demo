<template>
  <div class="menu-container">
    <!-- 可收缩的侧边菜单 -->
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :router="true"
      :unique-opened="true"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <!-- 动态渲染菜单 -->
      <template v-for="(item, index) in routes">
        <!-- 首页作为特殊处理，直接显示为菜单项 -->
        <el-menu-item v-if="item.path === '/'" :index="item.path" :key="'home-' + index">
          <i :class="item.meta.icon"></i>
          <span slot="title">{{item.meta.title}}</span>
        </el-menu-item>
        
        <!-- 有子菜单的情况 -->
        <el-submenu v-else-if="item.children && item.children.length > 0" :index="item.name || index.toString()" :key="'submenu-' + index">
          <template slot="title">
            <i :class="item.meta.icon"></i>
            <span slot="title">{{item.meta.title}}</span>
          </template>
          
          <!-- 二级菜单 -->
          <template v-for="(subItem, subIndex) in item.children">
            <!-- 有三级子菜单的情况 -->
            <el-submenu v-if="subItem.children && subItem.children.length > 0" :index="subItem.name || subIndex.toString()" :key="'subsubmenu-' + subIndex">
              <template slot="title">{{subItem.meta.title}}</template>
              
              <!-- 三级菜单 -->
              <el-menu-item
                v-for="(thirdItem, thirdIndex) in subItem.children"
                :key="'thirdmenu-' + thirdIndex"
                :index="thirdItem.path"
              >
                {{thirdItem.meta.title}}
              </el-menu-item>
            </el-submenu>
            
            <!-- 只有二级菜单的情况 -->
            <el-menu-item
              v-else
              :index="subItem.path"
              :key="'menu-' + subIndex"
            >
              <i v-if="subItem.meta.icon" :class="subItem.meta.icon"></i>
              <span slot="title">{{subItem.meta.title}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        
        <!-- 没有子菜单的情况 -->
        <el-menu-item v-else :index="item.path" :key="'normal-menu-' + index">
          <i :class="item.meta.icon"></i>
          <span slot="title">{{item.meta.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
    
    <!-- 收缩/展开按钮 -->
    <div class="collapse-btn" @click="toggleCollapse">
      <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'menu-component',
  computed: {
    ...mapGetters(['routes'])
  },
  data() {
    return {
      isCollapse: false // 是否收缩菜单
    }
  },
  created() {
    // 如果路由数据为空，尝试从store获取
    if (!this.routes || this.routes.length === 0) {
      this.$store.dispatch('router/generateRoutes')
    }
  },
  methods: {
    // 切换菜单收缩状态
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      // 触发事件，通知父组件菜单状态变化
      this.$emit('menu-collapsed', this.isCollapse);
    }
  },
  // 监听路由变化，保持菜单激活状态
  watch: {
    $route: {
      handler(to) {
        // 确保当前路由在菜单中高亮显示
        const menu = document.querySelector(`.el-menu-item[Index="${to.path}"]`)
        if (menu) {
          menu.click()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.menu-container {
  height: 100%;
  position: relative;
  
  .el-menu-vertical-demo {
    height: 100%;
    border-right: 0;
    overflow-y: auto;
    
    &:not(.el-menu--collapse) {
      width: 200px;
    }
    
    &.el-menu--collapse {
      width: 64px;
    }
  }
  
  .collapse-btn {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    color: #606266;
    
    &:hover {
      color: #409EFF;
      background-color: #ecf5ff;
    }
  }
}
</style>