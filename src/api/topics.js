import http from '@/common/http'

export const listTopics = (params = {}) => http.get('/routes', { params })

export const searchTopics = (topic = '') => http.get(`/routes/${encodeURIComponent(topic)}`)

export default {}
