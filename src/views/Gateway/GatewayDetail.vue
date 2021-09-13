<template>
  <div class="app-wrapper gateway-detail">
    <div class="section-header">
      <div>
        <span class="g-icon"></span>
      </div>
      <div>
        <el-button type="danger" size="small">{{ $t('Base.delete') }}</el-button>
        <el-button size="small"> {{ $t('Base.stop') }}</el-button>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane :label="tl('basic')" name="basic">
        <basic></basic>
      </el-tab-pane>
      <el-tab-pane :label="tl('listener')" name="listener">
        <listeners></listeners>
      </el-tab-pane>
      <el-tab-pane :label="tl('auth')" name="auth">
        <auth></auth>
      </el-tab-pane>
      <el-tab-pane :label="tl('clients')" name="clients">
        <clients></clients>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import Auth from './components/auth.vue'
import basic from './components/basic.vue'
import Clients from './components/clients.vue'
import Listeners from './components/listeners.vue'

export default defineComponent({
  components: { basic, Listeners, Auth, Clients },
  name: 'GatewayDetail',
  setup() {
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    return {
      tl,
    }
  },
})
</script>

<style lang="scss" scoped>
.g-icon::before {
  width: 60px;
  height: 60px;
  content: '';
  display: inline-block;
  background-size: contain;
}
</style>
