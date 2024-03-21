import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartmentList() {
  return request({
    url: '/company/department'
  })
}
