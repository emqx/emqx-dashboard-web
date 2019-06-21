/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
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
      redirect: '/rules/list',
      children: [
        {
          path: 'list',
          name: 'rules',
          component: () => import('@/views/RuleEngine/Rules'),
        },
        {
          path: 'create',
          name: 'rules-create',
          component: () => import('@/views/RuleEngine/RuleCreate'),
        },
        {
          path: ':id',
          name: 'rules-view',
          component: () => import('@/views/RuleEngine/RuleView'),
        },
        // 资源
        {
          path: 'resources',
          name: 'resources',
          component: () => import('@/views/RuleEngine/Resources'),
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
  const { authRequired = false } = to
  const userInfo = getBasicAuthInfo()
  if (!userInfo.username && authRequired) {
    toLogin()
  } else {
    next()
  }
})

export default router
