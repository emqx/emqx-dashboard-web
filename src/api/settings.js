import http from '@/common/http'

export const loadConfig = async () => {
  const res = await http.get('/configs')
  const externalRes = res.find($ => $.zone === 'external').configs
  const internalRes = res.find($ => $.zone === 'internal').configs
  return {
    externalRes,
    internalRes,
  }
}

export const updateConfig = async (type, body = {}) => {
  try {
    const res = await http.put(`/configs/zone/${type}`, body)
    return res
  } catch (e) {
    return false
  }
}

export default {}
