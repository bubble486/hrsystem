import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  name: 'employee',
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  }, {
    // 员工详情页
    // 路由参数配置 ?代表参数可有可无
    path: '/employee/detail/:id?',
    component: () => import('@/views/employee/detail.vue'),
    name: 'detail',
    hidden: true,
    meta: {
      // 显示在导航栏
      title: '员工详情'
    }
  }]
}

// 只想在左侧菜单显示一级菜单的话 让二级路由只有一个显示在左侧菜单
