import VueI18n from 'vue-i18n'
import lang from '@/i18n/index'
import Vue from 'vue'
import store from '@/stores'

Vue.use(VueI18n)

export default new VueI18n({
  locale: store.state.lang,
  messages: lang,
})
