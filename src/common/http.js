import axios from 'axios'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


import { getBasicAuthInfo, toLogin } from '@/common/utils'
import store from '@/stores'
// import router from '@/routes'

// let timer = 0

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })
// const { lang } = store.state


// const pluginPages = ['schemas', 'rules', 'resources', 'setting']

Object.assign(axios.defaults, {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  baseURL: '/api/v5',
  timeout: 5000,
  auth: {},
})

axios.interceptors.request.use(
  (config) => {
    const user = getBasicAuthInfo()
    // config.params = config.params || {}
    // const {
    //   params: { _t: tokenRequired = true },
    // } = config
    // if (!user.username && tokenRequired) {
    //   toLogin()
    //   // throw new Error(httpMap['-1'] + `(${JSON.stringify(config)})`)
    // }
    config.auth.username = user.username
    config.auth.password = user.password

    // store.dispatch('LOADING', true)
    // lwm2m observe
    // if (!config.url.includes('?msgType=observe&path=')) {

    // }
    return config
  },
  (error) => Promise.reject(error)
)

axios.interceptors.request.use(async (config) => {
  if (store.state.request_queue) {
  } else {
    NProgress.start()
  }
  await store.dispatch('SET_REQ_CHANGE', true)
  return config
})

axios.interceptors.response.use((response) => {
  setProgressBarDone()

  return response.data || response.status
}, (error) => {
  setProgressBarDone()
  let { data: { code, message }, status } = error.response
  if (code)
    Message.error(status + ' ' + code + ':' + message)
  else
    Message.error(status + ' Network error')

  if (status === 401) {
    toLogin()
  }

  return Promise.reject(error)
})

async function setProgressBarDone() {
  await store.dispatch('SET_REQ_CHANGE', false)
  let queueLen = store.state.request_queue
  if (queueLen > 0) {
    NProgress.inc()
  } else {
    NProgress.done()
  }
}

export default axios
