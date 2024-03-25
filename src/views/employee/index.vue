<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          :data="depts"
          :props="defaultProps"
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button v-permission="'add-employee'" size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog=true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{row}">
              <el-avatar v-if="row.staffPhoto" :size="30" :src="row.staffPhoto" />
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment===1">正式</span>
              <span v-else-if="row.formOfEmployment===2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template v-slot="{ row }">
              <!-- 在路由跳转的时候采用路由参数进行数据的传递 -->
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <!-- 点击角色的时候获取用户的id -->
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-popconfirm title="您确定要删除该行数据吗？" @onConfirm="confirmDelete(row.id)">
                <!-- 具名插槽 -->
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height:60px" type="flex" align="middle" justify="end">
          <el-pagination
            layout="total,prev,pager,next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <!-- 放置导入的组件 -->
    <!-- 监听uploadSuccess 事件 成功之后调用函数 -->
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getDepartmentList" />
    <!-- 点击角色弹出层 -->
    <el-dialog :visible.sync="showRolelDialog" title="分配角色">
      <!-- 弹层内容 -->
      <!-- el-checkbox-group -->
      <el-checkbox-group v-model="roleIds">
        <!-- 循环n个 el-checkbox 要存储的值是label属性绑定的值 -->
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="btnRoleOk">确认</el-button>
          <el-button size="mini" @click="showRolelDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, exportEmployee, delEmployee, getEnableRoleList, getEmployeeDetail, assginRoles } from '@/api/employee'
import { getDepartmentList } from '@/api/department'
import { transListToTreeData } from '@/utils'
import FileSaver from 'file-saver'
import ImportExcel from './components/import-excel.vue'

export default {
  name: 'Employee',
  components: { ImportExcel },
  data() {
    return {
      // 存放树形列表的数据
      depts: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 存储查询参数
      queryParams: {
        page: 1,
        pagesize: 3,
        departmentId: null,
        keyword: ''
      },
      // 存放员工列表的数据
      list: [],
      // 记录员工的总数
      total: 0,
      // 控制excel弹层的显示和隐藏
      showExcelDialog: false,
      // 控制显示角色弹层的变量
      showRolelDialog: false,
      // 接收角色列表
      roleList: [],
      // 用于 checkbox-group的双向绑定 存储选中的列表
      roleIds: [],
      // 记录当前点击的用户id
      currentUserId: null
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList() {
      this.depts = transListToTreeData(await getDepartmentList(), 0)
      // 记录节点
      this.queryParams.departmentId = this.depts[0].id

      // 树组件的渲染是异步的
      this.$nextTick(() => {
        // setCurrentKey方法需要绑定node-key作为唯一标识
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      // 这个时候参数记录了id
      this.getEmployeeList()
    },
    // 监听节点的切换状态 两个参数 当前节点数据 当前节点node
    selectNode(nodeData) {
      // 重新记录了节点id
      this.queryParams.departmentId = nodeData.id
      // 实现了切换节点的时候查询不同的员工列表
      // 在查询之前应该把人员列表的page改为1
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    async getEmployeeList() {
      const { total, rows } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    // 切换页码的事件
    changePage(newPage) {
      this.queryParams.page = newPage
      this.getEmployeeList()
    },
    // input框内容改变时触发
    changeValue() {
    // 进行防抖处理，单位时间内只执行最后一次
      clearTimeout(this.timer) // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 400)
    },
    // 导出员工excel方法
    async exportEmployee() {
      const result = await exportEmployee()
      // 之前响应拦截器默认处理json格式的数据，现在需要处理blob格式
      // 使用npm包 将文件保存
      console.log(result)
      // FileSaver.saveAs(blob对象，文件名称)
      FileSaver.saveAs(result, '员工列表.xlsx')
    },
    // 删除员工
    async confirmDelete(id) {
      // 调用删除接口
      await delEmployee(id)
      // 成功 重新获取数据
      this.$message.success('删除员工信息成功')
      // 如果是一页的最后一个
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      this.getDepartmentList()
    },
    async btnRole(id) {
      this.roleList = await getEnableRoleList()
      // 记录当前点击的id 后面要 确定和取消时后存取给用户
      this.currentUserId = id
      const { roleIds } = await getEmployeeDetail(id)
      this.roleIds = roleIds
      this.showRolelDialog = true
    },
    async btnRoleOk() {
      await assginRoles({ id: this.currentUserId, roleIds: this.roleIds })
      // 成功 提示消息关闭弹层
      this.$message.success('修改用户权限成功')
      this.showRolelDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
