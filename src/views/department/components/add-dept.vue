<template>
  <el-dialog title="新增部门" :visible="showDialog" @close="close" />
</template>

<script>
export default {
  props: {
    showDialog: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    close() {
      // 修改父组件的值 子传父
      this.$emit('update:showDialog', false)
    }
  }
}
</script>
