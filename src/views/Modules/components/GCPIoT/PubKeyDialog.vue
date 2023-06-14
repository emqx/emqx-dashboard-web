<template>
  <el-dialog
    append-to-body
    width="700px"
    custom-class="pub-key-dialog"
    :title="$t('Modules.addPubKey')"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
  >
    <el-form ref="record" :model="record" :rules="rules" size="small" label-position="top">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="key_type" :label="$t('Modules.pubKeyFormat')">
            <el-select v-model="record.key_type">
              <el-option v-for="{ label, value } in keyFormatOpt" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="key">
            <FileEditor
              v-model="keyFile"
              :raw-accept="CER_FILE_ACCEPTS"
              @update="setKeyValue"
              :placeholder="textareaPlaceholder"
              :check-content="checkFileContent"
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item prop="expires_at" :label="$t('General.expireAt')">
            <el-date-picker
              v-model="record.expires_at"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              :placeholder="$t('General.neverExpire')"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-align-footer">
      <el-button plain size="small" @click="closeDialog">{{ $t('Base.cancel') }}</el-button>
      <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FileEditor from '@/components/FileEditor.vue'
import { keyFormatOpt } from '@/common/GCPCoreIoT.js'

const textareaPlaceholder = `-----BEGIN PUBLIC KEY-----
(Public key value must be in PEM format)
-----END PUBLIC KEY-----`

const X509Reg = /X509/i
const PEMFormatReg = /^(\s|\n)*-----BEGIN PUBLIC KEY-----(.|\n)+-----END PUBLIC KEY-----(\s|\n)*$/
const X509FormatReg = /^(\s|\n)*-----BEGIN CERTIFICATE-----(.|\n)+-----END CERTIFICATE-----(\s|\n)*$/

const createRawRecord = () => ({
  key_type: keyFormatOpt[0].value,
  key: '',
  expires_at: undefined,
})

export default {
  components: {
    FileEditor,
  },
  props: {
    value: {
      type: Boolean,
    },
  },
  data() {
    const CER_FILE_ACCEPTS = ['crt', 'key', 'pem', 'jks', 'der', 'cer', 'pfx'].map((type) => `.${type}`).join(', ')
    const _this = this
    return {
      CER_FILE_ACCEPTS,
      keyFormatOpt,
      textareaPlaceholder,
      keyFile: {},
      record: createRawRecord(),
      rules: {
        key: [
          { required: true, message: this.$t('Tools.pleaseEnter') },
          {
            validator(rules, value) {
              const ret = _this.testKeyFormat(value)
              return !ret ? Promise.reject(_this.$t('Modules.formatMismatch')) : Promise.resolve()
            },
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },

  watch: {
    dialogVisible(val) {
      if (!val) {
        this.$refs.record.clearValidate()
        this.$nextTick(() => {
          this.record = createRawRecord()
        })
        this.keyFile = {}
      }
    },
  },

  methods: {
    closeDialog() {
      this.dialogVisible = false
    },
    testKeyFormat(key) {
      return X509Reg.test(this.record.key_type) ? X509FormatReg.test(key) : PEMFormatReg.test(key)
    },
    checkFileContent(key) {
      const ret = this.testKeyFormat(key)
      if (!ret) {
        this.$message.error(this.$t('Modules.formatMismatch'))
      }
      return ret
    },
    setKeyValue(file) {
      this.record.key = file.file
    },
    async save() {
      try {
        await this.$refs.record.validate()
        this.dialogVisible = false
        this.record.expires_at = Math.floor(this.record.expires_at / 1000)
        this.$emit('save', this.record)
      } catch (error) {
        //
      }
    },
  },
}
</script>

<style lang="scss">
.pub-key-dialog {
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
  .el-date-editor.el-input,
  .el-select {
    width: 100%;
  }
}
</style>
