import http from '@/common/http'

export function createDevice(body = {}) {
  return http.post('/devices', body)
}

export default {}
