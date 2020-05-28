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

export default {}
