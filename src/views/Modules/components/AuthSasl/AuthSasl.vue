<template>
  <div class="auth-sasl">
    <el-card shadow="never" class="emq-list-card">
      <div class="list-header">
        <div class="title">{{ $t('Modules.enhancedAuth') }}</div>
        <el-button type="primary" size="small" @click="showDialog('add')">
          {{ $t('Base.add') }}
        </el-button>
      </div>
      <div class="mechanism-box">
        <span class="label">{{ $t('Modules.mechanism') }}</span>
        <emq-select v-model="mechanism" size="small" :field="{ list: mechanismOptions }" @change="getList"></emq-select>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="username" :label="$t('Clients.username')">
          <template slot-scope="{ row }">
            <a href="javascript:;" @click="showDialog('view', row)">{{ row.username }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="oper" width="120px">
          <template slot-scope="{ row }">
            <el-button type="dashed" size="mini" @click="showDialog('edit', row)">
              {{ $t('Base.edit') }}
            </el-button>
            <el-button type="dashed danger" size="mini" @click="handleDelete(row)">
              {{ $t('Base.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="this.dialogTitle" width="520px" :visible.sync="dialogVisible" @close="handleClose">
      <el-row :gutter="20">
        <el-form
          ref="record"
          class="el-form--public"
          :model="record"
          :rules="oper !== 'view' ? rules : {}"
          size="small"
          label-position="top"
        >
          <el-col :span="12">
            <el-form-item class="mechanism-item" prop="mechanism" :label="$t('Modules.mechanism')">
              <emq-select
                v-model="record.mechanism"
                :field="{ list: mechanismOptions }"
                :readonly="oper === 'view'"
              ></emq-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="username" :label="$t('Clients.username')">
              <el-input v-model="record.username" :disabled="oper === 'edit'" :readonly="oper === 'view'"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="oper !== 'view'" :span="12">
            <el-form-item prop="password" :label="$t('Base.password')">
              <el-input v-model="record.password" type="password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="salt" label="salt">
              <el-input v-model="record.salt" :readonly="oper === 'view'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="iteration_count" :label="$t('Modules.iterationCount')">
              <el-input v-model.number="record.iteration_count" type="number" :readonly="oper === 'view'"></el-input>
            </el-form-item>
          </el-col>
          <template v-if="oper === 'view'">
            <el-col :span="24">
              <el-form-item class="key-items" prop="stored_key" :label="$t('Modules.storedKey')">
                <el-input v-model="record.stored_key" :readonly="oper === 'view'" style="width: 92%"></el-input>
                <div class="handle-icons">
                  <i
                    v-clipboard:cpoy="record.stored_key"
                    v-clipboard:success="copySuccessed"
                    class="el-icon-copy-document"
                  ></i>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item class="key-items" prop="server_key" :label="$t('Modules.serverKey')">
                <el-input v-model="record.server_key" :readonly="oper === 'view'" style="width: 92%"></el-input>
                <div class="handle-icons">
                  <i
                    v-clipboard:cpoy="record.server_key"
                    v-clipboard:success="copySuccessed"
                    class="el-icon-copy-document"
                  ></i>
                </div>
              </el-form-item>
            </el-col>
          </template>
        </el-form>
      </el-row>

      <div v-if="oper !== 'view'" slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="handleClose">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="handleUpdate">{{ $t('Base.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSaslList, addSasl, deleteSasl, showSasl, editSasl } from '@/api/modules'

export default {
  name: 'AuthSasl',

  data() {
    const verifyIterationCount = (rule, value, callback) => {
      if (value <= 0 || typeof value !== 'number' || value % 1 !== 0) {
        callback(new Error(this.$t('Modules.iterationCountTip')))
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '',
      tableData: [],
      mechanism: 'SCRAM-SHA-1',
      mechanismOptions: ['SCRAM-SHA-1'],
      oper: '',
      dialogVisible: false,
      record: {
        mechanism: 'SCRAM-SHA-1',
        iteration_count: 4096,
      },
      rules: {
        mechanism: [{ required: true, message: this.$t('General.pleaseChoose') }],
        username: [{ required: true, message: this.$t('General.pleaseEnter') }],
        password: [{ required: true, message: this.$t('General.pleaseEnter') }],
        salt: [{ required: true, message: this.$t('General.pleaseEnter') }],
        iteration_count: [{ validator: verifyIterationCount }],
      },
    }
  },

  created() {
    this.getList()
  },

  methods: {
    async getList() {
      this.tableData = await getSaslList(this.mechanism)
    },
    async showDialog(oper, row) {
      this.dialogVisible = true
      this.oper = oper
      if (oper === 'edit') {
        this.dialogTitle = this.$t('Modules.editAuth')
        const res = await showSasl(this.mechanism, row.username)
        const { salt, iteration_count } = res
        this.record = {
          salt,
          iteration_count,
          username: row.username,
          mechanism: 'SCRAM-SHA-1',
        }
      } else if (oper === 'view') {
        this.dialogTitle = this.$t('Modules.viewAuth')
        const res = await showSasl(this.mechanism, row.username)
        const { salt, iteration_count, stored_key, server_key } = res
        this.record = {
          salt,
          iteration_count,
          username: row.username,
          stored_key,
          server_key,
          mechanism: 'SCRAM-SHA-1',
        }
      } else {
        this.dialogTitle = this.$t('Modules.addAuth')
      }
    },
    handleUpdate() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { ...record } = this.record
        if (!record.iteration_count) {
          delete record.iteration_count
        }
        if (this.oper === 'add') {
          await addSasl(record)
          this.$message.success(this.$t('Base.createSuccess'))
        } else {
          await editSasl(record)
          this.$message.success(this.$t('Base.editSuccess'))
        }
        this.handleClose()
        this.getList()
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.$refs.record.resetFields()
      this.record = {
        mechanism: 'SCRAM-SHA-1',
        iteration_count: 4096,
      }
    },
    handleDelete(row) {
      this.$confirm(this.$t('Modules.confirmDelete'), this.$t('Base.warning'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          await deleteSasl(this.mechanism, row.username)
          this.getList()
          this.$message.success(this.$t('Base.deleteSuccess'))
        })
        .catch(() => {})
    },
    copySuccessed() {
      this.$message.success(this.$t('Base.copied'))
    },
  },
}
</script>

<style lang="scss">
.auth-sasl {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .title {
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .mechanism-box {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    align-items: center;

    .label {
      display: inline-block;
      color: #757575;
      font-size: 16px;
      margin-right: 10px;
    }
  }

  .mechanism-item {
    .el-select {
      width: 100%;
    }
  }

  .key-items {
    position: relative;
    .handle-icons {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 50px;
      height: 32px;
      text-align: right;
      font-size: 16px;
      i {
        cursor: pointer;
        color: #34c388;
      }
    }
  }
}
</style>
