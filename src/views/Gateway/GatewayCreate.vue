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
          <stomp-basic :value.sync="basicData" />
        </template>
        <template v-else-if="name === 'MQTTSN'">
          <mqttsn-basic :value.sync="basicData"></mqttsn-basic>
        </template>
        <template v-else-if="name === 'COAP'">
          <coap-basic :value.sync="basicData"></coap-basic>
        </template>
        <template v-else-if="name === 'LWM2M'">
          <lwm2m-basic :value.sync="basicData"></lwm2m-basic>
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
      <el-button size="small" v-if="stepActive === 0" @click="cancel">{{
        $t('Base.cancel')
      }}</el-button>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from '@vue/composition-api'
import CoapBasic from './components/coapBasic.vue'
import Listeners from './components/listeners.vue'
import Lwm2mBasic from './components/lwm2mBasic.vue'
import MqttsnBasic from './components/mqttsnBasic.vue'
import stompBasic from './components/stompBasic.vue'
import _ from 'lodash'

export default defineComponent({
  components: { stompBasic, Listeners, MqttsnBasic, Lwm2mBasic, CoapBasic },
  name: 'GatewayCreate',
  data: function () {
    return {
      name: String(this.$route.params.name).toUpperCase(),
    }
  },
  setup(props) {
    let stepActive = ref(0)
    let basicData = ref({})
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    watch(
      () => _.cloneDeep(basicData),
      (v) => {
        console.log(v)
      },
    )

    const cancel = function () {
      this.$router.push({ name: 'gateway' })
    }

    return {
      tl,
      stepActive,
      basicData,
      cancel,
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
