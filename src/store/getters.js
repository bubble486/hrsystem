// 目的是便捷读取访问
const getters = {
  // 取app模块属性
  device: state => state.app.device,
  sidebar: state => state.app.sidebar,
  // 取user模块属性
  token: state => state.user.token,
  userId: state => state.user.userInfo.userId,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
