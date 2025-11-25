<template>
  <div class="article-create-container">
    <el-card>
      <template slot="header">
        <div class="card-header">
          <span>创建文章</span>
          <el-button type="primary" size="small" @click="handleSubmit('published')">发布</el-button>
          <el-button size="small" @click="handleSubmit('draft')">保存草稿</el-button>
        </div>
      </template>
      
      <!-- 文章表单 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        
        <el-form-item label="文章分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="前端开发" value="frontend"></el-option>
            <el-option label="后端开发" value="backend"></el-option>
            <el-option label="数据库" value="database"></el-option>
            <el-option label="运维部署" value="devops"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="文章标签" prop="tags">
          <el-tag
            v-for="tag in form.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{tag}}
          </el-tag>
          <el-input
            v-model="inputTag"
            class="input-new-tag"
            placeholder="请输入标签"
            @keyup.enter.native="handleAddTag"
            @blur="handleAddTag"
          >
          </el-input>
        </el-form-item>
        
        <el-form-item label="文章内容" prop="content">
          <!-- 这里模拟富文本编辑器，实际项目中可以使用如TinyMCE、Quill等 -->
          <el-input
            v-model="form.content"
            type="textarea"
            rows="15"
            placeholder="请输入文章内容"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="封面图">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :auto-upload="false"
          >
            <img v-if="form.coverImage" :src="form.coverImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('published')">发布</el-button>
          <el-button @click="handleSubmit('draft')">保存草稿</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleCreate-Index',
  data() {
    return {
      form: {
        title: '',
        category: '',
        tags: [],
        content: '',
        coverImage: '',
        author: 'admin', // 默认作者
        status: 'draft'
      },
      inputTag: '',
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          { min: 10, message: '文章内容至少10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加标签
    handleAddTag() {
      const inputTag = this.inputTag.trim()
      if (inputTag && this.form.tags.indexOf(inputTag) === -1) {
        this.form.tags.push(inputTag)
      }
      this.inputTag = ''
    },
    
    // 移除标签
    handleClose(tag) {
      const index = this.form.tags.indexOf(tag)
      if (index !== -1) {
        this.form.tags.splice(index, 1)
      }
    },
    
    // 上传前校验
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    
    // 上传成功
    handleUploadSuccess(response, file) {
      // 模拟上传成功，实际项目中根据返回的URL设置封面图
      this.form.coverImage = URL.createObjectURL(file.raw)
    },
    
    // 提交表单
    handleSubmit(status) {
      this.form.status = status
      
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 提交表单数据
          console.log('提交表单', this.form)
          // 模拟保存成功
          this.$message({
            message: status === 'published' ? '文章发布成功' : '草稿保存成功',
            type: 'success'
          })
          // 保存成功后跳转回文章列表
          this.$router.push('/article/list')
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },
    
    // 取消操作
    handleCancel() {
      this.$confirm('确定要取消编辑吗？未保存的数据将丢失。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/article/list')
      }).catch(() => {
        // 取消操作，留在当前页面
      })
    }
  }
}
</script>

<style lang="less" scoped>
.article-create-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .el-button + .el-button {
      margin-left: 10px;
    }
  }
  
  .el-form {
    max-width: 900px;
  }
  
  .input-new-tag {
    width: 100px;
    margin-left: 10px;
  }
  
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 200px;
    height: 150px;
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  
  .avatar {
    width: 200px;
    height: 150px;
    display: block;
  }
}
</style>