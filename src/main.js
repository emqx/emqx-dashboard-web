import Vue from 'vue'
import ElementUI from 'element-ui'
import CompositionAPI from '@vue/composition-api'

import installer from '@/common/installer'
import directive from '@/common/directive'
import App from '@/App.vue'
import router from '@/routes'
import store from '@/stores'
import i18n from '@/i18n'
import ElementLocale from 'element-ui/lib/locale'

import '@/assets/style/common.scss'
import '@/assets/style/element-reset.scss'

Vue.use(installer)
Vue.use(ElementUI)
Vue.use(directive)
Vue.use(CompositionAPI)

ElementLocale.i18n((key, value) => i18n.t(key, value))

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
