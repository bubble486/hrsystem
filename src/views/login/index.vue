<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <!-- el-form > el-form-item > el-input -->
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <!-- element ui 的功能，将表单校验的规则写在rules属性中 使用prop属性就可以是使用规则校验 -->
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <!-- 使用show-password属性进行密码的加密 （UI库） -->
            <el-input v-model="loginForm.password" placeholder="请输入密码" show-password />
          </el-form-item>
          <!-- 勾选框 -->
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">用户平台使用协议</el-checkbox>
          </el-form-item>
          <!-- button -->
          <el-form-item>
            <el-button style="width:350px" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        mobile: '',
        password: '',
        isAgree: false
      },
      loginRules: {
        // 校验手机号 require是是否必填，message是提示消息，trigger是什么时候触发 blur 失去焦点触发
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          // 正则匹配手机号
          pattern: /^1[3-9]\d{9}$/,
          message: '请输入正确的手机号',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 16,
          message: '密码长度应为6-16位',
          trigger: 'blur'
        }],
        isAgree: [{
          // require 只能检测 null undefined "" 不能检测布尔类型
          // validator 自定义规则校验方式
          validator: (rule, value, callback) => {
            // rule规则
            // value检查的数据 true/false
            // callback 函数 执行这个函数
            // 成功执行callback 失败也执行callback(错误对象 new Error(错误信息))
            value ? callback() : callback(new Error('您必须勾选用户协议'))
          }
        }]
      }
    }
  },
  methods: {
    login() {
      // 获得表单的实例对象this.$refs.form 对实例对象调用validate方法进行数据的整体校验
      // 该函数可以传递回调函数
      this.$refs.form.validate((isOk) => {
        if (isOk) {
          // 登录之后服务器返回一个token，使用vuex进行管理
          // 调用vuex提供的action 使用了模块化暴露的方式
          this.$store.dispatch('user/login', this.loginForm)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
</style>

