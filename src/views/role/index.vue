<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog=true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" label="角色" width="200px" align="center" />
        <el-table-column prop="state" label="启用" width="200px" align="center">
          <!-- 自定义列结构 （插槽 -->
          <!-- row 是组件可以接收到的数据 -->
          <template v-slot="{row}">
            <span>{{ row.state===1?"已启用": row.state===0 ? "未启用" : "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center" />
        <el-table-column label="操作" align="center">
          <!-- 为了后面方便拿到数据使用template标签包裹 -->
          <template>
            <!-- 放置操作按钮 -->
            <el-button size="mini" type="text">分配权限</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <!-- el-row 是布局组件，可以设置相应的布局 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          layout="prev,pager,next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置弹层 -->
    <!-- 使用x按钮关闭表单时候不会 重置表单 监听close属性，触发btnCancel方法 -->
    <el-dialog title="新增角色" width="500px" :visible.sync="showDialog" @close="btnCancel">
      <!-- 表单内容 -->
      <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width:300px" size="mini" />
        </el-form-item>
        <!-- 不需要校验 可以不写prop 但是需要重置表单 需要prop -->
        <el-form-item prop="state" label="启用">
          <!-- active-value 和 inactive-value 属性可以值state中是布尔值还是number -->
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button size="mini" type="primary" @click="btnOk">确认</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>

        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      list: [],
      // 控制弹层显示隐藏
      showDialog: false,
      // 将分页信息，放到对象中
      pageParams: {
        page: 1, // 第几页
        pagesize: 3, // 每页多少条
        total: 0 // 总数
      },
      // 角色的表单对象
      roleForm: {
        name: '',
        description: '',
        state: 0
      },
      roleRules: {
        name: [{ required: true, message: '角色名称不能为空', tigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', tigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      // 后端默认是 1 页 10条
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows // 赋值数据
      this.pageParams.total = total
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getRoleList()
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    btnOk() {
      this.$refs.roleForm.validate(async isOk => {
        if (isOk) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    }
  }
}
</script>
<style scoped>
  .role-operate{
    padding: 10px;
  }
</style>
