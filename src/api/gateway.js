import http from '@/common/http'

export function getGatewayList() {
  return http.get('/gateway')
}
