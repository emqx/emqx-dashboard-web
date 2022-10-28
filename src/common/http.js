/* eslint-disable */
import axios from 'axios'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { getBasicAuthInfo, toLogin } from '@/common/utils'
import store from '@/stores'
import router from '@/routes'
import { isSubApp } from '../common/forToBeSubApp.js'

let timer = 0

NProgress.configure({ showSpinner: false })
const { lang = 'zh' } = store.state

const httpCode = {
  zh: {
    0: '成功',
    101: 'RPC 操作失败',
    102: '未知错误',
    103: '用户名或密码错误',
    104: '空的用户名密码',
    105: '用户不存在',
    106: '不能删除管理员',
    107: '请求参数错误',
    108: '请求参数类型错误',
    109: '请求体不是 JSON',
    110: '插件当前已经启动',
    111: '插件当前已经停止',
    112: '客户端不在线',
    113: '用户已存在',
    114: '旧密码错误',
    115: '主题错误',
    '-1': '需要登录',
    '-2': '相关插件未开启',
    '-3': 'dashbard 没有权限',
  },
  en: {
    0: 'Success',
    101: 'Bad RPC',
    102: 'Unknown Error',
    103: 'Username or password error',
    104: 'Empty username or password',
    105: 'User does not exist',
    106: 'Admin can not be deleted',
    107: 'Missing request parameter',
    108: 'Request parameter type error',
    109: 'Request parameter is not a json',
    110: 'Plugin has been loaded',
    111: 'Plugin has been unloaded',
    112: 'Client not online',
    113: 'User already exist',
    114: 'Old password error',
    115: 'Bad topic',
    '-1': 'Login Required',
    '-2': 'Plugin not started',
    '-3': 'dashbard not allowed',
  },
}

const httpMap = httpCode[lang]

const pluginPages = ['schemas', 'rules', 'resources', 'setting']

if (!isSubApp) {
  Object.assign(axios.defaults, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    baseURL: store.getters.httpBaseUrl,
    timeout: store.state.httpTimeout,
    auth: {},
  })
} else {
  Object.assign(axios.defaults, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    baseURL: '',
    timeout: store.state.httpTimeout,
  })
}

axios.interceptors.request.use(
  (config) => {
    if (store.state.isSubAppDestroyed) {
      // console.log('是否退出=========')
      throw new axios.Cancel('cancel')
    }
    const user = getBasicAuthInfo()
    config.params = config.params || {}
    // 如果是 subapp
    const {
      params: { _t: tokenRequired = true },
    } = config
    if (isSubApp) {
      // do nothing
    } else if (!user.username && tokenRequired) {
      toLogin()
      throw new Error(httpMap['-1'])
    }
    if (!isSubApp) {
      config.auth.username = user.username
      config.auth.password = user.password
    }
    store.dispatch('LOADING', true)
    // lwm2m observe
    if (!config.url.includes('?msgType=observe&path=')) {
      NProgress.start()
    }
    return config
  },
  (error) => Promise.reject(error),
)

function handleError(error) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    NProgress.done()
  }, 300)
  if (!error.response) {
    return Promise.reject(error.message)
  }

  const {
    selfError,
    response: {
      status,
      data: { message },
      config: {
        params: { _m: showMessage = true },
      },
      headers: {},
    },
  } = error
  if (selfError) {
    error.message = selfError
  } else if (message) {
    error.message = message
  }
  const { name: currentPage, fullPath } = router.history.current
  if (status === 401) {
    if (!isSubApp) {
      toLogin()
    } else {
      for (let i = 0; i <= timer; i++) {
        clearTimeout(i)
      }
      Message.closeAll()
      Message.error(httpMap['-3'])
      if (window.orgId && window.projectId && window.deployId) {
        router.push({ path: `/deploy/${window.orgId}/${window.projectId}/${window.deployId}/overview` })
      }
    }
  } else if (status === 404 && pluginPages.includes(currentPage)) {
    Message.error(httpMap['-2'])
  } else if (showMessage) {
    if (fullPath.includes('imei') && error.message.includes('500')) {
      return
    }
    if (error.message !== 'module_not_loaded') {
      Message.error(error.message)
    } else {
      Message.warning('Related module are not load')
    }
  }
  return Promise.reject(error.message)
}

axios.interceptors.response.use((response) => {
  let res = response.data
  if (response.config.url.includes('/data/file')) {
    const { file, filename, data } = response.data
    res.data = {
      file,
      filename,
      data,
    }
  }
  let error = ''
  let selfError = ''
  if (typeof res === 'object') {
    const { status } = response
    const { code = -100, meta, message } = response.data
    let { data } = response.data
    if (code !== 0) {
      selfError = httpMap[code]
      error = httpMap[code] || message
    }
    // pagination
    if (meta) {
      data = { items: data, meta }
    }
    res = { data, status }
  }
  clearTimeout(timer)
  timer = setTimeout(() => {
    store.dispatch('LOADING', false)
    NProgress.done()
  }, 300)

  if (res === '' && response.status === 204) {
    return null
  }

  if (error) {
    response.status = 400
    return handleError({
      message: error,
      selfError,
      response,
    })
  }
  return res.data || {}
}, handleError)

export default axios
