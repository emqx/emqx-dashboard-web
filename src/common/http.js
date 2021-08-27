import axios from 'axios'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getBasicAuthInfo, toLogin } from '@/common/utils'
import store from '@/stores'
import _ from 'lodash'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })
let respSet = new Set()

Object.assign(axios.defaults, {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  baseURL: '/api/v5',
  timeout: 10000,
})

axios.interceptors.request.use(
  (config) => {
    const user = getBasicAuthInfo()
    if (user.token) {
      config.headers = {
        Authorization: 'Bearer ' + user.token,
      }
    }
    return config
  },
  (error) => {
    // console.log(Object.keys(error))
    Promise.reject(error)
  },
)

axios.interceptors.request.use(async (config) => {
  if (store.state.request_queue) {
  } else {
    NProgress.start()
  }
  await store.dispatch('SET_REQ_CHANGE', true)
  return config
})

axios.interceptors.response.use(
  (response) => {
    setProgressBarDone()
    return response.data || response.status
  },
  (error) => {
    setProgressBarDone()

    //throttle concurrent responses with unique status code
    if (error.response) {
      let { data, status } = error.response

      if (!respSet.has(status)) {
        respSet.add(status)
        if (data?.code || data?.message)
          Message.error(status + ' ' + data?.code + ':' + data?.message)
        else Message.error(status + ' Network error')

        if (status === 401) {
          toLogin()
        }
      }
    } else {
      if (!respSet.has(0)) {
        Message.error('Some error occurred')
        respSet.add(0)
      }
    }

    if (store.state.request_queue === 0) respSet = new Set()
    _.throttle(
      () => {
        respSet = new Set()
      },
      2000,
      { trailing: false },
    )

    return Promise.reject(error)
  },
)

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
