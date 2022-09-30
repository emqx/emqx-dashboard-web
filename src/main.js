import './public-path'
import Vue from 'vue'
import Router from 'vue-router'
import 'babel-polyfill'
import ElementUI from 'element-ui'
import Waves from 'vue-directive-waves'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
import axios from '@/common/http'

import lang from './i18n'

import installer from '@/common/installer'
import directive from '@/common/directive'
import App from './App.vue'
import routes from './routes/router'
import router from './routes'
import store from './stores'
// for subapp
import { isSubApp } from './common/forToBeSubApp.js'

import '@/assets/style/common.scss'
import '@/assets/style/element-reset.scss'
import '@/assets/style/details-page.scss'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(installer)
Vue.use(ElementUI)
Vue.use(Waves)
Vue.use(directive)
Vue.use(Router)

const i18n = new VueI18n({
  locale: store.state.lang,
  messages: lang,
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

// 解决报错
const originalPush = Router.prototype.push
// push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

let instance = null
let routerForConfig = router
const containerID = '#app'
let appContainer = containerID

const render = () => {
  instance = new Vue({
    store,
    i18n,
    router: routerForConfig,
    render: (h) => h(App),
  }).$mount(appContainer)
}

if (!isSubApp) {
  render()
}
function renderSub(props = {}) {
  const { container: containerCustom, lang: langsub, orgId, projectId, deployId, version, deployType, token } = props
  window.orgId = orgId
  window.projectId = projectId
  window.deployId = deployId
  if (isSubApp) {
    // 处理path
    const preUrl = `/emqxDashBoard/${version}/deploy/${orgId}/${projectId}/${deployId}/${deployType}`
    // 1: 同一个集群，二次进入会出现白屏，所以用 item.path.startsWith('/emqxDashBoard/v4.4.0/deploy/') 条件判断
    // 2： 先进入集群1  在进入集群2 1 的条件，导致 id 没被换掉
    routes.forEach((item) => {
      if (!item.path.startsWith('/emqxDashBoard')) {
        item.path = preUrl + item.path
        if (item.redirect) {
          item.redirect = preUrl + item.redirect
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach((children) => {
            if (children.path !== '') {
              children.path = children.path.startsWith('/')
                ? `${preUrl}${children.path}`
                : `${item.path}/${children.path}`
            } else {
              children.path = item.path
            }
          })
        }
      } else if (item.path.startsWith('/emqxDashBoard')) {
        const itemPath = item.path.split('/')
        // 替换版本
        itemPath[2] = version
        // 替换deployId
        itemPath[4] = orgId
        itemPath[5] = projectId
        itemPath[6] = deployId
        itemPath[7] = deployType
        item.path = itemPath.join('/')
        if (item.redirect) {
          const itemRedirect = item.redirect.split('/')
          itemRedirect[2] = version
          itemRedirect[4] = orgId
          itemRedirect[5] = projectId
          itemRedirect[6] = deployId
          itemRedirect[7] = deployType
          item.redirect = itemRedirect.join('/')
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach((children) => {
            if (children.path !== '') {
              const childrenPath = children.path.split('/')
              childrenPath[2] = version
              childrenPath[4] = orgId
              childrenPath[5] = projectId
              childrenPath[6] = deployId
              childrenPath[7] = deployType
              children.path = childrenPath.join('/')
            } else {
              children.path = item.path
            }
          })
        }
      }
    })
    // console.log(routes)
    routerForConfig = new Router({
      base: '/',
      mode: 'hash',
      scrollBehavior(to, from, savedPosition) {
        if (to.path.endsWith('/modules/detail') || (to.meta.keepAlive && savedPosition)) {
          return savedPosition
        }
        return { x: 0, y: 0 }
      },
      routes,
    })
    // eslint-disable-next-line consistent-return
    routerForConfig.beforeEach((to, from, next) => {
      if (window.__POWERED_BY_QIANKUN__) {
        next()
      }
    })
  }
  if (containerCustom) {
    appContainer = containerCustom.querySelector(containerID)
  }
  if (langsub) {
    i18n.locale = langsub
    store.commit('SET_LANGUAGE', langsub)
  }
  Object.assign(axios.defaults, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Authorization:
        `Bearer ${token}` || `Bearer ${JSON.parse(window.localStorage.getItem('ACCESS-TOKEN'), null, 2).value}`,
    },
    baseURL: store.getters.httpBaseUrl,
    timeout: store.state.httpTimeout,
  })
  axios.interceptors.request.use(
    (config) => {
      config.params = config.params || {}
      if (config.baseURL.startsWith('/api/emqxee/dashboard')) {
        // do nothing
      } else {
        config.baseURL = `/api/emqxee/dashboard/${deployId}/${store.getters.httpBaseUrl}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )
  render()
}

export async function bootstrap() {
  // console.log('[vue] vue app bootstraped')
}

export async function mount(props) {
  // console.log('[vue] props from main framework', props)
  store.commit('SET_SUB_APP_DESTROYED', false)
  renderSub(props)
}

export async function unmount() {
  console.log('is unmount======')
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  routerForConfig = null
  store.commit('SET_SUB_APP_DESTROYED', true)
}
