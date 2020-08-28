import http from '@/common/http'

export function loadApp(productID) {
  return http.get(`/product_apps/${productID}`)
}

export function createApp(body = {}) {
  return http.post('/nari_apps', body)
}

export function showApp(appID) {
  return http.get(`/nari_apps/${appID}`)
}

export function destroyAPP(appID) {
  return http.delete(`/nari_apps/${appID}`)
}

export function updateApp(appID, body = {}) {
  return http.put(`/nari_apps/${appID}`, body)
}

export default {}
