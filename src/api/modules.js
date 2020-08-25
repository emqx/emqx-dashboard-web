import http from '@/common/http'

// export function listModules(nodeName) {
//   return http.get(`/nodes/${nodeName}/modules`)
// }

// export function updateModules(nodeName, { active, name }) {
//   const operation = active ? 'unload' : 'load'
//   return http.put(`/nodes/${nodeName}/modules/${name}/${operation}`)
// }

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
export default {}
