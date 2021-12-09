import http from '@/common/http'
import store from '@/stores'
import { createURLWithAuth } from '../common/utils'

export function getTraceList() {
  return http.get('/trace')
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
  link.href = createURLWithAuth(`${store.getters.httpBaseUrl}/trace/${encodeURIComponent(name)}/download`)
  // link.setAttribute('download', 'emqx.zip')
  document.body.appendChild(link)
  link.click()
  return Promise.resolve()
}
export function stopTrace(name) {
  return http.put(`/trace/${encodeURIComponent(name)}/stop`)
}

export function deleteTrace(name) {
  return http.delete(`/trace/${encodeURIComponent(name)}`)
}
