import http from '@/common/http'

export function listConnections(params = {}) {
  return http.get('/connections', { params })
}

export function searchConnections(clientId) {
  return http.get(`/connections/${clientId}`)
}

export function banConnection(clientId) {}

export function disconnectConnection(clientId) {
  return http.delete(`/connections/${clientId}`)
}

export default {}
