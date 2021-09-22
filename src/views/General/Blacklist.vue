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
      <common-pagination ref="p" :reload-func="listBlackList"></common-pagination>
    </div>

    <el-dialog :title="$t('General.createBlacklist')" :visible.sync="dialogVisible">
      <el-form ref="recordForm" size="small" :model="record" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('General.banObject')" prop="who">
              <el-input v-model="record.who">
                <el-select slot="append" v-model="record.as">
                  <el-option
                    v-for="item in asOptions"
                    :key="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('General.until')" prop="until">
              <el-date-picker v-model="record.until" type="datetime" format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="reason" :label="$t('General.reason')">
            <el-input
              v-model="record.reason"
              type="textarea"
              :rows="3"
              :placeholder="$t('General.reason')"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="closeDialog">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="save" :loading="submitLoading">{{
          $t('Base.create')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat } from '@/common/utils'
import { loadBlacklist, createBlacklist, deleteBlacklist } from '@/api/function'
import CommonPagination from '../../components/commonPagination.vue'

export default {
  name: 'Blacklist',
  components: { CommonPagination },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      params: {},
      submitLoading: false,
      asOptions: [{ value: 'clientid' }, { value: 'username' }, { value: 'peerhost' }],
      record: {},
      rules: {
        as: [{ required: true, message: this.$t('General.enterAs') }],
        who: [{ required: true, message: this.$t('General.enterWho') }],
        until: [{ required: true, message: this.$t('General.enterUntil') }],
      },
      tbLoading: false,
    }
  },
  mounted() {
    this.$refs.p.$emit('loadPage')
  },
  methods: {
    async listBlackList(params = {}) {
      this.tbLoading = true
      const res = await loadBlacklist({ ...this.params, ...params }).catch(() => {})
      if (res) {
        const { data = [], meta = {} } = res
        this.tableData = data
        this.tbLoading = false
        return meta
      } else {
        this.tbLoading = false
        this.tableData = []
        return {}
      }
    },

    clearInput() {
      this.$refs?.recordForm?.resetFields()
    },
    showDialog() {
      this.record = {
        reason: '',
        who: '',
        as: 'clientid',
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
        const record = { ...this.record, until: new Date(this.record.until).toISOString() }
        // if (typeof record.until === 'number') {
        //   record.until = Math.floor(record.until / 1000)
        // }

        this.submitLoading = true
        const res = await createBlacklist(record).catch(() => {})
        if (res) {
          this.$message.success(this.$t('General.createBlacklistSuccess'))
          this.closeDialog()
          this.$refs.p.$emit('loadPage')
        }
        this.submitLoading = false
      })
    },
    deleteConfirm(item) {
      this.$msgbox
        .confirm(this.$t('General.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          const { who, as } = item
          const res = await deleteBlacklist({ who, as }).catch(() => {})
          if (res) {
            this.$message.success(this.$t('Base.deleteSuccess'))
            this.$refs.p.$emit('loadPage')
          }
        })
        .catch(() => {})
    },
    formatterUntil({ until }) {
      if (!until) {
        return this.$t('General.neverExpire')
      }
      return dateFormat(until)
    },
  },
}
</script>

<style lang="scss" scoped>
.el-input-group--append ::v-deep .el-input-group__append {
  width: 90px;
}
</style>
