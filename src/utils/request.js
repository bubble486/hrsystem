import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 导入element-ui的方法
import { Message } from 'element-ui'

const service = axios.create({
  // 基地址 要根据不同的环境访问不同的测试接口
  // 执行dev时候使用/api 执行build时候使用/prod-api
  // baseURL: '/api',
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 120000
})

// 创建请求拦截器
// 传入两个函数参数 成功1 失败2
service.interceptors.request.use((config) => {
  // 注入token
  // 拿到vuex保管的store信息，
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  // 判断是否是blob格式的二进制文件流，如果是就直接返回
  if (response.data instanceof Blob) return response.data
  // 处理json格式的响应拦截器
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  if (error.response.status === 401) {
    Message({ type: 'warning', message: 'token超时' })
    // 如果响应状态码是401则说明是token失效
    // 调用action 退出登录 dispatch 是promise
    await store.dispatch('user/logout')
    router.push('/login')
    return Promise.reject(error)
  }
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})

export default service
