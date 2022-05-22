<template>
  <el-dialog :width="400" :visible.sync="showDialog" :title="$t('Modules.addACL')" :z-index="2000">
    <el-form :model="record" ref="record" :rules="rules" label-position="top">
      <el-form-item v-if="type !== '$all'" :prop="type" :label="$t(`Clients.${type}`)">
        <el-input v-model="record[type]" size="small" />
      </el-form-item>
      <el-form-item prop="topic" :label="$t('Topics.topic')">
        <el-input v-model="record.topic" size="small" />
      </el-form-item>
      <el-form-item prop="access" :label="$t('Modules.isAllow')">
        <emq-select v-model="record.access" size="small" :field="{ options: accessOptions }" />
      </el-form-item>
      <el-form-item prop="action" :label="$t('Modules.action')">
        <emq-select v-model="record.action" size="small" :field="{ options: actionOptions }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="showDialog = false">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="save" :loading="addLoading">{{ $t('Base.add') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { addAcl } from '@/api/modules'

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      default: 'username',
    },
  },
  data() {
    return {
      addLoading: false,
      record: {
        action: 'pubsub',
        access: 'allow',
      },
      rules: {
        topic: { required: true, message: this.$t('Clients.pleaseEnter') },
        access: { required: true, message: this.$t('Clients.pleaseEnter') },
        action: { required: true, message: this.$t('Clients.pleaseEnter') },
        username: { required: true, message: this.$t('Clients.pleaseEnter') },
        clientid: { required: true, message: this.$t('Clients.pleaseEnter') },
      },
      accessOptions: [
        { label: this.$t('Modules.allow'), value: 'allow' },
        { label: this.$t('Modules.deny'), value: 'deny' },
      ],
      actionOptions: [
        { label: 'pub', value: 'pub' },
        { label: 'sub', value: 'sub' },
        { label: 'pubsub', value: 'pubsub' },
      ],
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  watch: {
    showDialog(val) {
      if (!val) {
        this.$refs.record.resetFields()
      }
    },
  },
  methods: {
    async save() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        this.addLoading = true
        const { ...data } = this.record
        const res = await addAcl(data)
        if (res.result === 'ok') {
          this.$message.success(this.$t('Base.createSuccess'))
          this.$emit('added')
          this.showDialog = false
        }
        setTimeout(() => {
          this.addLoading = false
        }, 200)
      })
    },
  },
}
</script>
