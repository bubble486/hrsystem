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
