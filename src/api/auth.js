import http from '@/common/http'

export function listAuthn(params = {}) {
  return http.get('/authentication', { params })
}

export function listAuthz(params = {}) {
  return http.get('/authorization/sources', { params })
}

export default {}
