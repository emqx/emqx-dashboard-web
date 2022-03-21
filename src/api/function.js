import http from '@/common/http'

export function loadApp() {
  return http.get('/apps')
}

export function showApp(appid) {
  return http.get(`/apps/${decodeURIComponent(appid)}`)
}

export function createApp(body = {}) {
  return http.post('/apps', body)
}

export function updateApp(appid, body = {}) {
  return http.put(`/apps/${decodeURIComponent(appid)}`, body)
}

export function destroyAPP(appid) {
  return http.delete(`/apps/${decodeURIComponent(appid)}`)
}

export function loadUser() {
  return http.get('/users')
}

export function createUser(body) {
  return http.post('/users', body)
}

export function updateUser(username, body = {}) {
  return http.put(`/users/${decodeURIComponent(username)}`, body)
}

export function changePassword(username, body = {}) {
  return http.put(`/change_pwd/${decodeURIComponent(username)}`, body)
}

export function destroyUser(username) {
  return http.delete(`/users/${decodeURIComponent(username)}`)
}

export function loadBlacklist(params = {}) {
  return http.get('/banned', { params })
}

export function createBlacklist(body) {
  return http.post('/banned', body)
}

export function deleteBlacklist({ who, as }) {
  return http.delete(`/banned/${as}/${encodeURIComponent(who)}`)
}

export default {}
