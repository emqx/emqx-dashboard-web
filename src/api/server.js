import http from '@/common/http'
// import { fillI18n } from '@/common/utils'

export function loadTopics(params = { _limit: 500, _page: 1 }) {
  return http.get('/routes', params)
}

export function searchTopics(topic = '') {
  return http.get(`/routes/${encodeURIComponent(topic)}`)
}

export default {}
