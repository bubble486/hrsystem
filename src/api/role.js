import request from '@/utils/request'

// 获取角色列表接口
// axios的查询参数传递方式
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 新增角色信息接口
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 修改角色信息的接口
export function updateRole(data) {
  return request({
    method: 'put',
    url: `/sys/role/${data.id}`,
    data
  })
}

// 删除角色信息接口
export function deleteRole(id) {
  return request({
    method: 'delete',
    url: `/sys/role/${id}`
  })
}

// 获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 给角色分配权限
export function assginPerm(data) {
  return request({
    method: 'put',
    url: '/sys/role/assignPrem',
    data
  })
}
