import http from '@/common/http'

export function loadPlugins(nodeName) {
  return http.get(`/nodes/${nodeName}/plugins`)
}

export function startPlugin(nodeName, pluginName) {
  return http.put(`/nodes/${nodeName}/plugins/${pluginName}/reload`)
}

export function stopPlugin(nodeName, pluginName) {
  return http.put(`/nodes/${nodeName}/plugins/${pluginName}/unload`)
}

export function loadPluginDetail(nodeName, pluginName) {
  return http.get(`/nodes/${nodeName}/plugin_configs/${pluginName}`)
}

export function updatePlugin(nodeName, pluginName) {
  return http.put(`/nodes/${nodeName}/plugin_configs/${pluginName}`)
}

export default {}
