<template>
  <div class="system-settings-container">
    <el-card>
      <template slot="header">
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <!-- 系统设置表单 -->
      <el-form :model="settings" :rules="rules" ref="settingsForm" label-width="120px">
        <el-form-item label="网站名称" prop="siteName">
          <el-input v-model="settings.siteName" placeholder="请输入网站名称"></el-input>
        </el-form-item>
        
        <el-form-item label="网站描述" prop="siteDescription">
          <el-input 
            v-model="settings.siteDescription" 
            type="textarea" 
            rows="3" 
            placeholder="请输入网站描述"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="备案号" prop="recordNumber">
          <el-input v-model="settings.recordNumber" placeholder="请输入网站备案号"></el-input>
        </el-form-item>
        
        <el-form-item label="每页显示数量" prop="pageSize">
          <el-select v-model="settings.pageSize" placeholder="请选择每页显示数量">
            <el-option label="10条/页" value="10"></el-option>
            <el-option label="20条/页" value="20"></el-option>
            <el-option label="50条/页" value="50"></el-option>
            <el-option label="100条/页" value="100"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="自动保存时间" prop="autoSaveTime">
          <el-input-number 
            v-model="settings.autoSaveTime" 
            :min="30" 
            :max="300" 
            :step="10" 
            label="秒"
          ></el-input-number>
        </el-form-item>
        
        <el-form-item label="缓存有效期" prop="cacheExpiry">
          <el-select v-model="settings.cacheExpiry" placeholder="请选择缓存有效期">
            <el-option label="1小时" value="3600"></el-option>
            <el-option label="24小时" value="86400"></el-option>
            <el-option label="7天" value="604800"></el-option>
            <el-option label="30天" value="2592000"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="是否启用验证码" prop="enableCaptcha">
          <el-switch v-model="settings.enableCaptcha"></el-switch>
        </el-form-item>
        
        <el-form-item label="是否开放注册" prop="allowRegistration">
          <el-switch v-model="settings.allowRegistration"></el-switch>
        </el-form-item>
        
        <el-form-item label="上传文件大小限制" prop="maxUploadSize">
          <el-input-number 
            v-model="settings.maxUploadSize" 
            :min="1" 
            :max="100" 
            :step="1" 
            label="MB"
          ></el-input-number>
        </el-form-item>
        
        <el-form-item label="默认头像" prop="defaultAvatar">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :auto-upload="false"
          >
            <img v-if="settings.defaultAvatar" :src="settings.defaultAvatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存设置</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SystemSettings-Index',
  data() {
    return {
      settings: {
        siteName: '管理系统',
        siteDescription: '一个现代化的管理系统',
        recordNumber: '',
        pageSize: 20,
        autoSaveTime: 60,
        cacheExpiry: 86400,
        enableCaptcha: true,
        allowRegistration: true,
        maxUploadSize: 10,
        defaultAvatar: ''
      },
      rules: {
        siteName: [
          { required: true, message: '请输入网站名称', trigger: 'blur' },
          { min: 2, max: 50, message: '网站名称长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        pageSize: [
          { required: true, message: '请选择每页显示数量', trigger: 'change' }
        ],
        autoSaveTime: [
          { required: true, message: '请设置自动保存时间', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.loadSettings()
  },
  methods: {
    // 加载系统设置
    loadSettings() {
      // 模拟从服务器加载设置
      // 实际项目中应该从API获取数据
      console.log('加载系统设置')
      // 这里可以模拟异步加载
      setTimeout(() => {
        // 加载默认设置
      }, 300)
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
    handleUploadSuccess(response, file, fileList) {
      // 模拟上传成功
      this.settings.defaultAvatar = URL.createObjectURL(file.raw)
    },
    
    // 提交设置
    handleSubmit() {
      this.$refs.settingsForm.validate((valid) => {
        if (valid) {
          // 提交设置数据
          console.log('保存系统设置', this.settings)
          // 模拟保存成功
          this.$message({
            message: '系统设置保存成功',
            type: 'success'
          })
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },
    
    // 重置设置
    handleReset() {
      this.$confirm('确定要重置所有设置吗？这将丢失所有未保存的更改。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadSettings()
        this.$message({
          type: 'info',
          message: '设置已重置'
        })
      }).catch(() => {
        // 取消重置操作
      })
    }
  }
}
</script>

<style lang="less" scoped>
.system-settings-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .el-form {
    max-width: 800px;
  }
  
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  
  .el-form-item__label {
    font-weight: 500;
  }
}
</style>