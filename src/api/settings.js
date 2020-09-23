import http from '@/common/http'

// 加载配置
export const loadConfig = async () => {
  const res = await http.get('/configs')
  const mqttRes = res.find(($) => $.type === 'emqx').configs
  const alarmRes = res.find(($) => $.type === 'alarm')
  const clusterRes = res.find(($) => $.type === 'cluster')

  const zoneResList = []
  const listenersResList = []
  const monitorResList = []
  const otherResList = []

  monitorResList.push(alarmRes)
  otherResList.push(clusterRes)
  const otherTypeList = ['rpc', 'log']
  res.forEach((item) => {
    if (item.type === 'listener') {
      item.configs.type = item.transport_type
      listenersResList.push(item)
    } else if (item.type.includes('mon')) {
      monitorResList.push(item)
    } else if (otherTypeList.indexOf(item.type) !== -1) {
      otherResList.push(item)
    } else if (item.type === 'zone') {
      zoneResList.push(item)
    }
  })
  return {
    mqttRes,
    zoneResList,
    listenersResList,
    monitorResList,
    otherResList,
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

// 加载配置格式，有type enum
export const loadConfigSpec = async () => {
  const res = await http.get('/configs_spec')
  return res
}

export const updateZoneConfig = async (type, body = {}) => {
  try {
    const res = await http.put(`/configs/zones/${type}`, body)
    return res
  } catch (e) {
    return false
  }
}

export const addZoneConfig = async (body = {}) => {
  try {
    const res = await http.post('/configs/zones', body)
    return res
  } catch (e) {
    return false
  }
}

export default {}
