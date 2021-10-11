import http from '@/common/http'

export function getGatewayList() {
  return http.get('/gateway')
}

export async function getGatewayListeners(name, id) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + name + '/listeners' + (id && '/' + id))
}

export function addGatewayListener(name, body) {
  return http.post(`/gateway/${name}/listeners`, body)
}

export async function updateGateway(name, body) {
  if (!name) return Promise.reject()
  return http.put('/gateway/' + name, body)
}

export async function postGateway(body) {
  return http.post('/gateway', body)
}

export async function getGateway(name) {
  if (!name) return Promise.reject()
  return http.get('/gateway/' + name)
}
