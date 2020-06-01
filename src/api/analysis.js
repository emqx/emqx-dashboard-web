import http from '@/common/http'

export function listTopicMetrics() {
  return http.get('/topic-metrics')
}

export function enableTopicMetrics() {
  return http.put('/modules/emqx_mod_topic_metrics/load')
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
