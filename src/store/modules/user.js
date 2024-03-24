import { setToken, getToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

const state = {
  token: getToken(),
  userInfo: {}
}

const mutations = {
  // 两个参数 state 和 data
  LOGIN(state, token) {
    state.token = token
    // 实现token的缓存
    // utils/auth.js包中已经写好了方法
    setToken(token)
  },
  LOGOUT(state) {
    state.token = null
    removeToken()
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  // 会收到两个参数 context上下文对象，data
  async login(context, loginForm) {
    // todo： 调用真正的登录接口 login登录接口返回的是promise对象， 如果正确返回 会经过响应拦截器，处理拿到data
    const token = await login(loginForm)
    // 先虚假返回一个token
    context.commit('LOGIN', token)
  },
  async getUserInfo(context) {
    const userInfo = await getUserInfo()
    // 调用api中 封装的请求用户数据接口
    context.commit('SET_USER_INFO', userInfo)
    return userInfo
  },
  logout(context) {
    // 删除token信息
    context.commit('LOGOUT')
    // 删除userInfo信息 就是给用户信息赋值一个空对象
    context.commit('SET_USER_INFO', {})
  }
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
