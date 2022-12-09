<template>
  <div class="file-editor">
    <el-row>
      <el-col :span="24">
        <div class="input-container">
          <el-input type="textarea" :rows="5" v-model="fileContent"></el-input>
          <div class="editor-ft">
            <p class="tip">{{ uploadTip }}</p>
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
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
    accept: {
      type: String,
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
          name = `${Date.now()}.txt`
        } else if (!val && name) {
          // clear name when clear content
          name = ''
        }
        this.$emit('update', { filename: name, file: val })
      },
    },
    uploadTip() {
      if (this.accept && this.accept.indexOf(',') === -1) {
        return this.$t('RuleEngine.uploadTip', { format: this.accept.slice(1) })
      }
      return this.$t('Base.inputWithUploaderTip')
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
    handleChange(file) {
      if (file.raw.size > 128 * 1000) {
        this.$message.error(this.$t('Backup.fileTooLarge'))
        return
      }
      const reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = async (event) => {
        const content = event.currentTarget.result
        if (this.value.file) {
          await this.confirmReplacement()
        }
        const uploadData = {
          file: content,
          filename: file.name,
        }
        this.$emit('update', uploadData)
      }
      reader.onerror = () => {
        this.$message.error(this.$t('Backup.uploadFailed'))
      }
    },
    handleError(error) {
      this.$message.error(error.toString())
    },
  },
}
</script>

<style lang="scss">
.file-editor {
  .el-upload {
    width: 100%;
    text-align: right;

    .file-icon {
      color: #34c388;
    }
  }
  .input-container {
    position: relative;
    .el-textarea__inner {
      padding-bottom: 6px + 28px;
      box-sizing: border-box;
      resize: none;
      border-width: 0;
      border-bottom-width: 60px;
      border-color: transparent;
      border-bottom: 60px solid transparent;
      box-shadow: 0 0 0 1px #d9d9d9;
      &:hover {
        box-shadow: 0 0 0 1px #c0c4cc;
      }
      &:focus {
        box-shadow: 0 0 0 1px #34c388, 0 0 0 3px rgb(52 195 136 / 20%);
      }
    }
    .el-button {
      background-color: #f7f7f7;
      border-color: #f7f7f7;
    }
  }
  .editor-ft {
    position: absolute;
    bottom: 1px;
    left: 1px;
    right: 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 2px);
    height: 60px;
    padding: 10px 12px;
    .tip {
      margin-bottom: 0;
      color: #969696;
      font-size: 13px;
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 12px;
      display: block;
      height: 1px;
      width: calc(100% - 12px - 12px);
      background: #d9d9d9;
    }
  }
}
</style>
