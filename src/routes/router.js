/* eslint-disable */
import Layout from '@/components/Layout'
import store from '@/stores'

const hide = store.state.config.hide || { routes: [], children: [] }

let routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      hideKey: 'base',
      authRequired: false,
    },
    component: () => import('@/views/Base/Login'),
  },
  {
    path: '/login/:username/:password',
    name: 'login-no-auth',
    meta: {
      hideKey: 'base',
      authRequired: false,
    },
    component: () => import('@/views/Base/Login'),
  },
  {
    path: '/',
    component: Layout,
    redirect: '/monitor',
    meta: {
      hideKey: 'monitor',
      authRequired: true,
    },
    children: [
      {
        path: '/monitor',
        name: 'monitor',
        component: () => import('@/views/Overview/Overview'),
      },
      {
        path: '/monitor/node',
        name: 'node',
        component: () => import('@/views/Overview/Node'),
      },
    ],
  },
  // 连接
  {
    path: '/connections',
    component: Layout,
    meta: {
      hideKey: 'connections',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'connections',
        component: () => import('@/views/Connections/Connections'),
      },
      {
        path: 'detail',
        name: 'connections-view',
        component: () => import('@/views/Connections/ConnectionView'),
      },
    ],
  },
  // Schemas
  {
    path: '/schemas',
    component: Layout,
    meta: {
      hideKey: 'schemas',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'schemas',
        component: () => import('@/views/Schemas/Schemas'),
      },
      {
        path: ':id',
        name: 'schemas-details',
        component: () => import('@/views/Schemas/SchemasDetails'),
      },
    ],
  },
  // 规则
  {
    path: '/rules',
    component: Layout,
    meta: {
      hideKey: 'rules',
      authRequired: true,
    },
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
    meta: {
      hideKey: 'rules',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'resources',
        component: () => import('@/views/RuleEngine/Resources'),
      },
      {
        path: ':id',
        name: 'resources-view',
        component: () => import('@/views/RuleEngine/ResourceView'),
      },
    ],
  },
  // 告警
  {
    path: '/alerts',
    component: Layout,
    redirect: '/alerts/list',
    meta: {
      hideKey: 'alerts',
      authRequired: true,
    },
    children: [
      {
        path: 'list',
        name: 'alerts',
        component: () => import('@/views/Alerts/Alerts'),
      },
    ],
  },
  // 工具
  {
    path: '/websocket',
    component: Layout,
    meta: {
      hideKey: 'tools',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'websocket',
        component: () => import('@/views/Tools/WebSocket'),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  // 黑名单
  {
    path: '/blacklist',
    component: Layout,
    meta: {
      hideKey: 'general',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'blacklist',
        component: () => import('@/views/General/Blacklist'),
      },
    ],
  },
  // 应用
  {
    path: '/application',
    component: Layout,
    meta: {
      hideKey: 'general',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'application',
        component: () => import('@/views/General/Application'),
      },
    ],
  },
  // 用户
  {
    path: '/users',
    component: Layout,
    meta: {
      hideKey: 'general',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/General/Users'),
      },
    ],
  },
  // 设置
  {
    path: '/setting',
    component: Layout,
    meta: {
      hideKey: 'setting',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'setting',
        component: () => import('@/views/Settings/Settings'),
      },
    ],
  },
  // 插件
  {
    path: '/plugins',
    component: Layout,
    meta: {
      hideKey: 'plugins',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'plugins',
        component: () => import('@/views/Plugins/Plugins'),
      },
      {
        path: ':name',
        name: 'plugins-config',
        component: () => import('@/views/Plugins/PluginView'),
      },
    ],
  },
  {
    path: '*',
    component: Layout,
    meta: {},
    children: [
      {
        path: '',
        name: 'not-found',
        component: () => import('@/views/Base/NotFound'),
      },
    ],
  },
]

if (hide.routes && hide.routes.length) {
  hide.routes.forEach((hideRoute) => {
    routes = routes.filter(route => route.meta.hideKey !== hideRoute)
  })
}

export default routes
