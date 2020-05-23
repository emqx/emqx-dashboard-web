<template>
  <div class="blacklist">
    <page-header
      :back-title="$t('General.blacklist')"
    >
      <div class="page-header-content-view">
        <div class="content">
          <p class="description">
            {{ $t('General.blacklistTips') }}
            <a :href="docs.tutorial" target="_blank">
              {{ $t('General.authDocs') }}
            </a>
          </p>
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
            @click="showDialog"
          >
            {{ $t('Base.create') }}
          </el-button>
        </div>
        <el-table :data="tableData" class="data-list">
          <el-table-column prop="who" min-width="120px" :label="$t('General.who')">
          </el-table-column>
          <el-table-column prop="as" min-width="120px" :label="$t('General.as')">
          </el-table-column>
          <el-table-column prop="reason" min-width="120px" :label="$t('General.reason')">
          </el-table-column>
          <el-table-column
            prop="until" min-width="120px" :formatter="formatterUntil"
            :label="$t('General.until')"
          >
          </el-table-column>
          <el-table-column prop="oper" width="120px" label="">
            <template slot-scope="{ row }">
              <el-button
                type="danger"
                size="mini"
                @click="deleteConfirm(row)"
              >{{ $t('General.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="emq-table-footer">
          <el-pagination
            hide-on-single-page
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[20, 50, 100, 500]" :page-size.sync="params._limit"
            :current-page.sync="params._page" :total="count" @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
          >
          </el-pagination>
        </div>
      </a-card>
    </div>

    <el-dialog
      width="520px"
      :title="$t('General.createBlacklist')"
      :visible.sync="dialogVisible"
      @close="clearInput"
    >
      <el-form ref="recordForm" size="small" :model="record" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="as" :label="$t('General.as')">
              <emq-select
                v-model="record.as"
                :field="{ options: asOptions }"
              >
              </emq-select>
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
import { getLink } from '@/common/utils'

export default {
  name: 'Blacklist',
  components: {},
  props: {},
  data() {
    return {
      docs: {
        tutorial: getLink('auth'),
      },
      dialogVisible: false,
      tableData: [],
      params: {
        _page: 1,
        _limit: 20,
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
        as: [
          { required: true, message: this.$t('General.enterAs') },
        ],
        who: [
          { required: true, message: this.$t('General.enterWho') },
        ],
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listBlackList()
    },
    async listBlackList(reload, params = {}) {
      if (reload) {
        this.params._page = 1
      }
      const data = await loadBlacklist({ ...this.params, ...params })
      const { items = [], meta: { count = 0 } } = data
      this.tableData = items
      this.count = count
    },
    handleSizeChange() {
      this.listBlackList(true)
    },
    handleCurrentPageChange() {
      this.listBlackList()
    },
    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.resetFields()
      }
    },
    showDialog() {
      this.record = {
        reason: '',
      }
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
        const res = await createBlacklist(record)
        if (res) {
          this.$message.success(this.$t('General.createBlacklistSuccess'))
          this.closeDialog()
          this.listBlackList()
        }
      })
    },
    deleteConfirm(item) {
      this.$msgbox.confirm(this.$t('General.determineToDeleteTheBlacklist'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(async () => {
        const { who, as } = item
        const res = await deleteBlacklist({ who, as })
        if (res) {
          this.$message.success(this.$t('General.successfulDeletion'))
          this.listBlackList(true)
        }
      }).catch(() => {})
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


<style lang="scss" scoped>
.blacklist {
  .description {
    max-width: 500px;
  }
}
</style>
