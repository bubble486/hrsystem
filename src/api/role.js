import request from '@/utils/request'

// 获取角色列表接口
// axios的查询参数传递方式
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
