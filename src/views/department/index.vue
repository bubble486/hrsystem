<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 element-ui -->
      <!-- 两个属性 data 和 props el-tree 的 只是恰好重名 -->
      <el-tree default-expand-all="" :data="depts" :props="defaultProps">
        <!-- 使用element ui 设置的插槽功能 -->
        <!-- 使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据。 -->
        <!-- 节点数据是不断循环的，有多少个节点数据循环多少次 -->
        <template v-slot="{data}">
          <!-- 节点结构 -->
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <el-dropdown>
                <!-- 显示区内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单的选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                  <el-dropdown-item>编辑部门</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>

    </div>
  </div>
</template>
<script>
export default {
  name: 'Department',
  data() {
    return {
      // 定义数据
      depts: [{
        name: '传智教育',
        managerName: '张三',
        children: [{
          name: '总裁办',
          managerName: '李四'
        }, {
          name: '行政部',
          managerName: '王五'
        }, {
          name: '人事部',
          managerName: '赵六'
        }]
      }],
      defaultProps: {
        // 对象的两个属性
        label: 'name', // 要显示字段的名称
        children: 'children' // 读取子结点的字段名称
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
    width: 50px;
    display: inline-block;
    margin: 10px;
  }
</style>
