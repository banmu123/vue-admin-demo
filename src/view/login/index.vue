<template>
    <!-- 登录页面 -->
    <div>
      <el-form ref="form" :model="loginForm" :rules="loginRules" class="loginContainer">
        <h3 class="formTitle">系统登录</h3>
        <el-form-item prop="username">
          <el-input type="text" autocomplate="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" autocomplate="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input type="text" class="codeInput" autocomplate="false" v-model="loginForm.code" placeholder="点击图片更换验证码"></el-input>
          <img :src="captchaUrl">
        </el-form-item>
        <el-form-item prop="isAgree">
          <el-checkbox class="loginRember" v-model="loginForm.isAgree">用户平台使用协议</el-checkbox>
          <el-button type="primary" class="loginBtn" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
 
<script>
export default {
    name: 'login-form',
    data() {
        return {
            // 表单字段
            loginForm: {
                username: '',  // 用户名
                password: '',  // 密码
                code: '',  // 验证码
                isAgree: false,  // 用户平台使用协议
            },
            captchaUrl: '', // 验证码图片地址
            // 校验规则
            loginRules: {
                username: [{
                    required: true,  // required只能检测 null undefined ""
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                code: [{
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                }],
                isAgree: [{
                     validator: (rule, value, callback) => {
                      // rule校验规则
                      // value 校验的值
                      // callback 函数 - promise resolve reject
                      // callback() callback(new Error(错误信息))
                      value ? callback() : callback(new Error('您必须勾选用户的使用协议'))
                    }
                }]
            }
        }
    },
    methods: {
        // 登录方法
        async submitForm() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    try {
                        // 调用登录action，等待登录完成
                        await this.$store.dispatch('user/login', this.loginForm)
                        // 登录成功后再跳转
                        this.$router.replace({ name: 'home' })
                    } catch (error) {
                        // 登录失败时显示错误信息
                        this.$message.error(error.message || '登录失败，请重试')
                    }
                } else {
                    this.$message.error('请输入所有字段并同意协议')
                    return false;
                }
            })
        }
    }
}
</script>
 
<style>
/* 登录表单 */
.loginContainer {
    width: 350px;
    padding: 15px 35px;
    margin: 80px auto;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 15px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
/* 表单标题 */
.formTitle {
    text-align: center;
    margin: 0 0 20px 0;
}
/* 验证码输入框 */
.codeInput {
    width: 65%;
}
/* 记住我 */
.loginRember {
    margin: 0 0 5px 0;
}
/* 登录按钮 */
.loginBtn {
    width: 100%
}
</style>