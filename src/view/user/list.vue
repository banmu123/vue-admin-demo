<template>
  <div class="user-list-container">
    <el-card>
      <template slot="header">
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" size="small" @click="handleAdd">添加用户</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next, jumper, total"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserList-Index',
  data() {
    return {
      searchForm: {
        username: '',
        status: ''
      },
      tableData: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          phone: '13800138000',
          role: '管理员',
          status: 1,
          createdAt: '2023-01-01 10:00:00'
        },
        {
          id: 2,
          username: 'editor',
          email: 'editor@example.com',
          phone: '13800138001',
          role: '编辑',
          status: 1,
          createdAt: '2023-01-02 10:00:00'
        },
        {
          id: 3,
          username: 'user1',
          email: 'user1@example.com',
          phone: '13800138002',
          role: '普通用户',
          status: 0,
          createdAt: '2023-01-03 10:00:00'
        }
      ],
      total: 3,
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    handleSearch() {
      // 搜索逻辑
      console.log('搜索', this.searchForm)
    },
    resetSearch() {
      this.searchForm = {
        username: '',
        status: ''
      }
    },
    handleAdd() {
      this.$router.push('/user/create')
    },
    handleEdit(row) {
      console.log('编辑用户', row)
      // 编辑逻辑，例如跳转到编辑页面并传递用户ID
    },
    handleDelete(row) {
      this.$confirm(`确定要删除用户「${row.username}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除用户', row)
        // 删除逻辑
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // 分页加载数据
    },
    handleSizeChange(val) {
      this.pageSize = val
      // 改变每页条数
    }
  }
}
</script>

<style lang="less" scoped>
.user-list-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>