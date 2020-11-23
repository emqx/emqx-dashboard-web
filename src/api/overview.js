import http from '@/common/http'

export async function loadState() {
  const stats = await http.get('/stats')
  if (!stats) {
    return stats
  }
  const state = {
    connections_count: 0,
    connections_max: 0,
    subscribers_count: 0,
    subscribers_max: 0,
    message_count: 0,
    message_max: 0,
    message_rate_count: 0,
    message_rate_max: 0,
  }

  const keys = Object.keys(state)

  stats.forEach((item) => {
    keys.forEach((key) => {
      const targetKey = key.replace(/_/g, '.')
      const value = item[targetKey] || 0
      state[key] += value
    })
  })

  return state
}

export function loadBrokers() {
  return http.get('/brokers')
}

export function loadStats() {
  return http.get('/stats')
}

export async function loadNodes() {
  const brokers = await loadBrokers()
  const stats = await loadStats()
  const brokerMap = {}
  brokers.forEach((broker) => {
    brokerMap[broker.node] = broker
  })

  const stateMap = {}
  stats.forEach((state) => {
    stateMap[state.node] = state
  })

  const nodes = await http.get('/nodes')
  return nodes.map(($) => {
    const broker = brokerMap[$.node] || {}
    const state = stateMap[$.node] || {}
    return {
      ...broker,
      ...state,
      ...$,
    }
  })
}

export function loadCurrentMetrics() {
  return http.get('/monitor/current_metrics')
}

export function loadLicenseInfo() {
  return http.get('/license_info')
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

export function loadMetrics(node) {
  return http.get(`/nodes/${node}/metrics`)
}

export function loadListeners(node) {
  return http.get(`/nodes/${node}/listeners`)
}

export async function loadNodeDetail(node) {
  const broker = await http.get(`/brokers/${node}`)
  const nodeData = await http.get(`/nodes/${node}`)
  const stats = await http.get(`/nodes/${node}/stats`)
  return { ...broker, ...stats, ...nodeData }
}

export async function loadAllMetrics() {
  const data = {
    client: {
      authSuccess: 0,
      authFailed: 0,
      connectSuccess: 0,
    },
    message: {
      received: 0,
      sent: 0,
      dropped: 0,
    },
    messageDrop: {
      expired: 0,
      noSubscribers: 0,
    },
  }
  const res = await http.get('/metrics')
  res.forEach((item) => {
    const { metrics } = item
    data.client.connectSuccess += metrics['client.connected']
    data.client.authSuccess += metrics['client.auth.success']
    data.client.authFailed += metrics['client.auth.failure']

    data.message.received += metrics['messages.received']
    data.message.sent += metrics['messages.sent']
    data.message.dropped += metrics['messages.dropped']

    data.messageDrop.expired += metrics['messages.dropped.expired']
    data.messageDrop.noSubscribers += metrics['messages.dropped.no_subscribers']
  })
  return data
}

export default {}
