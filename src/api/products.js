import http from '@/common/http'

export function createProduct(body = {}) {
  return http.post('/products', body)
}

export function showProduct(productID) {
  return http.get(`/products/${productID}`)
}

export function loadProduct() {
  return http.get('/products')
}

export function updateProduct(productID, body = {}) {
  return http.put(`/products/${productID}`, body)
}

export function destroyProduct(productID) {
  return http.delete(`/products/${productID}`)
}

export default {}
