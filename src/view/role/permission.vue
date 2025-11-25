<template>
  <div class="role-permission-container">
    <el-card>
      <template slot="header">
        <div class="card-header">
          <span>权限分配</span>
          <el-button type="primary" size="small" @click="handleSubmit">保存权限</el-button>
        </div>
      </template>
      
      <el-form>
        <el-form-item label="角色名称">
          <el-input v-model="roleName" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="权限设置">
          <el-tree
            :data="permissionData"
            show-checkbox
            default-expand-all
            node-key="id"
            :check-strictly="false"
            :default-checked-keys="defaultCheckedKeys"
            @check="handleCheckChange"
          >
          </el-tree>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存权限</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RolePermission-Index',
  data() {
    return {
      roleName: '管理员',
      roleId: '',
      defaultCheckedKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      permissionData: [
        {
          id: 1,
          label: '系统管理',
          children: [
            {
              id: 2,
              label: '用户管理',
              children: [
                { id: 3, label: '查看用户' },
                { id: 4, label: '创建用户' },
                { id: 5, label: '编辑用户' },
                { id: 6, label: '删除用户' }
              ]
            },
            {
              id: 7,
              label: '角色管理',
              children: [
                { id: 8, label: '查看角色' },
                { id: 9, label: '创建角色' },
                { id: 10, label: '编辑角色' },
                { id: 11, label: '删除角色' },
                { id: 12, label: '分配权限' }
              ]
            }
          ]
        },
        {
          id: 13,
          label: '内容管理',
          children: [
            { id: 14, label: '文章管理' },
            { id: 15, label: '分类管理' },
            { id: 16, label: '标签管理' }
          ]
        },
        {
          id: 17,
          label: '系统设置',
          children: [
            { id: 18, label: '系统配置' },
            { id: 19, label: '操作日志' }
          ]
        }
      ]
    }
  },
  created() {
    // 从路由参数中获取角色ID
    const id = this.$route.query.id
    this.roleId = id || 1
    // 根据角色ID加载角色信息和权限数据
    this.loadRoleInfo()
    this.loadPermissionData()
  },
  methods: {
    // 加载角色信息
    loadRoleInfo() {
      // 模拟加载角色信息
      console.log('加载角色信息，角色ID：', this.roleId)
      // 根据角色ID设置不同的角色名称
      const roleNames = {
        '1': '管理员',
        '2': '编辑',
        '3': '普通用户'
      }
      this.roleName = roleNames[this.roleId] || '未知角色'
    },
    
    // 加载权限数据
    loadPermissionData() {
      // 模拟加载权限数据
      console.log('加载权限数据，角色ID：', this.roleId)
      // 根据不同角色设置不同的默认选中项
      if (this.roleId === '2') {
        // 编辑角色权限
        this.defaultCheckedKeys = [13, 14, 15, 16]
      } else if (this.roleId === '3') {
        // 普通用户权限
        this.defaultCheckedKeys = [13, 14]
      }
    },
    
    // 处理权限变更
    handleCheckChange(data, checkedInfo) {
      console.log('权限变更：', data, checkedInfo)
    },
    
    // 提交权限设置
    handleSubmit() {
      // 获取选中的权限ID
      const checkedKeys = this.$refs.tree.getCheckedKeys(true)
      console.log('保存权限设置：', {
        roleId: this.roleId,
        permissions: checkedKeys
      })
      
      this.$message({
        message: '权限设置保存成功',
        type: 'success'
      })
      
      // 保存成功后返回角色列表
      this.$router.push('/role/list')
    },
    
    // 取消操作
    handleCancel() {
      this.$router.push('/role/list')
    }
  }
}
</script>

<style lang="less" scoped>
.role-permission-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .el-tree {
    max-width: 800px;
  }
}
</style>