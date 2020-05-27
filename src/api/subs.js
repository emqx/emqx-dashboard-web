import http from '@/common/http'

// 获取订阅
export function listSubscriptions(params = {}) {
  return http.get('/subscriptions', { params })
}

// 获取单个节点下的订阅
export function listNodeSubscriptions(nodeName, params = {}) {
  return http.get(`/nodes/${nodeName}/subscriptions`, { params })
}

export default {}
