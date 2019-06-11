import Vue from 'vue'
import Antd from 'ant-design-vue'

import '@/assets/style/common.less'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(Antd)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
