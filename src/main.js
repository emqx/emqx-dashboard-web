import Vue from 'vue'
import ElementUI from 'element-ui'

import installer from '@/common/installer'
import '@/assets/style/common.scss'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(installer)
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
