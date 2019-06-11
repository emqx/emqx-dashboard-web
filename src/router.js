import Vue from 'vue'
import Router from 'vue-router'
import Layout from './components/Layout'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Layout,
      children: [
        {
          path: '',
          name: 'overview-home',
          component: () => import('@/views/Overview')
        }
      ],
    },
    {
      path: '*',
      name: 'not-found',
      component: Layout,
      children: [
        {
          path: '',
          name: 'not-found-home',
          component: () => import('@/views/NotFound')
        }
      ],
    },
  ],
})
