import request from '@/utils/request'

// 获取主页数据接口
export function getHomeData() {
  return request({
    url: '/home/data'
  })
}

// 获取通知数据接口
export function getHomeNotice() {
  return request({
    url: '/home/notice'
  })
}
