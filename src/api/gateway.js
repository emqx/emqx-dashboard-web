import http from '@/common/http'

export function getGatewayList() {
  return http.get('/gateway')
}

export async function getGatewayListeners(name, id) {
  if (!name) return Promise.reject()
  return http.get(
    '/gateway/' +
      encodeURIComponent(name) +
      '/listeners' +
      ((id && '/' + encodeURIComponent(id)) || ''),
  )
}

export function addGatewayListener(name, body) {
  return http.post(`/gateway/${encodeURIComponent(name)}/listeners`, body)
}

export async function updateGatewayListener(name, id, body) {
  if (!name || !id) return Promise.reject()
  return http.put(
    '/gateway/' + encodeURIComponent(name) + '/listeners/' + encodeURIComponent(id),
    body,
  )
}

export async function updateGateway(name, body) {
  if (!name) return Promise.reject()
  return http.put('/gateway/' + encodeURIComponent(name), body)
}

export async function postGateway(body) {
  return http.post('/gateway', body)
}

export async function getGateway(name) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + name)
}

export async function getGatewayClients(name, params) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + name + '/clients', { params: params })
}
