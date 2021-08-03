import http from '@/common/http'

export function listClients(params = {}) {
  return http.get('/clients', { params })
}

// 获取单个节点下的连接
export function listNodeClients(nodeName, params = {}) {
  const reqUrl = nodeName === 'all' || !nodeName ? '/clients' : `/nodes/${nodeName}/clients`
  return http.get(reqUrl, { params })
}

export function searchClients(clientId) {
  return http.get(`/clients/${encodeURIComponent(clientId)}`)
}

// 搜索单个节点的连接
export function searchNodeClients(nodeName, clientId) {
  return http.get(`/nodes/${nodeName}/clients/${encodeURIComponent(clientId)}`)
}

export function disconnectClient(clientId) {
  return http.delete(`/clients/${encodeURIComponent(clientId)}`)
}

export async function loadClientDetail(clientId) {
  return http.get(`/clients/${encodeURIComponent(clientId)}`)
}

export function loadSubscriptions(clientId) {
  return http.get(`/clients/${encodeURIComponent(clientId)}/subscriptions`)
}

export function unsubscribe(clientId) {
  return http.delete(`/clients/${encodeURIComponent(clientId)}/subscribe`)
}

export function subscribe(clientId, { qos, topic }) {
  return http.post(`/clients/${encodeURIComponent(clientId)}/subscribe`, { qos, topic })
}