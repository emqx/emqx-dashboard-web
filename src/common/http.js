/* eslint-disable */
import axios from 'axios'
import { Message } from 'element-ui'

import { getBasicAuthInfo, toLogin } from '@/common/utils'
import config from '@/config'
import store from '@/store'

const httpCode = {
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
}

Object.assign(axios.defaults, {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  baseURL: config.baseURL,
  timeout: config.httpTimeout,
  auth: {},
})

axios.interceptors.request.use((config) => {
  const user = getBasicAuthInfo()
  config.params = config.params || {}
  const { params: { _t: tokenRequired = true } } = config
  if (!user.username && tokenRequired) {
    toLogin()
    throw new Error('需要登录')
  }
  config.auth.username = user.username
  config.auth.password = user.password
  return config
}, error => Promise.reject(error))

function handleError(error) {
  store.dispatch('LOADING', false)
  console.log(error)
  if (!error.response) {
    // Message.error(error.message)
    return Promise.reject(error.message)
  }

  const { response: { status, data: { message }, config: { params: { _m: showMessage = true } } } } = error
  if (message) {
    error.message = message
  }
  if (status === 401) {
    toLogin()
  } else if (showMessage) {
    Message.error(error.message)
  }
  return Promise.reject(error.message)
}

axios.interceptors.response.use((response) => {
  let res = response.data
  let error = ''
  if (typeof res === 'object') {
    const { status } = response
    const { code = -1, meta, message } = response.data
    let { data } = response.data
    if (code !== 0) {
      error = httpCode[code] || message
    }
    // pagination
    if (meta) {
      data = { items: data, meta }
    }
    res = { data, status }
  }

  store.dispatch('LOADING', false)

  if (error) {
    response.status = 400
    return handleError({
      message: error,
      response,
    })
  }
  return res.data || {}
}, handleError)

export default axios
