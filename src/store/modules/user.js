import { setToken, getToken, removeToken } from '@/utils/auth'

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
  login(context, data) {
    console.log(data)
    // todo： 调用真正的登录接口
    // 先虚假返回一个token
    context.commit('LOGIN', '123456')
  }
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
