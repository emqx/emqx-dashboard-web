import http from '@/common/http'

export function getRetainer() {
    return http.get('/mqtt/retainer')
}

export function updateRetainer() {
    return http.put('/mqtt/retainer')
}

export function getRetainerList() {
    return http.get('/mqtt/retainer/message')
}

export function getRetainerTopic(topic) {
    return http.get('/mqtt/retainer/messages/' + topic)
}

export function delRetainerTopic(topic) {
    return http.delete('/mqtt/retainer/messages/' + topic)
}

export function getTopicRewrite() {
    return http.get('/mqtt/topic_rewrite')
}

export function editTopicRewrite() {
    return http.put('/mqtt/topic_rewrite')
}

export function getSubscribe() {
    return http.get('/mqtt/auto_subscribe/pattern')
}

export function editSubscribe() {
    return http.put('/mqtt/auto_subscribe/pattern')
}

export function getDelayedConfig() {
    return http.get('/mqtt/delayed')
}

export function editDelayedConfig() {
    return http.put('/mqtt/delayed')
}

export function getDelayedList() {
    return http.get('/mqtt/delayed/messages')
}

export function getDelayedInfo(id) {
    return http.get('/mqtt/delayed/messages/' + id)
}

export function delDelayedInfo(id) {
    return http.delete('/mqtt/delayed/messages/' + id)
}

export function getEventMsg() {
    return http.get('/mqtt/event_message')
}

export function editEventMsg() {
    return http.put('/mqtt/event_message')
}
