import http from '@/common/http'

export function auth(user = {}) {
  return http.post('/auth', user, {
    // params: {
    //   _t: false,
    //   _m: false,
    // },
  })
}

export function loadStats() {
  return http.get('/stats')
}

export function loadLicenseInfo() {
  return http.get('/license_info')
}

export function loadMetrics() {
  return http.get('/metrics')
}

export function loadCurrentMetrics() {
  return http.get('/monitor/current')
}

export function loadMetricsLog(type) {
  return http.get('/monitor', { params: { counter: type } })
}

export async function loadNodes() {
  return http.get('/nodes')
}

//Alarms
export async function loadAlarm(history = false, params = {}) {
  return http.get('/alarms', { params: { activated: String(!history), ...params } })
}

export async function clearHistoryAlarm() {
  return http.delete('/alarms')
}

//cluster
export const loadCluster = async () => {
  const res = await http.get('/cluster')
  const { config } = res
  if (res.type === 'mcast') {
    res.config.ports = config.ports.join(',')
    res.config.loop = JSON.stringify(config.loop)
  } else if (res.type === 'etcd') {
    res.config.node_ttl = config.node_ttl
  }
  return res
}

// 邀请节点加入
export const inviteNode = async (data) => {
  const body = {
    node: data.config.node,
  }
  return http.post('/cluster/invite_node', body).catch(() => { })
}

// 集群移除节点
export const forceLeaveNode = async (nodename) => {
  return http.delete(`/cluster/force_leave/${nodename}`).catch(() => { })
}

//topics
export const listTopics = (params = {}) => {
  return http.get('/routes' + (params.topic ? `/${encodeURIComponent(topic)}` : ''), { params })
}

// 获取订阅
export function listSubscriptions(params = {}) {
  return http.get('/subscriptions', { params })
}

// 获取单个节点下的订阅
export function listNodeSubscriptions(nodeName, params = {}) {
  const reqUrl =
    nodeName === 'all' || !nodeName ? '/subscriptions' : `/nodes/${nodeName}/subscriptions`
  return http.get(reqUrl, { params })
}
