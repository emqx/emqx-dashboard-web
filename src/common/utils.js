/* eslint-disable */
import store from '@/store'
import router from '@/router'

export function getBasicAuthInfo() {
  return store.state.user
}

export function toLogin() {
  store.dispatch('UPDATE_USER_INFO', { logOut: true })
  router.push({ path: '/login', query: { to: router.fullPath } })
}

export const awaitWrap = promise => promise
.then(data => data)
.catch(err => null)

export function safeParser(jsonStr, defaultValue = {}) {
  try {
    return JSON.parse(jsonStr) || defaultValue
  } catch (e) {
    return defaultValue
  }
}

// 将 [{ title: { en: 'Title', zh: '标题' } }] 翻译为 [{ title: '标题' }]
export function fillI18n(data = [], keys = []) {
  const { lang = 'zh' } = store.state
  console.log(data, keys)
  data.forEach((item) => {
    keys.forEach((key) => {
      if (!item[key]) {
        return
      }
      item[key] = item[key][lang]
    })
  })

  return data
}
