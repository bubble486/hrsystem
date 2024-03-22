<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table>
        <!-- 放置列 -->
        <el-table-column label="角色" width="200px" align="center" />
        <el-table-column label="启用" width="200px" align="center" />
        <el-table-column label="描述" align="center" />
        <el-table-column label="操作" align="center" />
      </el-table>
      <!-- 放置分页组件 -->
      <!-- el-row 是布局组件，可以设置相应的布局 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination layout="prev,pager,next" />
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Role'
}
</script>
<style scoped>
  .role-operate{
    padding: 10px;
  }
</style>
