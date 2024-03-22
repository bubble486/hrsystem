<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary">添加角色</el-button>
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
  </div>
</template>
<script>
import { getRoleList } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      list: [],
      // 将分页信息，放到对象中
      pageParams: {
        page: 1, // 第几页
        pagesize: 5, // 每页多少条
        total: 0 // 总数
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
    }
  }
}
</script>
<style scoped>
  .role-operate{
    padding: 10px;
  }
</style>
