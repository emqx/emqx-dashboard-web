import http from '@/common/http'

export function loadAllModules() {
  return http.get('/module_types')
}

export function createModule(body = {}) {
  return http.post('/modules', body)
}

export function loadCreatedModules() {
  return http.get('/modules')
}

export function showCreatedModuleInfo(id) {
  return http.get(`/modules/${id}`)
}

export function destroyModule(id) {
  return http.delete(`/modules/${id}`)
}

export function updateModule(id, body = {}) {
  return http.put(`/modules/${id}`, body)
}

export function loadConfig(type) {
  return http.get(`/module_types/${type}`)
}

// emqx_auth_mnesia
export function addAuth(type, body = {}) {
  return http.post(`/auth_${type}`, body)
}

export function loadAuth(type, params = {}) {
  return http.get(`/auth_${type}`, { params })
}

export function updateAuth(type, id, body = {}) {
  return http.put(`/auth_${type}/${id}`, body)
}

export function deleteAuth(type, id) {
  return http.delete(`/auth_${type}/${id}`)
}
export default {}
