import VueI18n from 'vue-i18n'
import Vue from 'vue'
import store from '@/stores'

import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'

const lang = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
}
const translations = require.context('./i18n', false, /\.js$/)
Array.prototype.forEach.call(translations.keys(), (path) => {
  let tran = translations(path).default
  let partKey = path.match(/\w+/)[0] //retrieve the filename as partial keys
  lang.en[partKey] = lang.en[partKey] || {}
  lang.zh[partKey] = lang.zh[partKey] || {}
  Object.keys(tran).forEach((k) => {
    const { en, zh } = tran[k]
    lang.en[partKey][k] = en
    lang.zh[partKey][k] = zh
  })
})

Vue.use(VueI18n)

export default new VueI18n({
  locale: store.state.lang,
  messages: lang,
})
