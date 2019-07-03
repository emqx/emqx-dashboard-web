import http from '@/common/http'

export function auth(user = {}) {
  return http.post('/auth', user, {
    params: {
      _t: false,
      _m: false,
    },
  })
}

export function loadPlugins(nodeName) {
  return http.get(`/nodes/${nodeName}/plugins`)
}

export function startPlugin(nodeName, pluginName) {
  return http.get(`/nodes/${nodeName}/plugins/${pluginName}/load`)
}

export function stopPlugin(nodeName, pluginName) {
  return http.get(`/nodes/${nodeName}/plugins/${pluginName}/unload`)
}

export function loadNodes() {
  return http.get('/nodes')
}

export default {}
