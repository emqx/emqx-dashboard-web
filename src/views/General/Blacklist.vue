<template>
  <div class="blacklist app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog">
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table :data="tableData" v-loading="tbLoading">
      <el-table-column prop="who" :label="$t('General.who')" sortable> </el-table-column>
      <el-table-column prop="as" :label="$t('General.as')" sortable> </el-table-column>
      <el-table-column prop="reason" min-width="120px" :label="$t('General.reason')" sortable>
      </el-table-column>
      <el-table-column
        prop="until"
        :formatter="formatterUntil"
        :label="$t('General.until')"
        sortable
      >
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <el-button plain type="danger" size="mini" @click="deleteConfirm(row)"
            >{{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <common-pagination :count="count" :reload-func="listBlackList"></common-pagination>
    </div>

    <el-dialog :title="$t('General.createBlacklist')" :visible.sync="dialogVisible">
      <el-form ref="recordForm" size="small" :model="record" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="as" :label="$t('General.as')">
              <emq-select v-model="record.as" :field="{ options: asOptions }"> </emq-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="who" :label="$t('General.who')">
              <el-input v-model="record.who"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="reason" :label="$t('General.reason')">
              <el-input v-model="record.reason"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="until" :label="$t('General.until')">
              <el-date-picker
                v-model="record.until"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="closeDialog">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { loadBlacklist, createBlacklist, deleteBlacklist } from '@/api/function'
import CommonPagination from '../../components/commonPagination.vue'

export default {
  name: 'Blacklist',
  components: { CommonPagination },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      params: {
        // _page: 1,
        // _limit: 20,
      },
      count: 0,
      asOptions: [
        { label: 'clientid', value: 'clientid' },
        { label: 'username', value: 'username' },
        { label: 'peerhost', value: 'peerhost' },
      ],
      record: {
        reason: '',
      },
      rules: {
        as: [{ required: true, message: this.$t('General.enterAs') }],
        who: [{ required: true, message: this.$t('General.enterWho') }],
      },
      tbLoading: false,
    }
  },
  created() {
    // this.listBlackList()
  },
  methods: {
    async listBlackList(params = {}) {
      this.tbLoading = true
      const res = await loadBlacklist({ ...this.params, ...params }).catch(() => {})
      if (res) {
        const {
          data = [],
          meta: {},
        } = res
        this.tableData = data
        this.count = meta.count
      }
      this.tbLoading = false
    },

    clearInput() {
      this.$refs?.recordForm?.resetFields()
    },
    showDialog() {
      this.record = {
        reason: '',
      }
      this.clearInput()
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    async save() {
      this.$refs.recordForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        if (record.until && typeof record.until === 'number') {
          try {
            record.until = Math.floor(record.until / 1000)
          } catch (e) {
            record.until = null
          }
        }
        const res = await createBlacklist(record).catch(() => {})
        if (res) {
          this.$message.success(this.$t('General.createBlacklistSuccess'))
          this.closeDialog()
          this.listBlackList()
        }
      })
    },
    deleteConfirm(item) {
      this.$msgbox
        .confirm(this.$t('General.determineToDeleteTheBlacklist'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          const { who, as } = item
          const res = await deleteBlacklist({ who, as }).catch(() => {})
          if (res) {
            this.$message.success(this.$t('Base.deleteSuccess'))
            this.listBlackList()
          }
        })
        .catch(() => {})
    },
    formatterUntil({ until }) {
      if (!until || typeof until !== 'number') {
        return this.$t('General.neverExpire')
      }
      return moment(until * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>

<style lang="scss" scoped></style>
