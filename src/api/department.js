import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartmentList() {
  return request({
    url: '/company/department'
  })
}

// 获取部门负责人的数据列表
export function getManagerList() {
  return request({
    url: '/sys/user/simple'
  })
}

// 新增部门接口
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 获取部门信息接口
export function getDepartmentDetial(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 更新部门信息接口
export function updataDepartmentDetial(data) {
  return request({
    method: 'put',
    url: `/company/department/${data.id}}`,
    data
  })
}

// 部门的删除接口
export function deleteDepartment(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}
