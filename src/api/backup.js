import http from '@/common/http'

export function loadBackup() {
  return http.get('/data/export')
}

export function exportBackup() {
  return http.post('/data/export', {})
}

export function deleteBackup(filename) {
  return http.delete(`/data/file/${filename}`)
}

export function downloadFile(filename) {
  return http.get(`/data/file/${filename}`)
}

export function uploadBackupFile(data) {
  return http.post('/data/file', data)
}

export function importBackup(filename) {
  return http.post('/data/import', {
    filename,
  })
}

export default {}
