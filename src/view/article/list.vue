<template>
  <div class="article-list-container">
    <el-card>
      <template slot="header">
        <div class="card-header">
          <span>文章列表</span>
          <el-button type="primary" size="small" @click="handleAdd">创建文章</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="文章标题">
          <el-input v-model="searchForm.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类">
            <el-option label="前端开发" value="frontend"></el-option>
            <el-option label="后端开发" value="backend"></el-option>
            <el-option label="数据库" value="database"></el-option>
            <el-option label="运维部署" value="devops"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="已发布" value="published"></el-option>
            <el-option label="草稿" value="draft"></el-option>
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
        <el-table-column prop="title" label="文章标题"></el-table-column>
        <el-table-column prop="category" label="分类">
          <template slot-scope="scope">
            <el-tag :type="getCategoryType(scope.row.category)">{{ getCategoryLabel(scope.row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="views" label="浏览量"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'published' ? 'success' : 'info'">{{ scope.row.status === 'published' ? '已发布' : '草稿' }}</el-tag>
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
  name: 'ArticleList-Index',
  data() {
    return {
      searchForm: {
        title: '',
        category: '',
        status: ''
      },
      tableData: [
        {
          id: 1,
          title: 'Vue.js入门教程',
          category: 'frontend',
          author: 'admin',
          views: 1234,
          status: 'published',
          createdAt: '2023-01-01 10:00:00'
        },
        {
          id: 2,
          title: 'Spring Boot实战',
          category: 'backend',
          author: 'editor',
          views: 987,
          status: 'published',
          createdAt: '2023-01-02 10:00:00'
        },
        {
          id: 3,
          title: 'MySQL性能优化',
          category: 'database',
          author: 'admin',
          views: 567,
          status: 'draft',
          createdAt: '2023-01-03 10:00:00'
        },
        {
          id: 4,
          title: 'Docker容器化部署',
          category: 'devops',
          author: 'editor',
          views: 345,
          status: 'published',
          createdAt: '2023-01-04 10:00:00'
        }
      ],
      total: 4,
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    // 获取分类标签类型
    getCategoryType(category) {
      const typeMap = {
        frontend: 'primary',
        backend: 'success',
        database: 'warning',
        devops: 'info'
      }
      return typeMap[category] || 'default'
    },
    
    // 获取分类标签文本
    getCategoryLabel(category) {
      const labelMap = {
        frontend: '前端开发',
        backend: '后端开发',
        database: '数据库',
        devops: '运维部署'
      }
      return labelMap[category] || '其他'
    },
    
    handleSearch() {
      // 搜索逻辑
      console.log('搜索', this.searchForm)
    },
    
    resetSearch() {
      this.searchForm = {
        title: '',
        category: '',
        status: ''
      }
    },
    
    handleAdd() {
      this.$router.push('/article/create')
    },
    
    handleEdit(row) {
      console.log('编辑文章', row)
      // 编辑逻辑
    },
    
    handleDelete(row) {
      this.$confirm(`确定要删除文章「${row.title}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除文章', row)
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
.article-list-container {
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