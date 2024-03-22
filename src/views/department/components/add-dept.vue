<template>
  <el-dialog title="新增部门" :visible="showDialog" @close="close">
    <!-- 弹层内容 -->
    <el-form ref="addDept" label-width="120px" :model="addForm" :rules="addRules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addForm.name" placeholder="2-10个字符" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="addForm.code" placeholder="2-10个字符" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="managerId">
        <el-select v-model="addForm.managerId" placeholder="请选择负责人" style="width:80%" size="mini">
          <!-- 下拉选项 循环 负责人数据 -->
          <!-- label表示显示的字段 value表示存储字段 -->
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="addForm.introduce" placeholder="1-100个字符" type="textarea" :rows="4" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="btnOk">确认</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { getManagerList } from '@/api/department'
import { addDepartment } from '@/api/department'

export default {
  props: {
    showDialog: {
      default: false,
      type: Boolean
    },
    currentNodeId: {
      default: null,
      type: Number
    }
  },
  data() {
    return {
      // 存储负责人的列表
      managerList: [],
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
  created() {
    this.getManagerList()
  },
  methods: {
    close() {
      // 重置表单
      this.$refs.addDept.resetFields()
      // 修改父组件的值 子传父
      this.$emit('update:showDialog', false)
    },
    async getManagerList() {
      this.managerList = await getManagerList()
    },
    // 点击确定时候调用
    btnOk() {
      // 首先进行表单的整天校验
      this.$refs.addDept.validate(async isOk => {
        if (isOk) {
          // 调用新增dept接口
          await addDepartment({ ...this.addForm, pid: this.currentNodeId })
          // 通知父组件更新 给父组件绑定一个自定义事件，触发的时候，父组件重新获取数据渲染页面
          this.$emit('updateDepartment')
          // 提示消息
          this.$message.success('新增部门成功')
          // 重置表单 关闭弹层
          this.close()
        }
      })
    }
  }
}
</script>
