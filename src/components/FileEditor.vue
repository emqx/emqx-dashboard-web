<template>
  <div class="file-editor">
    <el-row>
      <el-col :span="22">
        <el-form-item style="margin-bottom: 0px;">
          <el-input v-model="value.filename" :placeholder="$t('Modules.fileTip')"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-upload
          ref="upload"
          :show-file-list="false"
          action="/api/v4/data/file"
          :auto-upload="false"
          :on-change="handleChange"
          :on-error="handleError"
        >
          <i class="el-icon-folder-opened file-icon"></i>
        </el-upload>
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

  methods: {
    encode(str) {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
          return String.fromCharCode(`0x${p1}`)
        }),
      )
    },
    handleChange(file) {
      const reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = async (event) => {
        const content = event.currentTarget.result
        const uploadData = {
          file: this.encode(content),
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
}
</style>
