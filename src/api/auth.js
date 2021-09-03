import http from '@/common/http'

export function listAuthn(params = {}) {
  return http.get('/authentication', { params })
}

export default {}
