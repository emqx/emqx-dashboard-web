import http from '@/common/http'

export function getRetainer() {
  return http.get('/mqtt/retainer')
}

export function updateRetainer(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/retainer', data)
}

export function getRetainerList() {
  return http.get('/mqtt/retainer/messages')
}

export function getRetainerTopic(topic) {
  return http.get('/mqtt/retainer/message/' + encodeURIComponent(topic))
}

export function delRetainerTopic(topic) {
  if (!topic) return
  return http.delete('/mqtt/retainer/messages/' + topic)
}

export function getTopicRewrite() {
  return http.get('/mqtt/topic_rewrite')
}

export function editTopicRewrite(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/topic_rewrite', data)
}

export function getSubscribe() {
  return http.get('/mqtt/auto_subscribe')
}

export function editSubscribe(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/auto_subscribe', data)
}

export function getDelayedConfig() {
  return http.get('/mqtt/delayed')
}

export function editDelayedConfig(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/delayed', data)
}

export function getDelayedList() {
  return http.get('/mqtt/delayed/messages')
}

export function getDelayedInfo(id) {
  return http.get('/mqtt/delayed/messages/' + id)
}

export function delDelayedInfo(id) {
  if (!id) return
  return http.delete('/mqtt/delayed/messages/' + id)
}

export function getEventMsg() {
  return http.get('/mqtt/event_message')
}

export function editEventMsg(body) {
  let data = typeof body === 'object' && body !== null ? body : {}
  return http.put('/mqtt/event_message', data)
}
