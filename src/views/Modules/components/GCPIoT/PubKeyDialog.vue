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
          <el-form-item prop="XXXXX" :label="$t('Modules.pubKeyFormat')">
            <el-select v-model="record.XXXX">
              <el-option v-for="item in formatOpt" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="XXXXX">
            <FileEditor v-model="keyFile" :accept="CER_FILE_ACCEPTS" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item prop="XXXXX" :label="$t('General.expireAt')">
            <el-date-picker v-model="record.XXXX" type="date" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-align-footer">
      <el-button plain size="small" @click="closeDialog">{{ $t('Base.cancel') }}'</el-button>
      <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FileEditor from '@/components/FileEditor.vue'

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
    const formatOpt = []
    return {
      CER_FILE_ACCEPTS,
      formatOpt,
      keyFile: {},
      record: {},
      rules: {},
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
        // TODO
      }
    },
  },

  methods: {
    closeDialog() {
      this.dialogVisible = false
    },
    save() {},
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
