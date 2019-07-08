import Vue from 'vue'
import 'babel-polyfill';
import ElementUI from 'element-ui'
import Waves from 'vue-directive-waves'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
import lang from './i18n'


import installer from '@/common/installer'
import '@/assets/style/common.scss'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(VueI18n)
Vue.config.productionTip = false
Vue.use(installer)
Vue.use(ElementUI)
Vue.use(Waves)

const i18n = new VueI18n({
  locale: store.state.lang,
  messages: lang,
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
