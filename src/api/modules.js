import http from '@/common/http'

export function listModules(nodeName) {
  return http.get(`/nodes/${nodeName}/modules`)
}

export function updateModules(nodeName, { active, name }) {
  const operation = active ? 'unload' : 'load'
  return http.put(`/nodes/${nodeName}/modules/${name}/${operation}`)
}

export default {}
