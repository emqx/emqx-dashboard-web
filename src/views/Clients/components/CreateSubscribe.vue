<template>
  <el-dialog
    v-bind="$attrs"
    :title="$t('Clients.addASubscription')"
    width="400px"
    :visible.sync="rawVisible"
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
      <el-button type="primary" size="small" @click="handleAdd" :disabled="notAbleChange">
        {{ $t('Base.add') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { subscribe } from '@/api/clients'

export default {
  name: 'CreateSubscribe',

  components: {},

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

  computed: {
    rawVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      },
    },
  },

  created() {},

  methods: {
    open() {
      this.record.clientid = this.clientId
    },
    async handleAdd() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      await subscribe(this.record)
      this.$emit('created', true)
      this.close()
    },
    close() {
      this.$refs.record.resetFields()
      this.$emit('update:visible', false)
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
