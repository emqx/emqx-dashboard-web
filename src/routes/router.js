/* eslint-disable */
import Layout from '@/components/Layout'
import SelectModules from '@/views/Modules/SelectModules'
import ModuleDetail from '@/views/Modules/ModuleDetail'
import RuleCreate from '@/views/RuleEngine/RuleCreate'
import SchemasDetails from '@/views/Schemas/SchemasDetails'

let routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      authRequired: false,
    },
    component: () => import('@/views/Base/Login'),
  },
  {
    path: '/',
    redirect: '/dashboard',
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/overview',
    meta: {
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/views/Dashboard/Overview'),
      },
      {
        path: 'nodes',
        name: 'nodes',
        component: () => import('@/views/Dashboard/Nodes'),
      },
      {
        path: 'metrics',
        name: 'metrics',
        component: () => import('@/views/Dashboard/Metrics'),
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
        path: 'detail/:clientId',
        name: 'clients-detail',
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

  // 规则
  {
    path: '/ruleengine',
    component: Layout,
    redirect: '/ruleengine/rules',
    meta: {
      hideKey: 'rules',
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: 'rules',
        name: 'rules',
        component: { template: `<router-view></router-view>` },
        children: [
          {
            path: '',
            component: () => import('@/views/RuleEngine/Rules'),
          },
          {
            path: 'create',
            name: 'rules-create',
            component: RuleCreate,
          },
          {
            path: 'edit/:ruleId',
            name: 'rules-edit',
            component: RuleCreate,
          },
          {
            path: 'detail/:ruleId',
            name: 'rules-detail',
            component: () => import('@/views/RuleEngine/RuleDetail'),
          },
        ],
      },

      // 资源
      {
        path: 'resources',
        name: 'resources',
        meta: {
          hideKey: 'rules',
          authRequired: true,
        },
        component: { template: `<router-view></router-view>` },
        children: [
          {
            path: '',
            component: () => import('@/views/RuleEngine/Resources'),
          },
          {
            path: 'detail/:resId',
            name: 'resources-detail',
            component: () => import('@/views/RuleEngine/ResourceDetail'),
          },
        ],
      },
      // Schemas
      {
        path: 'schemas',
        meta: {
          hideKey: 'schemas',
          authRequired: true,
        },
        component: { template: `<router-view></router-view>` },
        children: [
          {
            path: '',
            component: () => import('@/views/Schemas/Schemas'),
          },
          {
            path: 'create',
            component: () => import('@/views/Schemas/SchemasCreate'),
          },
          {
            path: 'detail',
            name: 'schemas-details',
            component: SchemasDetails,
          },
        ],
      },
    ],
  },

  // 告警
  {
    path: '/alarm',
    component: Layout,
    meta: {
      hideKey: 'alarm',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'alarm',
        component: () => import('@/views/Alarm/Alarm'),
      },
    ],
  },
  // 工具
  {
    path: '/tools',
    component: Layout,
    redirect: '/tools/websocket',
    meta: {
      hideKey: 'tools',
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: 'websocket',
        name: 'websocket',
        component: () => import('@/views/Tools/WebSocket'),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: 'httpapi',
        name: 'httpapi',
        component: () => import('@/views/Tools/Httpapi'),
      },
    ],
  },

  // 在线 Trace
  // {
  //   path: '/trace',
  //   component: Layout,
  //   meta: {
  //     hideKey: 'general',
  //     authRequired: true,
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'trace',
  //       component: () => import('@/views/General/LogTrace'),
  //     },
  //   ],
  // },
  {
    path: '/general',
    component: Layout,
    redirect: '/general/application',
    meta: {
      hideKey: 'general',
      authRequired: true,
      subMenu: true,
    },
    children: [
      // 插件
      {
        path: 'plugins',
        component: { template: `<router-view></router-view>` },
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
            path: 'plugins/:pluginName',
            name: 'pluginsName',
            component: () => import('@/views/Plugins/PluginsManage'),
          },
        ],
      },
      // 应用
      {
        path: 'application',
        component: () => import('@/views/General/Application'),
        meta: {
          hideKey: 'general',
          authRequired: true,
        },
      },
      // 用户
      {
        path: 'users',
        component: () => import('@/views/General/Users'),
        meta: {
          hideKey: 'general',
          authRequired: true,
        },
      },
      // 黑名单
      {
        path: 'blacklist',
        component: () => import('@/views/General/Blacklist'),
        meta: {
          hideKey: 'general',
          authRequired: true,
        },
      },
      // 备份
      {
        path: 'backup',
        component: () => import('@/views/General/Backup'),
        meta: {
          hideKey: 'general',
          authRequired: true,
        },
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
      {
        path: ':part',
        name: 'setting-part',
        component: () => import('@/views/Settings/Settings'),
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
        component: SelectModules,
      },
      {
        path: 'detail',
        name: 'module-detail',
        component: ModuleDetail,
      },
    ],
  },
  {
    path: '*',
    meta: {},
    name: 'not-found',
    component: () => import('@/views/Base/NotFound'),
  },
]

export default routes
