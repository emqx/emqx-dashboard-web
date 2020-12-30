import http from '@/common/http'
import { getJpData } from '@/common/utils'
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash'
import store from '@/stores'

const { lang } = store.state

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
export const loadConfigSpec = async () => {
  const data = await http.get('/configs_spec')
  if (lang === 'ja') {
    const jpData = getJpData('settings')
    _.merge(data, jpData)
  }
  return data
}

export const loadZoneConfig = async () => {
  const data = await http.get('/configs_spec/zone')
  if (lang === 'ja') {
    const jpData = getJpData('zone')
    _.merge(data, jpData)
  }
  return data
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
