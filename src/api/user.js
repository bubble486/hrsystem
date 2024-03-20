import request from '@/utils/request'

// 封装请求接口 请求应该返回一个promise对象
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
