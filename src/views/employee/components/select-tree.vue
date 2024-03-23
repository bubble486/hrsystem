<template>
  <!-- element-ui 的级联组件 -->
  <!-- 使用options 属性指定 选项数组 就可以渲染级联选择器 -->
  <el-cascader
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
  />
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { transListToTreeData } from '@/utils'

export default {
  data() {
    return {
      // 赋值给级联组件的options
      treeData: [],
      // props 可以让级联组件更改渲染数据的名字
      props: {
        // 要展示的字段
        label: 'name',
        // 要存储的数据
        value: 'id'
      }
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    // getTreeData
    async getTreeData() {
      // 获取组织列表的数据
      this.treeData = transListToTreeData(await getDepartmentList(), 0)
    }

  }
}
</script>
