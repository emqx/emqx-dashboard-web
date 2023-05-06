<template>
  <el-dialog custom-class="ca-dialog" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <FileEditor v-model="key" :accept="CER_FILE_ACCEPTS" />
    <div slot="footer" class="dialog-align-footer">
      <el-button plain size="small" @click="closeDialog">{{ $t('Base.cancel') }}</el-button>
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
    return {
      CER_FILE_ACCEPTS,
      key: '',
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

  methods: {
    closeDialog() {
      this.dialogVisible = false
    },
    save() {},
  },
}
</script>
