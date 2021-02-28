import http from '@/common/http'

// 获取连接
export function listClients(params = {}) {
  return http.get('/clients', { params })
}

// 获取单个节点下的连接
export function listNodeClients(nodeName, params = {}) {
  const reqUrl = nodeName === 'all' ? '/clients' : `/nodes/${nodeName}/clients`
  return http.get(reqUrl, { params })
}

// 搜索连接
export function searchClients(clientId = '') {
  return http.get(`/clients/${encodeURIComponent(clientId)}`)
}

// 搜索单个节点的连接
export function searchNodeClients(nodeName, clientId = '') {
  return http.get(`/nodes/${nodeName}/clients/${encodeURIComponent(clientId)}`)
}

// 断开连接
export function disconnectClient(clientId = '') {
  return http.delete(`/clients/${encodeURIComponent(clientId)}`)
}

// 获取连接的基础信息
export async function loadClientDetail(clientId) {
  const data = await http.get(`/clients/${encodeURIComponent(clientId)}`)
  return data.length ? data[0] || {} : {}
}

// 搜索单个节点的订阅
export function loadSubscriptions(nodeName, clientId) {
  return http.get(`/nodes/${nodeName}/subscriptions/${encodeURIComponent(clientId)}`)
}

export function unSubscription(body = {}) {
  return http.post('/mqtt/unsubscribe', body)
}

export function subscribe(body = {}) {
  return http.post('/mqtt/subscribe', body)
}

export default {}
