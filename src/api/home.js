import request from '@/utils/request'

// 获取主页数据接口
export function getHomeData() {
  return request({
    url: '/home/data'
  })
}
