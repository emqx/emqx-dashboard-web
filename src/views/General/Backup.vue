<template>
  <div class="backup">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('Backup.manageDashboardBackup') }}
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card
        class="emq-list-card"
      >
        <div class="emq-table-header">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleExport"
          >
            {{ $t('Backup.createBackup') }}
          </el-button>
          <el-upload
            ref="upload"
            class="upload-backup"
            action="/api/v4/data/file"
            accept=".json"
            :limit="1"
            :file-list="fileList"
            :auto-upload="false"
            :on-change="handleChange"
            :on-error="handleError"
          >
            <el-button
              slot="trigger"
              size="small"
              icon="el-icon-upload2"
            >
              {{ $t('Backup.uploadServer') }}
            </el-button>
          </el-upload>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="filename" :label="$t('Backup.filename')"></el-table-column>
          <el-table-column prop="size" :label="$t('Backup.size')">
            <template slot-scope="{ row }">
              {{ row.size | renderSize }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" :label="$t('Backup.createAt')"></el-table-column>
          <el-table-column width="250px">
            <template slot-scope="{ row }">
              <el-button
                type="dashed"
                size="mini"
                @click="handleDownload(row)"
              >{{ $t('Backup.download') }}
              </el-button>
              <el-button
                type="dashed"
                size="mini"
                @click="handleRestore(row)"
              >{{ $t('Backup.restore') }}
              </el-button>
              <el-button
                type="dashed danger"
                size="mini"
                @click="deleteConfirm(row)"
              >{{ $t('General.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>
  </div>
</template>


<script>
import {
  loadBackup, exportBackup, deleteBackup, downloadFile, importBackup, uploadBackupFile,
} from '@/api/backup'

export default {
  name: 'Backup',

  components: {},

  filters: {
    renderSize(val) {
      if (val === null || val === '') {
        return '0 Bytes'
      }
      const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = 0
      const srcsize = parseFloat(val)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      let size = srcsize / (1024 ** index)
      size = size.toFixed(1)
      return `${size} ${unitArr[index]}`
    },
  },

  props: {},

  data() {
    return {
      fileList: [],
      tableData: [],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.tableData = await loadBackup()
    },
    async handleExport() {
      const res = await exportBackup()
      if (res) {
        this.$message.success(this.$t('Base.createSuccess'))
        this.loadData()
      }
    },
    async handleDownload(row) {
      const res = await downloadFile(row.filename)
      if (res) {
        const aTag = document.createElement('a')
        const blob = new Blob([res.file])
        aTag.download = row.filename
        aTag.href = URL.createObjectURL(blob)
        aTag.setAttribute('type', 'hidden')
        document.body.appendChild(aTag)
        aTag.click()
        aTag.remove()
        URL.revokeObjectURL(blob)
      }
    },
    async handleRestore(row) {
      const res = await importBackup(row.filename)
      if (res) {
        this.$message.success(this.$t('Backup.restoreSuccess'))
      }
    },
    deleteConfirm(row) {
      const vue = this
      this.$msgbox.confirm(this.$t('Backup.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(async () => {
        deleteBackup(row.filename).then(() => {
          vue.$message.success(this.$t('General.successfulDeletion'))
          vue.loadData()
        })
      }).catch(() => {})
    },
    handleChange(file) {
      if (file.size >= 5242880) {
        this.$message.warning(this.$t('Backup.fileTooBig'))
        this.$refs.upload.clearFiles()
        return
      }
      const reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = async (event) => {
        const content = event.currentTarget.result
        const uploadData = {
          file: content,
          filename: file.name,
        }
        const res = await uploadBackupFile(uploadData)
        if (res) {
          this.handleRestore({ filename: file.name })
          this.loadData()
          this.$refs.upload.clearFiles()
        }
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
.backup {
  .el-table {
    margin-bottom: 40px;
  }
  .upload-backup {
    text-align: right;
  }
}
</style>
