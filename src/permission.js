// 设置路由守卫
import router from '@/router'
// 导入进度条及其样式
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 引入store
import store from '@/store'
/**
 * 前置路由守卫
 * 三个参数 to：去哪个页面 from：从哪跳转 next
 */
// 设置白名单 没有token也可以访问的页面
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  nprogress.start()
  // 如果存在token跳转到主页面
  if (store.getters.token) {
    // 如果是要访问登录页面则直接跳转到主页面
    if (to.path === '/login') {
      // next中存在路径就是 中转到该路径 ！！！不会执行后置路由守卫
      next('/')
      // 手动关闭进度条 不会执行后置路由守卫
      nprogress.done()
    } else {
      // 有token 判断是否获取过资料
      if (!store.getters.userId) {
        // 这个地方用await是为了后面的内容是请求成功之后才执行
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    // 没有token判断是否在白名单中
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nprogress.done()
    }
  }
})
/**
 * 后置路由守卫
 */
router.afterEach((to, from) => {
  // 关闭进度条
  nprogress.done()
})

