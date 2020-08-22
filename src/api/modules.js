import http from '@/common/http'

export function listModules(nodeName) {
  return http.get(`/nodes/${nodeName}/modules`)
}

export function updateModules(nodeName, { active, name }) {
  const operation = active ? 'unload' : 'load'
  return http.put(`/nodes/${nodeName}/modules/${name}/${operation}`)
}

export function loadAllFeatures() {
  return http.get('/feature_types')
}

export function createFeature(body = {}) {
  return http.post('/features', body)
}

export function loadCreatedFeatures() {
  return http.get('/features')
}

export function showCreatedFeatureInfo(id) {
  return http.get(`/features/${id}`)
}

export function destroyFeature(id) {
  return http.delete(`/features/${id}`)
}

export function updateFeature(id, body = {}) {
  return http.put(`/features/${id}`, body)
}
export default {}
