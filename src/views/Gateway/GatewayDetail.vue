<template>
  <div class="app-wrapper gateway-detail">
    <div class="section-header">
      <div>
        <span :class="['g-icon', `g-${gname}`]"></span>
      </div>
      <div>
        <el-button type="danger" plain size="small">{{ $t('Base.delete') }}</el-button>
        <el-button size="small"> {{ $t('Base.stop') }}</el-button>
      </div>
    </div>
    <el-menu router :default-active="matchedUrl" mode="horizontal">
      <template v-for="item in types">
        <el-menu-item :index="`${item}`" :key="item">{{ tl(item) }}</el-menu-item>
      </template>
    </el-menu>
    <!-- <el-tabs v-model="type">
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
    </el-tabs> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent, onMounted } from '@vue/composition-api'
// import Auth from './components/auth.vue'
// import basic from './components/basic.vue'
// import Clients from './components/clients.vue'
// import Listeners from './components/listeners.vue'

export default defineComponent({
  // components: { basic, Listeners, Auth, Clients },
  name: 'GatewayDetail',
  data: function () {
    return {
      types: ['basic', 'listeners', 'auth', 'clients'],
      gname: this.$route.params.name,
    }
  },
  computed: {
    matchedUrl: function () {
      return this.types.find((v) => {
        return this.$router.currentRoute?.path?.match(v)
      })
    },
  },
  setup(p) {
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
