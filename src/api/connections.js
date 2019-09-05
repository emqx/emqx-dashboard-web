import http from '@/common/http'

// 获取连接
export function listConnections(params = {}) {
  return http.get('/connections', { params })
}

// 获取单个节点下的连接
export function listNodeConnections(nodeName, params = {}) {
  return http.get(`/nodes/${nodeName}/connections`, { params })
}

// 搜索连接
export function searchConnections(clientId = '') {
  return http.get(`/connections/${encodeURIComponent(clientId)}`)
}

// 搜索单个节点的连接
export function searchNodeConnections(nodeName, clientId = '') {
  return http.get(`/nodes/${nodeName}/connections/${encodeURIComponent(clientId)}`)
}

// export function banConnection(clientId) {}

// 断开连接
export function disconnectConnection(clientId = '') {
  return http.delete(`/connections/${clientId}`)
}

// 获取连接的基础信息
export async function loadConnectionDetail(clientId) {
  const data = await http.get(`/connections/${encodeURIComponent(clientId)}`)
  return data.length ? data[0] || {} : {}
}

export function loadSubscriptions(clientId) {
  return http.get(`/subscriptions/${encodeURIComponent(clientId)}`)
}

export function unSubscription(body = {}) {
  return http.post('/mqtt/unsubscribe', body)
}

export function subscribe(body = {}) {
  return http.post('/mqtt/subscribe', body)
}

export default {}
