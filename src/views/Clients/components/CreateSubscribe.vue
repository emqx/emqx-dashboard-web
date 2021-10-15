<template>
  <el-dialog
    v-bind="$attrs"
    :title="$t('Clients.addASubscription')"
    width="400px"
    :visible.sync="visible"
    class="create-subscribe"
    v-on="$listeners"
    @close="close"
    @open="open"
  >
    <el-form ref="record" :model="record" :rules="rules" size="small" label-position="top">
      <el-form-item v-if="!clientId" prop="clientid" label="Client ID">
        <el-input v-model="record.clientid" placeholder="Client ID"></el-input>
      </el-form-item>
      <el-form-item prop="topic" label="Topic">
        <el-input v-model="record.topic" placeholder="Topic"></el-input>
      </el-form-item>
      <el-form-item prop="qos" label="QoS">
        <emq-select v-model="record.qos" :field="{ list: [0, 1, 2] }"></emq-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-align-footer">
      <el-button plain size="small" @click="close">{{ $t('Base.cancel') }}</el-button>
      <el-button type="primary" size="small" @click="handleAdd">{{ $t('Base.add') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { subscribe } from '@/api/clients'
import { addGatewayClientSubs } from '@/api/gateway'

export default {
  name: 'CreateSubscribe',

  inheritAttrs: false,

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    clientId: {
      type: String,
      default: '',
    },
    gateway: {
      type: Boolean,
      required: false,
      default: false,
    },
    gatewayName: {
      type: String,
      required: false,
      default: '',
    },
  },

  data() {
    return {
      record: {
        clientid: this.clientid,
        qos: 0,
        topic: '',
      },
      rules: {
        clientid: {
          required: true,
          message: this.$t('Clients.pleaseEnter'),
        },
        topic: {
          required: true,
          message: this.$t('Clients.pleaseEnter'),
        },
      },
    }
  },
  methods: {
    open() {
      this.record.clientid = this.clientId
    },
    async handleAdd() {
      const valid = await this.$refs.record.validate().catch(() => {})
      if (!valid) {
        return
      }
      if (this.gateway) {
        this.addGatewaySubs()
        return
      }

      let clientId = this.clientId || this.record.clientid

      let subs = await subscribe(clientId, {
        topic: this.record.topic,
        qos: this.record.qos,
      }).catch(() => {})
      if (subs) {
        this.$emit('create:subs')
        this.close()
      }
    },
    async addGatewaySubs() {
      let clientId = this.clientId || this.record.clientid
      let gName = this.gatewayName
      let res = await addGatewayClientSubs(gName, clientId).catch(() => {})
      if (res) {
        this.$emit('create:subs')
        this.close()
      }
    },
    close() {
      this.$emit('update:visible', false)
      this.$refs.record.resetFields()
    },
  },
}
</script>

<style lang="scss">
.create-subscribe {
  .el-select,
  .el-input {
    width: 100%;
  }
}
</style>
