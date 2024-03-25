<template>
  <div class="container">
    <div class="app-container">
      <!-- 添加一级权限 -->
      <el-button class="btn-add" size="mini" type="primary" @click="addPermission(0, 1)">添加权限</el-button>
      <el-table :data="list" row-key="id" default-expand-all="">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <!-- 表格里面的数据要在插槽中取 -->
          <template v-slot="{row}">
            <!-- 添加二级权限 -->
            <el-button v-if="row.type===1" size="mini" type="text" @click="addPermission(row.id, 2)">添加</el-button>
            <el-button size="mini" type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹层位置 -->
    <el-dialog :visible.sync="showDialog" :title="`${showText}权限`" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" size="mini" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" size="mini" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" size="mini" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="mini" type="primary" @click="btnOk">确认</el-button>
            <el-button size="mini" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, addPermission, updatePermission, getPermissionDetail, delPermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'

export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type: '',
        pid: ''
      },
      rules: {
        name: [{ trigger: 'blur', required: true, message: '权限不能为空' }],
        code: [{ trigger: 'blur', required: true, message: '标识不能为空' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), 0)
    },
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    btnOk() {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        //  提示消息
        this.$message.success(`${this.showText}成功`)
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 默认关闭
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    async editPermission(id) {
      // 根据获取id获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    // 删除操作
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
  .btn-add{
    margin: 10px;
  }
</style>
