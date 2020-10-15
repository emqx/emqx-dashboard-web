<template>
  <div class="clients">
    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <el-button type="primary" icon="el-icon-plus" size="small" class="add-button" @click="showDialog('create')">
          {{ $t('Base.create') }}
        </el-button>
        <div class="emq-table-header">
          <el-row class="search-wrapper" :gutter="20">
            <el-col :span="19">
              <el-col :span="6">
                <el-input v-model="fuzzyParams.client_id" size="small" :placeholder="$t('Clients.clientId')"></el-input>
              </el-col>
              <el-col :span="6">
                <el-input v-model="fuzzyParams.user_name" size="small" :placeholder="$t('Clients.username')"></el-input>
              </el-col>
              <el-col :span="6">
                <el-input v-model="fuzzyParams.ip_addr" size="small" :placeholder="$t('Clients.ipAddress')"></el-input>
              </el-col>
              <el-col :span="6">
                <el-select v-model="fuzzyParams.conn_status" size="small" :placeholder="$t('Clients.connectedStatus')">
                  <el-option
                    v-for="(item, index) in connectStatusList"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-col>
            </el-col>
            <div class="col-oper">
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">
                {{ $t('Clients.search') }}
              </el-button>
              <el-button plain size="small" :icon="resetIcon" @click="resetSearch">
                {{ $t('Clients.reset') }}
              </el-button>
            </div>
          </el-row>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="client_id" min-width="120px" :label="$t('Clients.clientId')">
            <template slot-scope="{ row }">
              <router-link
                :to="{
                  path: '/products/view/clients',
                  query: { clientid: row.client_id, id: $route.query.id },
                }"
              >
                {{ row.client_id }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="password" :label="$t('Base.password')" min-width="120px">
            <template slot-scope="{ row, $index }">
              <div class="password-box">
                <span v-if="$index === activeIndex">{{ row.password }}</span>
                <span v-else>****************</span>
                <i
                  :class="['el-icon-view', activeIndex === $index ? 'active-view' : '']"
                  @click="showPassword($index)"
                ></i>
                <i
                  class="el-icon-document-copy"
                  v-clipboard:cpoy="row.password"
                  v-clipboard:success="copySuccessed"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" :label="$t('Clients.username')"> </el-table-column>
          <el-table-column prop="ip_addr" min-width="140px" :label="$t('Clients.ipAddress')">
            <template slot-scope="{ row }"> {{ row.ip_addr }}</template>
          </el-table-column>
          <el-table-column prop="thing_name" :label="$t('Models.modelName')"> </el-table-column>
          <el-table-column prop="protocol" :label="$t('Clients.protocol')"> </el-table-column>
          <el-table-column prop="conn_status" :label="$t('Clients.connectedStatus')">
            <template slot-scope="{ row }">
              <a-badge
                is-dot
                :status="row.conn_status ? 'success' : 'error'"
                :text="row.conn_status ? $t('Clients.connected') : $t('Clients.disconnected')"
              >
              </a-badge>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>

    <el-dialog
      width="520px"
      :title="accessType === 'view' ? $t('Clients.viewEquipment') : $t('Clients.createEquipment')"
      :visible.sync="dialogVisible"
      @close="clearInput"
    >
      <el-form ref="recordForm" size="small" :model="record" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="client_id" :label="$t('Clients.clientId')">
              <el-input v-model="record.client_id" :readonly="accessType === 'view'">
                <i
                  slot="suffix"
                  :title="$t('Tools.randomGeneration')"
                  class="el-icon-refresh el-input_icon"
                  @click="refreshClientId"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="thing_id" :label="$t('Models.modelName')">
              <el-select v-model="record.thing_id" :disabled="accessType === 'view'">
                <el-option v-for="(item, index) in ModelData" :key="index" :value="item.id" :label="item.thing_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="user_name" :label="$t('Clients.username')">
              <el-input v-model="record.user_name" :readonly="accessType === 'view'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="accessType !== 'view'" slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="closeDialog">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createDevice, loadDevice, queryDevice } from '@/api/devices'
import { loadModel } from '@/api/models'
import { verifyID } from '@/common/utils'

export default {
  name: 'Clients',

  props: {
    tab: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      listLoading: false,
      tableData: [],
      fuzzyParams: {},
      resetIcon: 'el-icon-refresh',
      dialogVisible: false,
      accessType: '',
      record: {},
      rules: {
        client_id: [{ required: true, validator: verifyID }],
        thing_id: [{ required: true, message: this.$t('Models.isRequired') }],
      },
      ModelData: [],
      connectStatusList: [
        { value: true, label: this.$t('Clients.connected') },
        { value: false, label: this.$t('Clients.disconnected') },
      ],
      activeIndex: null,
    }
  },

  computed: {
    devicePwd() {
      return JSON.parse(localStorage.getItem('devicePwd')) || {}
    },
  },

  watch: {
    tab(val) {
      if (val === 'clients') {
        this.loadModelData()
        this.loadData(this.$route.query.id)
      }
    },
  },

  created() {
    if (this.$route.query.tab === 'clients') {
      this.loadModelData()
      this.loadData(this.$route.query.id)
    }
  },

  methods: {
    showPassword($index) {
      this.activeIndex = this.activeIndex === $index ? null : $index
    },
    copySuccessed() {
      this.$message.success(this.$t('Base.copied'))
    },
    refreshClientId() {
      this.record.client_id = `client:${Math.random().toString(16).substr(2, 8)}`
    },
    async loadModelData() {
      const data = await loadModel(this.$route.query.id)
      this.ModelData = data.items
    },
    showDialog(type) {
      this.accessType = type
      this.record = {
        client_id: `client:${Math.random().toString(16).substr(2, 8)}`,
        user_name: '',
        thing_id: undefined,
      }
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.resetFields()
      }
    },
    save() {
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        record.product_id = parseInt(this.$route.query.id, 10)
        createDevice(record).then(() => {
          this.$message.success(this.$t('Base.createSuccess'))
          this.dialogVisible = false
          this.accessType = ''
          this.loadData()
        })
      })
    },
    resetSearch() {
      this.fuzzyParams = {}
      this.loadData()
    },
    async handleSearch() {
      const params = this.genQueryParams(this.fuzzyParams)
      await queryDevice({ ...params })
        .then((res) => {
          this.tableData = res.items
        })
        .catch()
    },
    genQueryParams(params) {
      let newParams = {}
      const { client_id, user_name, ip_addr, conn_status } = params
      let connStatus = ''
      if (conn_status === true) {
        connStatus = 'true'
      } else if (conn_status === false) {
        connStatus = 'false'
      }
      newParams = {
        client_id: client_id || undefined,
        user_name: user_name || undefined,
        ip_addrf: ip_addr || undefined,
        conn_status: connStatus || undefined,
      }
      return newParams
    },
    async loadData() {
      this.listLoading = true
      await loadDevice(this.$route.query.id)
        .then((res) => {
          this.listLoading = false
          this.tableData = res.items
          this.tableData.forEach((item) => {
            this.ModelData.forEach((one) => {
              if (item.thing_id === one.id) {
                item.thing_name = one.thing_name
              }
            })
          })
        })
        .catch()
    },
  },
}
</script>

<style lang="scss">
.clients {
  .el-select {
    width: 100%;
  }
  .data-list {
    clear: both;
  }
  .app-wrapper {
    padding: 0 !important;
    .add-button {
      margin-bottom: 20px;
    }
    .search-wrapper {
      display: block;
      width: 100%;
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
      }
      .col-oper {
        float: right;
      }
      .el-col-8 {
        margin-bottom: 20px;
      }
      .form-item-row {
        margin-top: 0px;
        .el-select.comparator .el-input__inner {
          border-radius: 4px 0 0 4px;
        }
        .el-date-editor .el-input__inner {
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }
  .el-input_icon {
    font-size: 14px;
    cursor: pointer;
    margin-right: 5px;
  }
  .password-box {
    span {
      display: inline-block;
      width: 110px;
      vertical-align: middle;
    }
    .active-view {
      color: #34c388;
    }
    .el-icon-view,
    .el-icon-document-copy {
      cursor: pointer;
      &:hover {
        color: #34c388;
      }
    }
    .el-icon-document-copy {
      margin-left: 8px;
    }
  }
}
</style>
