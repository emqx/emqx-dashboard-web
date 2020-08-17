import http from '@/common/http'

export function createModel(body = {}) {
  return http.post('/things', body)
}

export function loadModel(productID) {
  return http.get(`/things/?productID=${productID}`)
}

export function destroyModel(modelID) {
  return http.delete(`/things/${modelID}`)
}

export function showModel(modelID) {
  return http.get(`/things/${modelID}`)
}

export default {}
