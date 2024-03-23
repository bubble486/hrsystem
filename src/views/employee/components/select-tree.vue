<template>
  <!-- element-ui 的级联组件 -->
  <!-- 使用options 属性指定 选项数组 就可以渲染级联选择器 -->
  <el-cascader
    :value="value"
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    @change="changeValue"
  />
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { transListToTreeData } from '@/utils'

export default {
  props: {
    value: {
      type: Number,
      default: null
    }
  },
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
    },
    changeValue(list) {
      // 传回来一个数组 取到数组的最后一位 是id
      if (list.length > 0) {
        // 将数组的最后一位取出 传给v-model的指令 v-model监听input事件 就接收到了数据
        this.$emit('input', list[list.length - 1])
      } else {
        // 如果没有内容 则值为空
        this.$emit('input', null)
      }
    }

  }
}
</script>
