import Layout from '@/components/Layout'
import NotFound from '@/views/Base/NotFound'
// import SelectModules from '@/views/Modules/SelectModules'
// import ModuleDetail from '@/views/Modules/ModuleDetail'
// import RuleCreate from '@/views/RuleEngine/RuleCreate'
// import SchemasDetails from '@/views/Schemas/SchemasDetails'
import Overview from '@/views/Dashboard/Overview'
import Nodes from '@/views/Dashboard/Nodes'
import Metrics from '@/views/Dashboard/Metrics'
import Clients from '@/views/Clients/Clients'
import ClientDetails from '@/views/Clients/ClientDetails'
import Topics from '@/views/Topics/Topics'
import Subscriptions from '@/views/Subscriptions/Subscriptions'
import Users from '@/views/General/Users'
import Advanced from '@/views/Advanced/Advanced'
import TopicMetrics from '@/views/Tools/TopicMetrics'
import Login from '@/views/Base/Login'
import Blacklist from '@/views/General/Blacklist'
import Gateway from '@/views/Gateway/Gateway'
import GatewayDetail from '@/views/Gateway/GatewayDetail'

let routes = [
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
    redirect: '/login',
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
        component: Overview,
      },
      {
        path: 'nodes',
        name: 'nodes',
        component: Nodes,
      },
      {
        path: 'metrics',
        name: 'metrics',
        component: Metrics,
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
        component: Clients,
      },
      {
        path: 'detail/:clientId',
        name: 'clients-detail',
        component: ClientDetails,
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
        component: Topics,
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
        component: Subscriptions,
      },
    ],
  },

  // // 规则
  // {
  //   path: '/ruleengine',
  //   component: Layout,
  //   redirect: '/ruleengine/rules',
  //   meta: {
  //     hideKey: 'rules',
  //     authRequired: true,
  //     subMenu: true,
  //   },
  //   children: [
  //     {
  //       path: 'rules',
  //       component: { template: `<router-view></router-view>` },
  //       children: [
  //         {
  //           path: '',
  //           name: 'rules',
  //           component: () => import('@/views/RuleEngine/Rules'),
  //         },
  //         {
  //           path: 'create',
  //           name: 'rules-create',
  //           component: RuleCreate,
  //         },
  //         {
  //           path: 'edit/:ruleId',
  //           name: 'rules-edit',
  //           component: RuleCreate,
  //         },
  //         {
  //           path: 'detail/:ruleId',
  //           name: 'rules-detail',
  //           component: () => import('@/views/RuleEngine/RuleDetail'),
  //         },
  //       ],
  //     },

  //     // 资源
  //     {
  //       path: 'resources',
  //       meta: {
  //         hideKey: 'rules',
  //         authRequired: true,
  //       },
  //       component: { template: `<router-view></router-view>` },
  //       children: [
  //         {
  //           path: '',
  //           name: 'resources',
  //           component: () => import('@/views/RuleEngine/Resources'),
  //         },
  //         {
  //           path: 'detail/:resId',
  //           name: 'resources-detail',
  //           component: () => import('@/views/RuleEngine/ResourceDetail'),
  //         },
  //       ],
  //     },
  //     // Schemas
  //     {
  //       path: 'schemas',
  //       meta: {
  //         hideKey: 'schemas',
  //         authRequired: true,
  //       },
  //       component: { template: `<router-view></router-view>` },
  //       children: [
  //         {
  //           path: '',
  //           component: () => import('@/views/Schemas/Schemas'),
  //         },
  //         {
  //           path: 'create',
  //           component: () => import('@/views/Schemas/SchemasCreate'),
  //         },
  //         {
  //           path: 'detail',
  //           name: 'schemas-details',
  //           component: SchemasDetails,
  //         },
  //       ],
  //     },
  //   ],
  // },

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
  {
    path: '/advanced',
    component: Layout,
    meta: {
      hideKey: 'advanced',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'advanced',
        component: Advanced,
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
        path: 'topic-metrics',
        name: 'topic-metrics',
        component: TopicMetrics,
      },
      // {
      //   path: 'httpapi',
      //   name: 'httpapi',
      //   component: () => import('@/views/Tools/Httpapi'),
      // },
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

  // 黑名单
  {
    path: '/blacklist',
    meta: {
      hideKey: 'blacklist',
      authRequired: true,
    },
    component: Layout,
    children: [
      {
        path: '',
        name: 'blacklist',
        component: Blacklist,
      },
    ],
  },
  // 用户
  {
    path: '/users',
    component: Layout,
    meta: {
      hideKey: 'users',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'users',
        component: Users,
      },
    ],
  },
  // {
  //   path: '/general',
  //   component: Layout,
  //   redirect: '/general/application',
  //   meta: {
  //     hideKey: 'general',
  //     authRequired: true,
  //     subMenu: true,
  //   },
  //   children: [
  // 插件
  // {
  //   path: 'plugins',
  //   component: { template: `<router-view></router-view>` },
  //   meta: {
  //     hideKey: 'plugins',
  //     authRequired: true,
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'plugins',
  //       component: () => import('@/views/Plugins/Plugins'),
  //     },
  //     {
  //       path: 'plugins/:pluginName',
  //       name: 'pluginsName',
  //       component: () => import('@/views/Plugins/PluginsManage'),
  //     },
  //   ],
  // },
  // 应用
  // {
  //   path: 'application',
  //   component: () => import('@/views/General/Application'),
  //   meta: {
  //     hideKey: 'general',
  //     authRequired: true,
  //   },
  // },
  // // 备份
  // {
  //   path: 'backup',
  //   component: () => import('@/views/General/Backup'),
  //   meta: {
  //     hideKey: 'general',
  //     authRequired: true,
  //   },
  // },
  //   ],
  // },

  //gateway
  {
    path: '/gateway',
    component: Layout,
    meta: {
      hideKey: 'gateway',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'gateway',
        component: Gateway,
      },
      {
        path: 'detail/:name',
        name: 'gateway-detail',
        component: GatewayDetail,
      },
    ],
  },
  // Auth
  {
    path: '/authentication',
    component: Layout,
    meta: {
      hideKey: 'authentication',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'authentication',
        component: () => import('@/views/Auth/Authn'),
      },
      {
        path: 'create',
        name: 'authenticationCreate',
        component: () => import('@/views/Auth/AuthnCreate'),
      },
      {
        path: 'detail/:id',
        name: 'authenticationDetail',
        component: () => import('@/views/Auth/AuthnDetails'),
      },
    ],
  },
  {
    path: '/authorization',
    component: Layout,
    meta: {
      hideKey: 'authorization',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'authorization',
        component: () => import('@/views/Auth/Authz'),
      },
      {
        path: 'create',
        name: 'authorizationCreate',
        component: () => import('@/views/Auth/AuthzCreate'),
      },
      {
        path: 'settings',
        name: 'authorizationSetting',
        component: () => import('@/views/Auth/AuthzSetting'),
      },
      {
        path: 'detail/:type',
        name: 'authorizationDetail',
        component: () => import('@/views/Auth/AuthzDetails'),
      },
    ],
  },
  // // 设置
  // {
  //   path: '/setting',
  //   component: Layout,
  //   meta: {
  //     hideKey: 'setting',
  //     authRequired: true,
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'setting',
  //       component: () => import('@/views/Settings/Settings'),
  //     },
  //     {
  //       path: ':part',
  //       name: 'setting-part',
  //       component: () => import('@/views/Settings/Settings'),
  //     },
  //   ],
  // },

  // // 模块
  // {
  //   path: '/modules',
  //   component: Layout,
  //   meta: {
  //     hideKey: 'modules',
  //     authRequired: true,
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'modules',
  //       component: () => import('@/views/Modules/Modules'),
  //     },
  //     {
  //       path: 'select',
  //       name: 'modules-select',
  //       component: SelectModules,
  //     },
  //     {
  //       path: 'detail',
  //       name: 'module-detail',
  //       component: ModuleDetail,
  //     },
  //   ],
  // },
  {
    path: '*',
    meta: {},
    name: 'not-found',
    component: NotFound,
  },
]

export default routes
