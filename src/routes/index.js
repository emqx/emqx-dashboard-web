/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/stores'
import routes from './router'
import { toLogin, getBasicAuthInfo } from '../common/utils'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/modules/detail' || (to.meta.keepAlive && savedPosition)) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
  routes,
})

router.beforeEach((form, to, next) => {
  const { authRequired = false, before, hideLeftBar = false } = to.meta
  const { hideLeftBar: hideLeftBarForm = false } = form.meta

  if (authRequired && !getBasicAuthInfo().username) {
    toLogin()
  } else {
    if (before) {
      before()
    }
    // 当前路由隐藏左侧菜单
    if (hideLeftBarForm !== hideLeftBar) {
      store.dispatch('SET_LEFT_BAR_COLLAPSE', !hideLeftBar)
    }
    next()
  }
})

export default router
