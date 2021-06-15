const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  username: state => state.user.username,
  avatar: state => state.user.avatar,
  signature: state => state.user.signature,
  introduction: state => state.user.introduction
}
export default getters
