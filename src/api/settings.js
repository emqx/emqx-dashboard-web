import http from '@/common/http'

// 加载配置数据
export const loadConfig = async () => {
  const res = await http.get('/configs')
  const mqttRes = res.find(($) => $.type === 'emqx').configs
  const monitorResList = []

  res.forEach((item) => {
    if (item.type.includes('mon')) {
      monitorResList.push(item)
    }
  })
  return {
    mqttRes,
    monitorResList,
  }
}

export const loadZoneConfigs = () => {
  return http.get('/configs/zones')
}

export const loadlistenerConfigs = () => {
  return http.get('/configs/listeners')
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
export const loadConfigSpec = () => {
  return http.get('/configs_spec')
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
