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
