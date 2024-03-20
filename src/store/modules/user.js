import { setToken, getToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken()
}

const mutations = {
  // 两个参数 state 和 data
  LOGIN(state, data) {
    state.token = data
    // 实现token的缓存
    // utils/auth.js包中已经写好了方法
    setToken(data)
  },
  LOGOUT() {
    removeToken()
    state.token = null
  }
}

const actions = {
  // 会收到两个参数 context上下文对象，data
  async login(context, data) {
    // todo： 调用真正的登录接口 login登录接口返回的是promise对象， 如果正确返回 会经过响应拦截器，处理拿到data
    const token = await login(data)
    console.log(token)
    // 先虚假返回一个token
    context.commit('LOGIN', token)
  }
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
