<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 element-ui -->
      <!-- 两个属性 data 和 props el-tree 的 只是恰好重名 -->
      <el-tree default-expand-all :expand-on-click-node="false" :data="depts" :props="defaultProps">
        <!-- 使用element ui 设置的插槽功能 -->
        <!-- 使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据。 -->
        <!-- 节点数据是不断循环的，有多少个节点数据循环多少次 -->
        <template v-slot="{data}">
          <!-- 节点结构 -->
          <el-row style="width:100%;height:60px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- 下拉菜单监听事件的方法 command -->
              <!-- 需要知道是哪个部门添加子组件 -->
              <!-- 事件的默认参数 实参 $event -->
              <el-dropdown @command="operateDept($event,data.id)">
                <!-- 显示区内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单的选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹层 -->
    <!-- sync修饰符，可以监听子组件传过来的 update:属性名的事件，直接将父组件的值进行修改 -->
    <!-- ref 可以获取dom的实例对象 ref也可以获取自定义组件的实例对象 -->
    <addDept ref="addDept" :show-dialog.sync="showDialog" :current-node-id="currentNodeId" @updateDepartment="getDepartmentList" />
  </div>
</template>
<script>
import { getDepartmentList, deleteDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import addDept from './components/add-dept.vue'

export default {
  name: 'Department',
  components: { addDept },
  data() {
    return {
      // 定义数据
      currentNodeId: null, // 当前的id
      showDialog: false, // 控制弹层的显示和隐藏
      depts: [],
      defaultProps: {
        // 对象的两个属性
        label: 'name', // 要显示字段的名称
        children: 'children' // 读取子结点的字段名称
      }
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    // 定义获取数据的接口 不在created上面加async 存疑？
    async getDepartmentList() {
      const list = await getDepartmentList()
      this.depts = transListToTreeData(list, 0)
    },
    // 操作部门的方法
    operateDept(type, id) {
      // 处理弹出层的添加项
      if (type === 'add') {
        // 增加组件弹层
        this.showDialog = true
        this.currentNodeId = id
      } else if (type === 'edit') {
        // 处理表单弹出层的编辑选项
        // 弹出组件
        this.showDialog = true
        // 获取当前的id 用id 获取数据
        this.currentNodeId = id
        // 更新porps --异步
        // 直接调用子组件的方法 --同步
        // 在子组件中获取数据
        // 父组件调用子组件的方法获取数据 用ref
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail() // 等同于子组件的this
        })
      } else {
        // 删除部门
        this.$confirm('您确定要删除该部门吗？').then(async() => {
          await deleteDepartment(this.currentNodeId)
          this.$message.success('删除成功')
          // 重新获取department数据
          this.getDepartmentList()
        }).catch()
      }
    }
  }
}
</script>

<style scope>
  .app-container{
    padding: 30px 140px;
    font-size: 14px;
  }
  .tree-manager{
    width: 80px;
    display: inline-block;
    margin: 10px;
  }
</style>
