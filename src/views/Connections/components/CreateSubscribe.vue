<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    title="添加订阅"
    width="400px"
    :visible.sync="rawVisible"
    @close="close"
    @open="open"
    class="create-subscribe">
    <el-form ref="record" :model="record" :rules="rules" size="small" label-position="top">
      <el-form-item v-if="!clientId" prop="client_id" label="Client ID">
        <el-input v-model="record.client_id" placeholder="请输入 Client ID"></el-input>
      </el-form-item>
      <el-form-item prop="topic" label="Topic">
        <el-input v-model="record.topic" placeholder="请输入 Topic"></el-input>
      </el-form-item>
      <el-form-item prop="qos" label="QoS">
        <emq-select v-model.sync="record.qos" :field="{ list: [0, 1, 2] }"></emq-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-align-footer">
      <el-button plain size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
    </div>
  </el-dialog>
</template>


<script>
import { subscribe } from '@/api/connections'

export default {
  name: 'CreateSubscribe',

  components: {},

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

  inheritAttrs: false,

  data() {
    return {
      record: {
        client_id: this.client_id,
        qos: 0,
        topic: '',
      },
      rules: {
        client_id: {
          required: true,
          message: '请输入',
        },
        topic: {
          required: true,
          message: '请输入',
        },
      },
    }
  },

  methods: {
    open() {
      this.record.client_id = this.clientId
    },
    async handleAdd() {
      const valid = await this.$refs.record.validate()
      console.log(valid)
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

  created() {
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
}
</script>


<style lang="scss">
.create-subscribe {
  .el-select, .el-input {
    width: 100%;
  }
}
</style>
