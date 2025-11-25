<template>
  <div class="role-list-container">
    <el-card>
      <template slot="header">
        <div class="card-header">
          <span>角色列表</span>
          <el-button type="primary" size="small" @click="handleAdd">添加角色</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="角色描述"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="handlePermission(scope.row)">权限设置</el-button>
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
  name: 'RoleList-Index',
  data() {
    return {
      searchForm: {
        name: ''
      },
      tableData: [
        {
          id: 1,
          name: '管理员',
          description: '系统管理员，拥有所有权限',
          createdAt: '2023-01-01 10:00:00'
        },
        {
          id: 2,
          name: '编辑',
          description: '内容编辑，拥有内容管理权限',
          createdAt: '2023-01-02 10:00:00'
        },
        {
          id: 3,
          name: '普通用户',
          description: '普通用户，拥有基础操作权限',
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
        name: ''
      }
    },
    handleAdd() {
      console.log('添加角色')
      // 添加角色逻辑
    },
    handleEdit(row) {
      console.log('编辑角色', row)
      // 编辑角色逻辑
    },
    handlePermission(row) {
      // 跳转到权限设置页面
      this.$router.push(`/role/permission?id=${row.id}`)
    },
    handleDelete(row) {
      this.$confirm(`确定要删除角色「${row.name}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除角色', row)
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
.role-list-container {
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