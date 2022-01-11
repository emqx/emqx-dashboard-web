import http from '@/common/http'

export function auth(user = {}) {
  return http.post('/auth', user, {
    params: {
      _t: false,
      _m: false,
    },
  })
}

export const login = (user) => {
  return http.post('/login', user, {
    params: {
      _t: false,
      _m: false,
    },
  })
}

export const logout = (username, token) => {
  return http.post('/logout', { username, token })
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
