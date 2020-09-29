<template>
  <a-card class="mnesia-auth-table emq-list-card">
    <div class="emq-table-header">
      <el-row class="add-form" :gutter="20">
        <el-form :model="record" ref="record" :rules="rules">
          <el-col :span="6">
            <el-form-item>
              <emq-select v-model="type" :field="{ options: typeOptions }" size="small"> </emq-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :prop="type === 'clientid' ? 'clientid' : 'name'">
              <el-input
                v-if="type === 'clientid'"
                v-model="record.clientid"
                size="small"
                :placeholder="$t('Clients.clientId')"
                clearable
              ></el-input>
              <el-input
                v-else
                v-model="record.username"
                size="small"
                :placeholder="$t('Clients.username')"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="password">
              <el-input
                v-model="record.password"
                size="small"
                type="password"
                :placeholder="$t('Base.password')"
                show-password
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <div class="col-oper">
          <el-button :loading="addLoading" type="primary" icon="el-icon-plus" size="small" @click="save">
            {{ $t('Base.add') }}
          </el-button>
        </div>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-table :data="clientidTableData" class="data-list" v-loading="idListLoading">
          <el-table-column prop="clientid" :label="$t('Clients.clientId')"> </el-table-column>
          <el-table-column prop="oper" width="120px">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showEdit(row, 'clientid')">
                {{ $t('Base.edit') }}
              </el-button>
              <el-button type="dashed danger" size="mini" @click="handleDelete(row, 'clientid')">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="emq-table-footer">
          <el-pagination
            v-if="clientidCount > 10"
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[10, 50, 100, 500]"
            :page-size.sync="clientidParams._limit"
            :current-page.sync="clientidParams._page"
            :total="clientidCount"
            @size-change="handleSizeChange('clientid')"
            @current-change="handleCurrentPageChange('clientid')"
          >
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="12">
        <el-table :data="usernameTableData" class="data-list" v-loading="nameListLoading">
          <el-table-column prop="username" :label="$t('Clients.username')"> </el-table-column>
          <el-table-column prop="oper" width="120px">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showEdit(row, 'username')">
                {{ $t('Base.edit') }}
              </el-button>
              <el-button type="dashed danger" size="mini" @click="handleDelete(row, 'username')">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="emq-table-footer">
          <el-pagination
            v-if="usernameCount > 10"
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[10, 50, 100, 500]"
            :page-size.sync="usernameParams._limit"
            :current-page.sync="usernameParams._page"
            :total="usernameCount"
            @size-change="handleSizeChange('username')"
            @current-change="handleCurrentPageChange('username')"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="editVisible" width="400px" :title="$t('Base.edit')" @keyup.enter.native="handleEdit">
      <el-form ref="editRecord" class="el-form--public app-info" size="medium" :rules="rules" :model="editRecord">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              prop="login"
              :label="operType === 'clientid' ? $t('Clients.clientId') : $t('Clients.username')"
            >
              <el-input v-model="editRecord.login" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="password" label="Password">
              <el-input v-model="editRecord.password" type="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" class="cache-btn" @click="editVisible = false">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="primary" size="small" @click="handleEdit">
          {{ $t('Base.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </a-card>
</template>

<script>
import { addAuth, loadAuth, deleteAuth, updateAuth } from '@/api/modules'

export default {
  name: 'MnesiaAuthTable',

  data() {
    return {
      type: 'clientid',
      record: {
        username: '',
        clientid: '',
        password: '',
      },
      typeOptions: [
        { label: this.$t('Clients.clientId'), value: 'clientid' },
        { label: this.$t('Clients.username'), value: 'username' },
      ],
      clientidTableData: [],
      usernameTableData: [],
      clientidCount: 0,
      usernameCount: 0,
      clientidParams: {
        _limit: 10,
        _page: 1,
      },
      usernameParams: {
        _limit: 10,
        _page: 1,
      },
      idListLoading: false,
      usernameListLoading: false,
      editVisible: false,
      editRecord: {},
      rules: {
        clientid: { required: true, message: this.$t('Clients.pleaseEnter') },
        username: { required: true, message: this.$t('Clients.pleaseEnter') },
        password: { required: true, message: this.$t('Clients.pleaseEnter') },
      },
      addLoading: false,
      operType: 'clientid',
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    loadOneData(type) {
      if (type === 'clientid') {
        this.loadClinetIdData()
      } else {
        this.loadUsernameData()
      }
    },
    loadData() {
      this.loadClinetIdData()
      this.loadUsernameData()
    },
    async loadClinetIdData() {
      this.idListLoading = true
      const data = await loadAuth('clientid', { ...this.clientidParams })
      const {
        items = [],
        meta: { count = 0 },
      } = data
      this.clientidTableData = items
      this.clientidCount = count
      this.idListLoading = false
    },
    async loadUsernameData() {
      this.nameListLoading = true
      const data = await loadAuth('username', { ...this.usernameParams })
      const {
        items = [],
        meta: { count = 0 },
      } = data
      this.usernameTableData = items
      this.usernameCount = count
      this.nameListLoading = false
    },
    async save() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        this.addLoading = true
        if (this.type === 'clientid') {
          const { username, ...data } = this.record
          this.addData(data)
        } else {
          const { clientid, ...data } = this.record
          this.addData(data)
        }
      })
    },
    async addData(data) {
      const res = await addAuth(this.type, data)
      if (res) {
        this.addSuccess(this.type)
      }
    },
    addSuccess(type) {
      this.$message.success(this.$t('Base.createSuccess'))
      this.addLoading = false
      this.loadOneData(type)
      this.$refs.record.resetFields()
    },
    showEdit(row, type) {
      this.editVisible = true
      this.operType = type
      const { ...data } = row
      this.editRecord = {
        login: data[type],
        password: data.password,
      }
    },
    async handleDelete(row, type) {
      this.$confirm(this.$t('Modules.confirmDelete'), this.$t('Base.warning'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          let res
          if (type === 'clientid') {
            res = await deleteAuth(type, row.clientid)
          } else {
            res = await deleteAuth(type, row.username)
          }
          if (res) {
            this.loadOneData(type)
            this.$message.success(this.$t('Base.deleteSuccess'))
          }
        })
        .catch(() => {})
    },
    handleSizeChange(type) {
      this.loadOneData(type)
    },
    handleCurrentPageChange(type) {
      this.loadOneData(type)
    },
    async handleEdit() {
      this.$refs.editRecord.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { login, password } = this.editRecord
        await updateAuth(this.operType, login, { password })
        this.$message.success(this.$t('Base.editSuccess'))
        this.editRecord = {}
        this.editVisible = false
        this.$refs.editRecord.resetFields()
      })
    },
  },
}
</script>

<style lang="scss">
.mnesia-auth-table {
  .emq-table-header {
    padding-bottom: 3px;
  }
  .add-form {
    display: block;
    width: 100%;
    .el-select {
      width: 100%;
    }
    .col-oper {
      .el-button {
        margin-left: 12px;
      }
    }
  }
  .data-list {
    clear: both;
  }
  .col-oper {
    margin-top: 4px;
  }
}
</style>
