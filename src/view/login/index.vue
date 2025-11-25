<template>
    <!-- 登录页面 -->
    <div>
        <el-form ref="form" :model="loginForm" :rules="loginRules" class="loginContainer">
            <h3 class="formTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" autocomplate="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" autocomplate="false" v-model="loginForm.password"
                    placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" class="codeInput" autocomplate="false" v-model="loginForm.code"
                    placeholder="点击图片更换验证码"></el-input>
                <img :src="captchaUrl">
            </el-form-item>
            <el-form-item prop="isAgree">
                <el-checkbox class="loginRember" v-model="loginForm.isAgree">用户平台使用协议</el-checkbox>
                <el-button type="primary" class="loginBtn" @click="submitForm" :loading="loading">登录</el-button>
            </el-form-item>

            <div class="login-options">
                <div class="divider">
                    <span>或</span>
                </div>
                <el-button type="info" icon="el-icon-link" @click="goToSsoLogin" style="width: 100%">
                    使用SSO单点登录
                </el-button>
            </div>
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
            loading: false, // 登录按钮加载状态
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
            this.loading = true;
            try {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            // 调用登录action，等待登录完成
                            await this.$store.dispatch('user/login', this.loginForm)
                            console.log('登录成功，跳转到首页')
                            // 登录成功后跳转到首页，使用replace避免路由历史记录问题
                            this.$router.replace('/')
                        } catch (error) {
                            // 登录失败时显示错误信息
                            console.error('登录失败:', error)
                            this.$message.error(error.message || '登录失败，请重试')
                        } finally {
                            this.loading = false;
                        }
                    } else {
                        this.$message.error('请输入所有字段并同意协议')
                        return false;
                    }
                })
            } catch (error) {
                console.error('登录失败:', error)
                this.$message.error(error.message || '登录失败，请重试')
            }

        },
        // 跳转到SSO登录页面
        goToSsoLogin() {
            // 保存当前页面URL或首页，用于登录成功后正确跳转
            const redirectUrl = encodeURIComponent(window.location.href);
            // 跳转到SSO登录页面，携带重定向参数
            window.location.href = `/sso/login?redirect=${redirectUrl}`;
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
    margin-top: 10px;
    width: 100%;
}

.login-options {
    margin-top: 20px;
}

.divider {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #dcdfe6;
}

.divider span {
    padding: 0 10px;
    color: #909399;
    font-size: 14px;
}
</style>