const getters = {
  token: state => state.user.token,
  routes: state => state.router.routes,
  addRoutes: state => state.router.addRoutes
}

export default getters