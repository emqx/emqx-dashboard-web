import http from '@/common/http'

// 加载节点
export const loadNodes = async () => {
  const res = await http.get('/nodes')
  const nodes = res.map($ => $.node)
  return nodes
}

// 加载集群信息
export const loadCluster = async () => {
  const res = await http.get('/cluster')
  return res
}

export default {}
