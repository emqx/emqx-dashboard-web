import http from '@/common/http'

export function createModel(body = {}) {
  return http.post('/things', body)
}

export default {}
