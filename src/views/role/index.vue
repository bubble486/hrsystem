<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog=true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <!-- table 数据的渲染是list中的数据 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" label="角色" width="200px" align="center">
          <template v-slot="{row}">
            <!-- 使用作用域插槽取到当前行的数据 -->
            <!-- 条件的判断 -->
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启用" width="200px" align="center">
          <!-- 自定义列结构 （插槽 -->
          <!-- row 是组件可以接收到的数据 -->
          <template v-slot="{row}">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>{{ row.state===1?"已启用": row.state===0 ? "未启用" : "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center">
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" rows="2" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <!-- 为了后面方便拿到数据使用template标签包裹 -->
          <template v-slot="{row}">
            <template v-if="row.isEdit">
              <!-- 编辑状态 -->
              <el-button size="mini" type="primary" @click="btnEditOk(row)">确认</el-button>
              <el-button size="mini" @click="row.isEdit=false">取消</el-button>
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <!-- 放置操作按钮 -->
              <!-- 点击按钮时候记录 当前id的值 -->
              <el-button size="mini" type="text" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button size="mini" type="text" @click="btnEditRow(row)">编辑</el-button>
              <!-- 使用气泡确认框包裹按钮 -->
              <el-popconfirm title="您确定要删除该管理员？" @onConfirm="confirmDelete(row.id)">
                <!-- 具名插槽 -->
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>

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
    <!-- 放置添加角色的弹层 -->
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
    <!-- 放置权限弹层 -->
    <el-dialog :visible.sync="showPermissionDialog" title="分配权限">
      <!-- 放置权限数据 -->
      <!-- node-key设置唯一标识  -->
      <!-- :default-checked-keys 告诉树组件选中哪些个 -->
      <el-tree
        ref="permTree"
        node-key="id"
        :data="permissionData"
        :props="{ label:'name', children: 'children'}"
        show-checkbox
        default-expand-all
        :default-checked-keys="permIds"
      />
      <el-row type="flex" justify="center" align="end">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="btnPermissionOk">确定</el-button>
          <el-button size="mini" @click="showPermissionDialog=false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, deleteRole, getRoleDetail, assginPerm } from '@/api/role'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'

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
      },
      showPermissionDialog: false,
      permissionData: [],
      // 记录当前选中的id
      currentId: null,
      // 标记哪些个权限被勾选
      permIds: []
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
      // 在获取数据之后对每一行 添加 一个编辑标记
      this.list.forEach(item => {
        // 添加一个属性 初始值为false
        // 这个地方不可以 this.isEdit = false
        // 数据不具有响应式！！！
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
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
    },
    btnEditRow(row) {
      // 点击编辑按钮
      row.isEdit = true
      // 更新缓存数据
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    async btnEditOk(row) {
      // 编辑情况下点击确定的方法
      if (row.editRow.name && row.editRow.description) {
        // 调用修改角色的接口
        await updateRole({ ...row.editRow, id: row.id })
        // 更新成功后提示消息
        this.$message.success('角色信息更新成功')
        // 退出编辑状态
        // 这里不调用获取接口是为了可以同时操作多个 table中的内容
        // this.getRoleList()
        // this.isEdit = false
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })
      } else {
        this.$message.warning('角色和描述不能为空')
      }
    },
    async confirmDelete(id) {
      await deleteRole(id)
      this.$message.success('删除角色成功')
      // 如果删除的是页数中的最后一个，需要请求前一页的数据
      if (this.list.length === 1) {
        this.pageParams.page--
      }
      this.getRoleList()
      // 如果还是拿出的不是最后一个，更新当前页面的数据
    },
    async btnPermission(id) {
      this.permissionData = transListToTreeData(await getPermissionList(), 0)
      this.currentId = id
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds
      this.showPermissionDialog = true
    },
    async btnPermissionOk() {
      await assginPerm({ id: this.currentId, permIds: this.$refs.permTree.getCheckedKeys() })
      // 成功
      this.$message.success('修改权限成功')
      this.showPermissionDialog = false
    }
  }
}
</script>
<style scoped>
  .role-operate{
    padding: 10px;
  }
</style>
