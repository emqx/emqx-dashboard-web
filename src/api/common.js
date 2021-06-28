import http from '@/common/http'

export function auth(user = {}) {
  return http.post('/auth', user, {
    params: {
      _t: false,
      _m: false,
    },
  })
}

export function loadBrokers() {
  return http.get('/brokers')
}

export function loadStats() {
  return http.get('/stats')
}

export function loadLicenseInfo() {
  return http.get('/license_info')
}

export function loadCurrentMetrics() {
  return http.get('/monitor/current_metrics')
}

export function loadMetricsLog(node, type) {
  if (!node && type && type !== 'basic') {
    return http.get(`/monitor/metrics/${type}`)
  }
  if (node && !type) {
    return http.get(`/nodes/${node}/monitor/metrics`)
  }
  if (node && type && type !== 'basic') {
    return http.get(`/nodes/${node}/monitor/metrics/${type}`)
  }
  return http.get('/monitor/metrics')
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
  const list = await http.get('/alarms/activated')
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
  const list = await http.get('/alarms/deactivated')
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
