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

export function loadCurrentMetrics() {
  return http.get('/overview/current_metrics')
}

export function loadLicenseInfo() {
  return http.get('/license_info')
}

export function loadMetricsLog(node, type) {
  if (!node && type) {
    return http.get(`/overview/metrics/${type}`)
  }
  if (node && !type) {
    return http.get(`/nodes/${node}/overview/metrics`)
  }
  if (node && type) {
    return http.get(`/nodes/${node}/overview/metrics/${type}`)
  }
  return http.get('/overview/metrics')
}

export function loadMetrics(node) {
  return http.get(`/nodes/${node}/metrics`)
}

export function loadConfig(node) {
  return http.get(`/nodes/${node}/configs`)
}

export function loadListeners(node) {
  return http.get(`/nodes/${node}/listeners`)
}

export async function loadNodeDetail(node) {
  const broker = await http.get(`/brokers/${node}`)
  const nodeData = await http.get(`/nodes/${node}`)
  return { ...broker, ...nodeData }
}

export default {}
