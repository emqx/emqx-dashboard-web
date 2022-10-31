import { Message } from 'element-ui'
import http from '@/common/http'
import { downloadBlobData } from '../common/utils'

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

export async function downloadTrace(name) {
  try {
    const res = await http.get(`/trace/${encodeURIComponent(name)}/download`, {
      responseType: 'blob',
      timeout: 45000,
    })
    if (!res.data) {
      throw new Error('No data')
    }
    downloadBlobData(res)
    return Promise.resolve()
  } catch (error) {
    Message.error(error)
    return Promise.reject()
  }
}
export function stopTrace(name) {
  return http.put(`/trace/${encodeURIComponent(name)}/stop`)
}

export function deleteTrace(name) {
  return http.delete(`/trace/${encodeURIComponent(name)}`)
}

export function getTraceDetail(name) {
  return http.get(`/trace/${encodeURIComponent(name)}/detail`)
}
