<template>
  <div class="file-binary-editor">
    <el-row>
      <el-col :span="24">
        <el-input v-if="fileContent" type="textarea" :rows="4" v-model="fileContent" readonly></el-input>
        <div class="file-binary-editor-ft">
          <label class="label-desc">
            {{ $t(`RuleEngine.${!!fileContent ? 'fileContentAfterBASE64' : 'binaryUploadTip'}`) }}
          </label>
          <el-upload
            ref="upload"
            class="file-upload"
            :show-file-list="false"
            action="/api/v4/data/file"
            :auto-upload="false"
            :on-change="handleChange"
            :on-error="handleError"
          >
            <el-button>{{ $t('Backup.selectFile') }}</el-button>
          </el-upload>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fromByteArray } from 'base64-js'
import { readFile } from '@/common/utils.js'

export default {
  name: 'FileEditor',

  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  computed: {
    fileContent: {
      get() {
        return this.value.file
      },
      set(val) {
        let name
        if ('filename' in this.value) {
          name = this.value.filename
        }
        if (val && !name) {
          name = `${Date.now()}`
        } else if (!val && name) {
          // clear name when clear content
          name = ''
        }
        this.$emit('update', { filename: name, file: val })
      },
    },
  },

  methods: {
    confirmReplacement() {
      return this.$msgbox.confirm(this.$t('Modules.confirmReplacement'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
    },
    async handleChange(file) {
      const content = await readFile(file.raw, 'binary')
      const afterBase64 = fromByteArray(new Uint8Array(content))
      const uploadData = {
        file: afterBase64,
        filename: file.name,
      }
      this.$emit('update', uploadData)
    },
    handleError(error) {
      this.$message.error(error.toString())
    },
  },
}
</script>

<style lang="scss">
.file-binary-editor {
  .el-upload {
    width: 100%;
    text-align: right;

    .file-icon {
      color: #34c388;
    }
  }
  .label-desc {
    color: #bcbcbc;
    font-size: 12px;
  }
  .file-binary-editor-ft {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }
}
</style>
