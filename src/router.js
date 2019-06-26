/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Layout from './components/Layout'
import Login from './views/Login'
import { toLogin, getBasicAuthInfo } from './common/utils'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (to.meta.keepAlive && savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        authRequired: false,
      },
      component: Login,
    },
    {
      path: '/',
      component: Layout,
      redirect: '/overview',
      children: [
        {
          path: '/overview',
          name: 'overview',
          component: () => import('@/views/Overview'),
        },
      ],
    },
    {
      path: '/rules',
      component: Layout,
      children: [
        {
          path: '',
          name: 'rules',
          component: () => import('@/views/RuleEngine/Rules'),
        },
        {
          path: 'create',
          name: 'rules-create',
          component: () => import('@/views/RuleEngine/RuleCreate'),
          meta: {
            hideLeftBar: true,
          },
        },
        {
          path: ':id',
          name: 'rules-view',
          component: () => import('@/views/RuleEngine/RuleView'),
        },
      ],
    },
    // 资源
    {
      path: '/resources',
      component: Layout,
      children: [
        {
          path: 'resources',
          name: 'resources',
          component: () => import('@/views/RuleEngine/Resources'),
        },
      ],
    },
    {
      path: '/alerts',
      component: Layout,
      redirect: '/alerts/list',
      children: [
        {
          path: 'list',
          name: 'alerts',
          component: () => import('@/views/Alerts/Alerts'),
        },
      ],
    },
    {
      path: '*',
      component: Layout,
      children: [
        {
          path: '',
          name: 'not-found',
          component: () => import('@/views/NotFound'),
        },
      ],
    },
  ],
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
