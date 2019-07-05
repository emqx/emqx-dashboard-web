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
  return http.put(`/nodes/${nodeName}/plugins/${pluginName}/load`)
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

export function loadBrokers() {
  return http.get('/brokers')
}

export async function loadNodes() {
  const brokers = await loadBrokers()
  const brokerMap = {}
  brokers.forEach((broker) => {
    brokerMap[broker.node] = broker
  })
  const nodes = await http.get('/nodes')
  return nodes.map(($) => {
    const broker = brokerMap[$.name] || {}
    return {
      ...broker,
      ...$,
    }
  })
}

export async function loadAlarm() {
  const list = await http.get('/alarms/present')
  const data = []
  list.forEach((item) => {
    const { node, alarms } = item
    alarms.forEach(($) => {
      $.node = node
      data.push($)
    })
  })
  return data
}

export async function loadHistoryAlarm() {
  const list = await http.get('/alarms/history')
  const data = []
  list.forEach((item) => {
    const { node, alarms } = item
    alarms.forEach(($) => {
      $.node = node
      data.push($)
    })
  })
  return data
}

export default {}
