// 设置路由守卫
import router from '@/router'
// 导入进度条及其样式
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 引入store
import store from '@/store'
// 引入动态路由
import { asyncRouters } from '@/router'
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
        const { roles } = await store.dispatch('user/getUserInfo')
        // console.log(roles.menus)
        // console.log(asyncRouters)
        // 得到筛选后的路由
        const filterRouters = asyncRouters.filter(item => {
          return roles.menus.includes(item.name)
        })
        // 筛选动态路由信息后，将数据传到vuex中
        store.commit('user/SET_ROUTES', filterRouters)
        // 添加动态路由信息到router
        // 404的配置路由信息必须放在所有路由信息的最后
        router.addRoutes([...filterRouters, { path: '*', redirect: '/404', hidden: true }])
        // router添加路由之后需要转发一下 router的已知缺陷
        next(to.path)
      } else {
        next()
      }
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

