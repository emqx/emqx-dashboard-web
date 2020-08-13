import http from '@/common/http'

export function createService(body = {}) {
  return http.post('/services', body)
}

export function loadService() {
  return http.get('/services')
}

export function destroyService(serviceID) {
  return http.delete(`/services/${serviceID}`)
}

export default {}
