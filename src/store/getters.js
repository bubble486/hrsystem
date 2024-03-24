// 目的是便捷读取访问
const getters = {
  // 取app模块属性
  device: state => state.app.device,
  sidebar: state => state.app.sidebar,
  // 取user模块属性
  token: state => state.user.token,
  userId: state => state.user.userInfo.userId,
  avatar: state => state.user.userInfo.staffPhoto, // 头像
  name: state => state.user.userInfo.username, // 用户名
  routes: state => state.user.routes, // 路由信息
  company: state => state.user.userInfo.company, // 公司名称
  departmentName: state => state.user.userInfo.departmentName // 部门名称
}
export default getters
