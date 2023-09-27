<template>
  <el-upload
    ref="upload"
    class="license-uploaded"
    :show-file-list="false"
    action="/api/v4/license/upload"
    :before-upload="handleUpload"
    :on-error="handleError"
    :disabled="notAbleChange"
  >
    <el-button type="primary" size="small" :disabled="notAbleChange">
      <i class="el-icon-upload2" />
      <span> {{ $t('Overview.updateLicense') }} </span>
    </el-button>
  </el-upload>
</template>

<script>
import { uploadLicense } from '@/api/overview'

export default {
  name: 'LicenseUploaded',
  methods: {
    handleUpload(file) {
      uploadLicense(file).then(() => {
        this.$message.success(this.$t('Overview.uploadedSuccessfully'))
        this.$emit('uploaded')
      })
      return false
    },
    handleSuccess() {
      this.$emit('upload-successful')
    },
    handleError(error) {
      console.log(error)
    },
  },
}
</script>
