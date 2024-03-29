<template>
  <div class="file-editor">
    <el-row>
      <el-col :span="24">
        <div class="input-container">
          <el-input type="textarea" :rows="4" v-model="fileContent"></el-input>
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
          name = `${Date.now()}.txt`
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
    handleChange(file) {
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
    }
    .file-upload {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 4px 18px 6px;
    }
    .el-button {
      background-color: #f7f7f7;
      border-color: #f7f7f7;
    }
  }
}
</style>
