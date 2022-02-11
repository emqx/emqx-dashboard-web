import http from '@/common/http'

const sortMonitorResList = (monitorResList) => {
  const arrSort = ['vm_mon', 'license', 'os_mon']
  return monitorResList.sort(({ type: type1 }, { type: type2 }) => {
    try {
      return arrSort.findIndex((type) => type === type1) - arrSort.findIndex((type) => type === type2)
    } catch (error) {
      return 0
    }
  })
}

// 加载配置数据
export const loadConfig = async () => {
  const res = await http.get('/configs')

  const findResult = res.find(($) => $.type === 'emqx')
  const mqttRes = findResult ? findResult.configs : {}

  let monitorResList = []

  res.forEach((item) => {
    if (item.type.includes('mon') || item.type === 'license') {
      monitorResList.push(item)
    }
  })
  monitorResList = sortMonitorResList(monitorResList)
  return {
    mqttRes,
    monitorResList,
  }
}

export const loadZoneConfigs = () => {
  return http.get('/configs/zones')
}

export const deleteOneZone = (name) => {
  return http.delete(`/configs/zones/${name}`)
}

export const loadlistenerConfigs = () => {
  return http.get('/configs/listeners')
}

export const deleteOneListener = (name, type) => {
  return http.delete(`/configs/listeners/${name}?transport_type=${type}`)
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

export const loadZoneConfig = () => {
  return http.get('/configs_spec/zone')
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
