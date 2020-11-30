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

export function loadAcl(type, params = {}) {
  return http.get(`/acl/${type}`, { params })
}

export function addAcl(body = {}) {
  return http.post(`/acl`, body)
}

export function deleteAcl(type, id, topic) {
  return http.delete(`/acl/${type}/${id}/topic/${encodeURIComponent(topic)}`)
}

export function delete$allAcl(topic) {
  return http.delete(`/acl/$all/topic/${encodeURIComponent(topic)}`)
}

// auth_sasl
export async function getSaslList(mechanism) {
  const res = await http.get(`/sasl?mechanism=${mechanism}`)
  const keyName = Object.keys(res)[0]
  const list = []
  res[keyName].forEach((item) => {
    const oneItem = {
      username: item,
    }
    list.push(oneItem)
  })
  return list
}

export function addSasl(body) {
  return http.post('/sasl', body)
}

export function editSasl(body) {
  return http.put('/sasl', body)
}

export function deleteSasl(mechanism, username) {
  return http.delete(`/sasl?mechanism=${mechanism}&username=${username}`)
}

export function showSasl(mechanism, username) {
  return http.get(`/sasl?mechanism=${mechanism}&username=${username}`)
}

// lwm2m_protocol
export function getLwClients(nodeName) {
  return http.get(`/nodes/${nodeName}/lwm2m_channels`)
}

export function getOrderResponse(nodeName, imei, msgType, path) {
  return http.get(`/nodes/${nodeName}/lookup_cmd/${imei}?msgType=${msgType}&path=${path}`)
}

export function publishOrder(body) {
  return http.post('/mqtt/publish', body)
}

export default {}
