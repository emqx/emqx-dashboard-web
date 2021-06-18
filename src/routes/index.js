import Vue from 'vue'
import Router from 'vue-router'
import store from '@/stores'
import routes from './router'
import { toLogin, getBasicAuthInfo } from '../common/utils'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/modules/detail' || (to.meta.keepAlive && savedPosition)) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
  routes,
})

router.beforeEach((to, from, next) => {
  // console.log(to,from)
  const { fullPath } = to
  const { authRequired = false } = to?.matched[0]?.meta || to.meta
  // const { hideLeftBar: hideLeftBarForm = false } = from?.matched[0]?.meta || from.meta

  if (authRequired && !getBasicAuthInfo().username) {
    toLogin(fullPath)
  }
  next()
})

window.addEventListener('popstate', (e) => {
  console.log(e.state)
})

export default router
