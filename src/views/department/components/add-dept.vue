<template>
  <el-dialog title="新增部门" :visible="showDialog" @close="close">
    <!-- 弹层内容 -->
    <el-form :ref="addDept" label-width="120px" :model="addForm" :rules="addRules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addForm.name" placeholder="2-10个字符" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="addForm.code" placeholder="2-10个字符" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="managerId">
        <el-select v-model="addForm.managerId" placeholder="请选择负责人" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="addForm.introduce" placeholder="1-100个字符" type="textarea" :rows="4" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="12">
            <el-button size="mini" type="primary">确认</el-button>
            <el-button size="mini">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getDepartmentList } from '@/api/department'

export default {
  props: {
    showDialog: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      addForm: {
        name: '',
        code: '',
        managerId: '',
        introduce: '',
        pid: ''
      },
      addRules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: '部门名称不能为空'
        }, {
          min: 2,
          max: 10,
          trigger: 'blur',
          message: '应该输入2-10个字符'
        }, {
          trigger: 'blur',
          // 使用自定义校验方法  !!!箭头函数
          validator: async(rule, value, callback) => {
            // value 是输入的编码
            const result = await getDepartmentList()
            // 如果获取到的列表中存在数据,返回error
            if (result.some(item => item.name === value)) {
              callback(new Error('部门中已经有该名称了'))
            } else {
              callback()
            }
          }
        }],
        code: [{
          required: true,
          trigger: 'blur',
          message: '部门编码不能为空'
        }, {
          min: 2,
          max: 10,
          trigger: 'blur',
          message: '应该输入2-10个字符'
        }, {
          trigger: 'blur',
          // 使用自定义校验方法  !!!箭头函数
          validator: async(rule, value, callback) => {
            // value 是输入的编码
            const result = await getDepartmentList()
            // 如果获取到的列表中存在数据,返回error
            if (result.some(item => item.code === value)) {
              callback(new Error('部门中已经存在该编码'))
            } else {
              callback()
            }
          }
        }],
        managerId: [{
          required: true,
          trigger: 'blur',
          message: '部门负责人不能为空'
        }],
        introduce: [{
          required: true,
          trigger: 'blur',
          message: '部门介绍不能为空'
        }, {
          min: 1,
          max: 100,
          trigger: 'blur',
          message: '应该输入1-100个字符'
        }]
        // pid暂时不需要进行校验
      }
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
