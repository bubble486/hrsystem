<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" />
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
          <el-button size="mini" type="primary">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <!-- 分页 -->
      </div>
    </div>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Employee',
  data() {
    return {
      depts: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 存储查询参数
      queryParams: {
        departmentId: null
      }
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
    },
    // 监听节点的切换状态 两个参数 当前节点数据 当前节点node
    selectNode(nodeData) {
      this.queryParams.departmentId = nodeData.id
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
