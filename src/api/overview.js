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

export default {}
