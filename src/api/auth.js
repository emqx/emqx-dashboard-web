import http from '@/common/http'
import _ from 'lodash'

export function listAuthn(params = {}) {
  return http.get('/authentication', { params })
}

export function listAuthz(params = {}) {
  return http.get('/authorization/sources', { params })
}

export function listAuthzSetting(params = {}) {
  return http.get('/authorization/settings', { params })
}

export function updateAuthzSetting(body) {
  const {
    cache: { ttl, unit },
  } = body
  const data = _.cloneDeep(body)
  delete data.cache.unit
  data.cache.ttl = `${ttl}${unit}`
  return http.put('/authorization/settings', data)
}

export function updateAuthz(type, body) {
  return http.put(`/authorization/sources/${type}`, body)
}

export function createAuthn(body) {
  return http.post('/authentication', body)
}

export function updateAuthn(id, body) {
  delete body.id
  return http.put(`/authentication/${id}`, body)
}

export function deleteAuthn(id) {
  return http.delete(`/authentication/${id}`)
}

export default {}
