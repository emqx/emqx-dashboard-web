import http from '@/common/http'

// 加载配置数据
export const loadConfig = async () => {
  const res = await http.get('/configs')
  const mqttRes = res.find(($) => $.type === 'emqx').configs

  const zoneResList = []
  const listenersResList = []
  const monitorResList = []

  res.forEach((item) => {
    if (item.type === 'listener') {
      listenersResList.push(item)
    } else if (item.type.includes('mon')) {
      monitorResList.push(item)
    } else if (item.type === 'zone') {
      zoneResList.push(item)
    }
  })
  return {
    mqttRes,
    zoneResList,
    listenersResList,
    monitorResList,
  }
}

// 更新配置 base/monitor
export const updateConfig = async (type, body = {}) => {
  try {
    const res = await http.put(`/configs/${type}`, body)
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

// type: zones/listeners
export const updateOneConfig = async (type, name, body = {}) => {
  try {
    const res = await http.put(`/configs/${type}/${name}`, body)
    return res
  } catch (e) {
    return false
  }
}

// type: zones/listeners
export const addOneConfig = async (type, body = {}) => {
  try {
    const res = await http.post(`/configs/${type}`, body)
    return res
  } catch (e) {
    return false
  }
}

export default {}
