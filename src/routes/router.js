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
  // 认证鉴权
  {
    path: '/users_and_acl',
    component: Layout,
    meta: {
      hideKey: 'usersAcl',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'users_and_acl',
        component: () => import('@/views/Plugins/PluginsManage'),
      },
    ],
  },
  // 连接
  {
    path: '/clients',
    component: Layout,
    meta: {
      hideKey: 'clients',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'clients',
        component: () => import('@/views/Clients/Clients'),
      },
      {
        path: 'detail',
        name: 'clients-view',
        component: () => import('@/views/Clients/ClientDetails'),
      },
    ],
  },
  // 主题
  {
    path: '/topics',
    component: Layout,
    meta: {
      hideKey: 'topics',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'topics',
        component: () => import('@/views/Topics/Topics'),
      },
    ],
  },
  // 订阅
  {
    path: '/subscriptions',
    component: Layout,
    meta: {
      hideKey: 'subscriptions',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'subscriptions',
        component: () => import('@/views/Subscriptions/Subscriptions'),
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
  // 备份
  {
    path: '/backup',
    component: Layout,
    meta: {
      hideKey: 'general',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'backup',
        component: () => import('@/views/General/Backup'),
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
  // 数据分析
  {
    path: '/topic_metrics',
    component: Layout,
    meta: {
      hideKey: 'topic_metrics',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'topic_metrics',
        component: () => import('@/views/Analysis/TopicMetrics'),
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
        meta: {
          keepAlive: true,
        },
      },
      {
        path: '/plugins/:pluginName',
        name: 'pluginsName',
        component: () => import('@/views/Plugins/PluginsManage'),
      },
    ],
  },
  // 模块
  {
    path: '/modules',
    component: Layout,
    meta: {
      hideKey: 'modules',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'modules',
        component: () => import('@/views/Modules/Modules'),
      },
      {
        path: 'select',
        name: 'modules-select',
        component: () => import('@/views/Modules/SelectModules'),
      },
      {
        path: 'detail',
        name: 'module-detail',
        component: () => import('@/views/Modules/ModuleDetail'),
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
    routes = routes.filter((route) => route.meta.hideKey !== hideRoute)
  })
}

export default routes
