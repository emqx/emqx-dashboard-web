import http from '@/common/http'
import store from '@/stores'

export function getTraceList(enable) {
  return http.get('/trace', { params: { enable: !!enable } })
}

export function addTrace(body) {
  return http.post('/trace', body)
}

export function getTraceLog(name, params) {
  if (!name) return false
  return http.get(`/trace/${encodeURIComponent(name)}/log`, { params })
}

export function downloadTrace(name) {
  const link = document.createElement('a')
  link.href = `${store.state.config.baseURL}/trace/${encodeURIComponent(name)}/download`
  // link.setAttribute('download', 'emqx.zip')
  document.body.appendChild(link)
  link.click()
  return Promise.resolve()
}
export function stopTrace(name) {
  return http.put(`/trace/${encodeURIComponent(name)}/disable`)
}

export function deleteTrace(name) {
  return http.delete(`/trace/${encodeURIComponent(name)}`)
}
