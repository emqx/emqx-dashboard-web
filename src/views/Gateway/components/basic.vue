<template>
  <div class="basic-info" v-loading="infoLoading">
    <template v-if="name === 'STOMP'">
      <stomp-basic :value.sync="basicData" :key="iKey" />
    </template>
    <template v-else-if="name === 'MQTTSN'">
      <mqttsn-basic :value.sync="basicData" :key="iKey"></mqttsn-basic>
    </template>
    <template v-else-if="name === 'COAP'">
      <coap-basic :value.sync="basicData" :key="iKey"></coap-basic>
    </template>
    <template v-else-if="name === 'LWM2M'">
      <lwm2m-basic :value.sync="basicData" :key="iKey"></lwm2m-basic>
    </template>
    <el-button type="primary" size="small" :loading="updateLoading" @click="updateGatewayInfo()">{{
      $t('Base.update')
    }}</el-button>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, ref, watch } from '@vue/composition-api'
import CoapBasic from './coapBasic.vue'
import Lwm2mBasic from './lwm2mBasic.vue'
import MqttsnBasic from './mqttsnBasic.vue'
import stompBasic from './stompBasic.vue'
import { updateGateway, getGateway } from '@/api/gateway'
import _ from 'lodash'

export default defineComponent({
  components: { stompBasic, MqttsnBasic, Lwm2mBasic, CoapBasic },
  name: 'GatewayDetailBasic',
  data: function () {
    return {
      name: String(this.$route.params.name).toUpperCase(),
    }
  },
  setup() {
    let basicData = ref({})
    let infoLoading = ref(false)
    let updateLoading = ref(false)

    let vm = getCurrentInstance()
    let iKey = ref(0)

    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    watch(
      () => _.cloneDeep(basicData.value),
      (v) => {
        console.log(v)
      },
    )

    const getGatewayInfo = async () => {
      infoLoading.value = true
      let { name } = vm.data
      if (!name) return
      name = String(name).toLowerCase()
      let res = await getGateway(name).catch(() => {})
      if (res) {
        basicData.value = res
        ++iKey.value
      }
      infoLoading.value = false
    }

    const updateGatewayInfo = async function () {
      updateLoading.value = true
      infoLoading.value = true
      let name = String(vm.data.name).toLowerCase()
      let res = await updateGateway(name, basicData.value).catch(() => {})
      if (res) {
        this.$message({
          type: 'success',
          message: this.$t('Base.updateSuccess'),
        })
      }
      getGatewayInfo()
      updateLoading.value = false
      infoLoading.value = false
    }

    onMounted(() => {
      getGatewayInfo()
    })

    return {
      tl,
      basicData,
      updateLoading,
      infoLoading,
      updateGatewayInfo,
      iKey,
    }
  },
})
</script>

<style lang="scss" scoped>
.basic-info {
  width: 70%;
  margin: 10px;
}
</style>
