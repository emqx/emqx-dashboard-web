import http from '@/common/http'

export function createDevice(body = {}) {
  return http.post('/devices', body)
}

export function loadDevice(productID) {
  return http.get(`/product_devices/${productID}`)
}

export function queryDevice(params = {}) {
  return http.get(`/devices`, { params })
}

export default {}
