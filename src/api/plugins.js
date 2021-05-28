import http from '@/common/http'

// 加载单节点下的插件
export function loadPlugins(nodeName) {
  return http.get(`/nodes/${nodeName}/plugins`)
}

// 开启单个节点下的插件
export function startNodePlugin(nodeName, pluginName) {
  return http.put(`/nodes/${nodeName}/plugins/${pluginName}/reload`)
}

// 关闭单个节点下的插件
export function stopNodePlugin(nodeName, pluginName) {
  return http.put(`/nodes/${nodeName}/plugins/${pluginName}/unload`)
}

// 开启集群下的插件
export function startPlugin(pluginName) {
  return http.put(`/plugins/${pluginName}/reload`)
}

// 关闭集群下的插件
export function stopPlugin(pluginName) {
  return http.put(`/plugins/${pluginName}/unload`)
}

// 加载单节点下的插件详情
export function loadPluginDetail(nodeName, pluginName) {
  return http.get(`/nodes/${nodeName}/plugin_configs/${pluginName}`)
}

// 更新单节点下的插件详情
export function updatePlugin(nodeName, pluginName) {
  return http.put(`/nodes/${nodeName}/plugin_configs/${pluginName}`)
}

// Load Auth clientid
export function listAuthClientid() {
  return http.get('/auth_clientid')
}

// Create Auth clientid
export function addAuthClientid(body = {}) {
  return http.post('/auth_clientid', body)
}

// Delete Auth clientid
export function deleteAuthClientID(clientid) {
  return http.delete(`/auth_clientid/${clientid}`)
}

// Auth clientid detail
export function loadAuthClientid(clientid) {
  return http.get(`/auth_clientid/${clientid}`)
}

// Update Auth clientid
export function updateAuthClientid(clientid, body) {
  return http.put(`/auth_clientid/${clientid}`, body)
}

// Load Auth username
export function listAuthUsername() {
  return http.get('/auth_username')
}

// Create Auth username
export function addAuthUsername(body = {}) {
  return http.post('/auth_username', body)
}

// Delete Auth username
export function deleteAuthUsername(username) {
  return http.delete(`/auth_username/${username}`)
}

// Auth username detail
export function loadAuthUsername(username) {
  return http.get(`/auth_username/${username}`)
}

// Update Auth username
export function updateAuthUsername(username, body) {
  return http.put(`/auth_username/${username}`, body)
}

// Load Auth mnesia
export function listMnesia(params = {}) {
  return http.get('/auth_user', { params })
}

// Create Auth mnesia
export function addAuthMnesia(body) {
  return http.post('/auth_user', body)
}

// Delete Auth mnesia
export function deleteAuthMnesia(login) {
  return http.delete(`/auth_user/${encodeURIComponent(login)}`)
}

// Auth mnesia Detail
export function loadAuthMnesia(login) {
  return http.get(`/auth_user/${encodeURIComponent(login)}`)
}

// Update Auth mnesia
export function updateAuthMnesia(login, body) {
  return http.put(`/auth_user/${encodeURIComponent(login)}`, body)
}

// Load Auth mnesia ACL
export function listMnesiaACL(params = {}) {
  return http.get('/emqx_acl', { params })
}

// Create Auth mnesia ACL
export function addAuthMnesiaACL(body) {
  return http.post('/emqx_acl', body)
}

// Delete Auth mnesia ACL
export function deleteAuthMnesiaACL(login, topic) {
  return http.delete(`/emqx_acl/${encodeURIComponent(login)}/${encodeURIComponent(topic)}`)
}

// Auth mnesia ACL Detail
export function loadAuthMnesiaACL(login) {
  return http.get(`/emqx_acl/${encodeURIComponent(login)}`)
}

export default {}
