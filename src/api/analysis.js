import http from '@/common/http'

export function listTopicMetrics() {
  return http.get('/topic-metrics')
}

export function enableTopicMetrics() {
  return http.post('/topic_metrics')
}

export function addTopicMetrics(body) {
  return http.post('/topic-metrics', body)
}

export function deleteTopicMetrics(topic) {
  return http.delete(`/topic-metrics/${encodeURIComponent(topic)}`)
}

export function loadTopicMetrics(topic) {
  return http.get(`/topic-metrics/${encodeURIComponent(topic)}`)
}

export default {}
