<template>
  <el-dialog
    :visible.sync="showDialog"
    width="520px"
    :title="$t(`Modules.${auth ? 'editAuthentication' : 'createAuthentication'}`)"
    :z-index="2000"
  >
    <el-form ref="record" class="el-form--public app-info" size="medium" :rules="rules" :model="record">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item prop="login" :label="type === 'clientid' ? $t('Clients.clientId') : $t('Clients.username')">
            <el-input v-model="record[type]" :disabled="!!auth"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="password" label="Password">
            <el-input v-model="record.password" type="password" autocomplete="new-password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-align-footer">
      <el-button plain size="small" class="cache-btn" @click="showDialog = false">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button v-if="!auth" type="primary" size="small" :disabled="notAbleChange" @click="add">
        {{ $t('Base.add') }}
      </el-button>
      <el-button v-else type="primary" size="small" :disabled="notAbleChange" @click="handleEdit">
        {{ $t('Base.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateAuth, addAuth } from '@/api/modules'

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
    },
    auth: {
      type: Object,
    },
  },
  data() {
    return {
      record: {},
      rules: {
        clientid: { required: true, message: this.$t('Clients.pleaseEnter') },
        username: { required: true, message: this.$t('Clients.pleaseEnter') },
        password: { required: true, message: this.$t('Clients.pleaseEnter') },
      },
      isSubmitting: false,
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
      if (val) {
        if (this.auth) {
          this.record = { ...this.auth }
        } else {
          this.record = {}
        }
        this.$nextTick(this.$refs.record.clearValidate)
      }
    },
  },
  methods: {
    submittedSuc() {
      this.$emit('submitted')
      this.showDialog = false
    },
    add() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        this.isSubmitting = true
        const { username, clientid, login, ...data } = this.record
        if (this.type === 'clientid') {
          data.clientid = clientid
        } else {
          data.username = username
        }
        try {
          await addAuth(this.type, data)
          this.$message.success(this.$t('Base.createSuccess'))
          this.submittedSuc()
        } catch (error) {
          //
        } finally {
          this.isSubmitting = false
        }
      })
    },
    async handleEdit() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        const login = this.record[this.type]
        const { password } = this.record
        this.isSubmitting = true
        try {
          await updateAuth(this.type, login, { password })
        } catch (error) {
          //
        } finally {
          this.isSubmitting = false
        }
        this.$message.success(this.$t('Base.editSuccess'))
        this.submittedSuc()
      })
    },
  },
}
</script>
