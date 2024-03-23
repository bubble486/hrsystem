import request from '@/utils/request'

// 获取员工列表
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

// 导出员工excel接口
export function exportEmployee() {
  return request({
    url: '/sys/user/export',
    // 改变接收类型 使用blob格式接收二进制文件流
    responseType: 'blob'
  })
}

// 下载导出模板的接口
export function getExportTemplate() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob'
  })
}

// 上传excel接口
export function uploadExcel(data) {
  // data 的类型应为formData
  return request({
    method: 'post',
    url: '/sys/user/import',
    data
  })
}

// 删除员工信息接口
export function delEmployee(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

// 新增员工接口
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

// 获取员工详情的接口
export function getEmployeeDetail(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
