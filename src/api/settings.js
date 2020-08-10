import http from '@/common/http'

// 加载配置
export const loadConfig = async () => {
  const res = await http.get('/configs')
  const mqttRes = res.find(($) => $.zone === 'mqtt').configs
  const externalRes = res.find(($) => $.zone === 'external').configs
  const internalRes = res.find(($) => $.zone === 'internal').configs
  return {
    mqttRes,
    externalRes,
    internalRes,
  }
}

// 更新配置
export const updateConfig = async (type, body = {}) => {
  try {
    const res = await http.put(`/configs/zone/${type}`, body)
    return res
  } catch (e) {
    return false
  }
}

export default {}
