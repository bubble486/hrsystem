import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 取消引入mock 因为项目采用的是真实数据不是模拟数据
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// 设回中文
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 使用自定义指令封装，控制功能权限 注册指令时候不需要加v-
Vue.directive('permission', {
  inserted(el, binding) {
    const points = store.state.user.userInfo?.roles?.points || []
    if (!points.includes(binding.value)) {
      // 删除
      el.remove()
      // 禁用
      // el.disabled = true
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
