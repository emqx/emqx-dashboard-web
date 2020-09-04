<template>
  <div class="file-editor">
    <el-upload :show-file-list="false" action="#" :http-request="uploadFile">
      <el-button slot="trigger" size="small" :icon="buttonIcon">
        {{ $t('Modules.uploadFile') }}
      </el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'FileEditor',

  props: {},

  data() {
    return {
      buttonIcon: 'el-icon-upload',
      content: '',
    }
  },

  methods: {
    uploadFile(file) {
      this.buttonIcon = 'el-icon-loading'
      const reader = new FileReader()
      reader.readAsText(file.file)
      reader.onloadend = (evt) => {
        if (evt.target.readyState === FileReader.DONE) {
          this.content = evt.target.result
          this.buttonIcon = 'el-icon-finished'
        }
      }
    },
  },
}
</script>

<style lang="scss">
.file-editor {
  .el-upload {
    width: 100%;
    .el-button.el-button--small {
      width: 100%;
    }
  }
}
</style>
