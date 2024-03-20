<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <!-- 有头像显示头像，没有头像显示名字的第一个字 -->
          <!-- 可选链式操作符，当前面的是undefined时候不报错 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <!-- 用户名 -->
          <span class="name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/bubble486/hrsystem">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- prevent 可以阻止默认事件 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 使用element-ui 组件库中的dialog组件 -->
    <!-- visible 属性用来控制弹层的显示和隐藏；使用sync修饰，可以接收子组件传递的事件和值 -->
    <!-- 监听x的close事件，当事件发生时候执行重置表单关闭弹层的工作  -->
    <el-dialog width="500" title="修改密码" :visible.sync="showDialog" @close="btnCancle">
      <!-- el-form>el-form-item>el-input -->
      <el-form
        ref="passForm"
        label-width="120px"
        :model="passForm"
        :rules="passRules"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input
            v-model="passForm.confirmPassword"
            show-password
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            @click="btnOk"
          >确认修改</el-button>
          <el-button size="mini" @click="btnCancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false,
      passForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passRules: {
        oldPassword: [
          {
            required: true,
            message: '旧密码不能为空',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            trigger: 'blur',
            message: '新密码长度是6-16'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '重复密码不能为空',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            // 使用自定义校验 !!!一定使用箭头函数不然this不是vue实例
            validator: (rule, value, callback) => {
              if (value === this.passForm.newPassword) {
                callback()
              } else {
                callback(new Error('输入密码不一致'))
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    updatePassword() {
      this.showDialog = true
    },
    btnOk() {
      // 使用validate进行表单的校验 该方法需要传递一个回调函数，会返回一个isOk 为true就是校验成功
      this.$refs.passForm.validate(async(isOk) => {
        if (isOk === true) {
          // 调用接口
          await updatePassword(this.passForm)
          this.$message.success('修改密码成功')
          this.btnCancle()
        }
      })
    },
    btnCancle() {
      // 成功之后重置表单
      this.$refs.passForm.resetFields()
      // 关闭弹层
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .name {
          margin-right: 10px;
          font-size: 16px;
        }

        .username {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #04c9be;
          color: white;
          border-radius: 50%;
          margin-right: 7px;
        }

        .el-icon-setting {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
