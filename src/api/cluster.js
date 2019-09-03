import http from '@/common/http'

// 加载节点
export const loadNodes = async () => {
  const res = await http.get('/nodes')
  const nodes = res.map($ => $.node)
  return nodes
}

// 加载集群信息
const formateSeconds = (time) => { // 秒转化为毫秒
  let ss = time
  if (typeof ss !== 'number') {
    ss = parseInt(ss, 10)
  }
  return `${ss / 1000}s`
}
export const loadCluster = async () => {
  const res = await http.get('/cluster')
  const { config } = res
  if (res.type === 'mcast') {
    res.config.ports = config.ports.join(',')
    res.config.loop = JSON.stringify(config.loop)
  } else if (res.type === 'etcd') {
    res.config.node_ttl = formateSeconds(config.node_ttl)
  }
  return res
}

// 邀请节点加入
export const inviteNode = async (data) => {
  const body = {
    node: data.config.node,
  }
  try {
    return http.post('/cluster/invite_node', body)
  } catch (error) {
    console.error(error)
    return false
  }
}

// 集群移除节点
export const forceLeaveNode = async (nodename) => {
  try {
    const res = await http.delete(`/cluster/force_leave/${nodename}`)
    return res
  } catch (error) {
    console.error(error)
    return false
  }
}

export default {}
