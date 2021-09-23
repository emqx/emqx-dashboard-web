import http from '@/common/http'

export function getGatewayList() {
  return http.get('/gateway')
}

export function getGatewayListeners(name, id) {
  if (!name) return
  return http.get('/gateway/' + name + '/listeners' + (id && '/' + id))
}

export function addGatewayListener(name, body) {
  return http.post(`/gateway/${name}/listeners`, body)
}
