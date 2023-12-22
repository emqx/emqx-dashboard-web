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

export async function clearHistoryAlarm() {
  return http.delete('/alarms/deactivated')
}

const getDecimalLength = (num) => {
  const [, decimal] = String(num).split('.')
  return decimal ? decimal.length : 0
}

export const accAdd = (arg1, arg2) => {
  const decimalLength1 = getDecimalLength(arg1)
  const decimalLength2 = getDecimalLength(arg2)

  const maxLength = Math.max(decimalLength1, decimalLength2)
  const multiplier = 10 ** maxLength

  const adjustedArg1 = arg1 * multiplier
  const adjustedArg2 = arg2 * multiplier
  return (adjustedArg1 + adjustedArg2) / multiplier
}

export default {}
