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
          <lw-basic :value.sync="basicData"></lw-basic>
        </template>
        <template v-else-if="name === 'EXPROTO'">
          <exproto-basic :value.sync="basicData"></exproto-basic>
        </template>
      </div>

      <div v-else-if="stepActive === 1">
        <listeners :integration="true" :gateway-name="name" :list.sync="listenerList"></listeners>
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
      <el-button
        size="small"
        type="primary"
        v-if="stepActive === 2"
        :loading="submitLoading"
        @click="createGateway()"
        >{{ $t('Base.enable') }}</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="++stepActive"
        v-if="stepActive < 2"
        :disabled="submitLoading"
        >{{ $t('Base.nextStep') }}</el-button
      >
      <el-button
        size="small"
        @click="--stepActive"
        v-if="stepActive > 0"
        :disabled="submitLoading"
        >{{ $t('Base.backStep') }}</el-button
      >
      <el-button size="small" v-if="stepActive === 0" @click="gotoList">{{
        $t('Base.cancel')
      }}</el-button>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch, getCurrentInstance } from '@vue/composition-api'
import CoapBasic from './components/coapBasic.vue'
import Listeners from './components/listeners.vue'
import LwBasic from './components/lwm2mBasic.vue'
import MqttsnBasic from './components/mqttsnBasic.vue'
import stompBasic from './components/stompBasic.vue'
import ExprotoBasic from './components/exprotoBasic.vue'

import _ from 'lodash'
import { postGateway, getGateway } from '@/api/gateway'
import router from '@/routes'
import { Message } from 'element-ui'
import i18n from '@/i18n'

export default defineComponent({
  components: { stompBasic, Listeners, MqttsnBasic, LwBasic, CoapBasic, ExprotoBasic },
  name: 'GatewayCreate',
  data: function () {
    return {
      name: String(this.$route.params.name).toUpperCase(),
    }
  },
  setup(props) {
    let stepActive = ref(0)
    let basicData = ref({})
    let listenerList = ref([])
    let submitLoading = ref(false)

    let vm = getCurrentInstance()

    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    watch(
      () => [_.cloneDeep(basicData), _.cloneDeep(listenerList)],
      (v) => {
        console.log(v)
      },
    )

    const gotoList = function () {
      router.push({ name: 'gateway' })
    }

    const createGateway = async function () {
      submitLoading.value = true
      if (!this.name) return

      let data = {
        ...basicData.value,
        listeners: [...listenerList.value],
        name: String(this.name).toLowerCase(),
      }
      let res = await postGateway(data).catch(() => {})
      if (res) {
        Message({
          type: 'success',
          message: i18n.t('Base.createSuccess'),
        })
        gotoList()
      } else {
      }
      submitLoading.value = false
    }

    const gatewayStatus = async function () {
      let { name } = vm.data

      if (!name) {
        gotoList()
      }
      name = String(name).toLowerCase()

      let res = await getGateway(name).catch(() => {})
      if (res) {
        let { status } = res
        if (status !== 'unloaded') {
          Message({
            type: 'error',
            message: i18n.t('Gateway.alreadyLoad'),
          })
          gotoList()
        }
      }
    }

    onMounted(function () {
      gatewayStatus()
    })

    return {
      tl,
      stepActive,
      basicData,
      gotoList,
      listenerList,
      submitLoading,
      createGateway,
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
