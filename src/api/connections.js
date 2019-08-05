import http from '@/common/http'

export function listConnections(params = {}) {
  return http.get('/connections', { params })
}

export function searchConnections(clientId = '') {
  return http.get(`/connections/${encodeURIComponent(clientId)}`)
}

// export function banConnection(clientId) {}

export function disconnectConnection(clientId = '') {
  return http.delete(`/connections/${encodeURIComponent(clientId)}`)
}

export async function loadConnectionDetail(clientId) {
  // 基础信息
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
