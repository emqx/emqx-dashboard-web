<template>
  <div class="app-wrapper gateway-create">
    <div class="section-header">
      {{ tl('initial') + name }}
    </div>
    <el-row>
      <el-col :span="16">
        <el-steps :active="stepActive" finish-status="success">
          <el-step :title="tl('basicConfig')"> </el-step>
          <el-step :title="tl('listeners')"></el-step>
          <el-step :title="tl('auth')"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row class="config-main">
      <div v-if="stepActive === 0" class="config-basic">
        <template v-if="name === 'STOMP'">
          <stomp-basic :value.sync="stompData" />
        </template>
      </div>
      <div v-else-if="stepActive === 1">
        <listeners :integration="true"></listeners>
      </div>
      <div v-else-if="stepActive === 2">
        <div class="part-header">
          {{ tl('clientAuth') }}
        </div>
        <div class="config-auth">
          {{ tl('clientAuthDesc') }}
        </div>
      </div>
    </el-row>
    <el-row class="config-op">
      <el-button size="small" type="primary" v-if="stepActive === 2">{{
        $t('Base.enable')
      }}</el-button>
      <el-button type="primary" size="small" @click="++stepActive" v-if="stepActive < 2">{{
        $t('Base.nextStep')
      }}</el-button>
      <el-button size="small" @click="--stepActive" v-if="stepActive > 0">{{
        $t('Base.backStep')
      }}</el-button>
      <el-button size="small" v-if="stepActive === 0">{{ $t('Base.cancel') }}</el-button>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from '@vue/composition-api'
import Listeners from './components/listeners.vue'
import stompBasic from './components/stompBasic.vue'

export default defineComponent({
  components: { stompBasic, Listeners },
  name: 'GatewayCreate',
  data: function () {
    return {
      name: String(this.$route.params.name).toUpperCase(),
    }
  },
  setup(props) {
    let stepActive = ref(0)
    let stompData = ref({})
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    watch(stompData, (v) => {})

    return {
      tl,
      stepActive,
      stompData,
    }
  },
})
</script>

<style lang="scss" scoped>
.config-main {
  margin-top: 30px;
}
.config-basic {
  width: 70%;
}
.config-op {
  margin-top: 30px;
}
.config-auth {
  width: 50%;
  margin: 20px 0;
}
</style>
