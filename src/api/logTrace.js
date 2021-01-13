import http from '@/common/http'

// for traceList
export function getTraceList() {
  return http.get('/log/trace')
}

export function addTrace(body) {
  return http.post('/log/trace', body)
}

export function deleteTrace(type, name) {
  return http.delete(`/log/trace/${type}/${name}`)
}

export default {}
