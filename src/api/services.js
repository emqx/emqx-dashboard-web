import http from '@/common/http'

export function createService(body = {}) {
  return http.post('/services', body)
}

export function loadService(productID) {
  return http.get(`/product_services/${productID}`)
}

export function showService(serviceID) {
  return http.get(`/services/${serviceID}`)
}

export function updateService(serviceID, body = {}) {
  return http.put(`/services/${serviceID}`, body)
}

export function destroyService(serviceID) {
  return http.delete(`/services/${serviceID}`)
}

export default {}
