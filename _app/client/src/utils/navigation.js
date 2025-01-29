let router

export const setRouter = (vueRouter) => {
  router = vueRouter
}

export const navigate = (path) => {
  if (router) {
    router.push(path)
  }
}
