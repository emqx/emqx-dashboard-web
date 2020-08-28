<template>
  <div class="clients">
    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <el-button type="primary" icon="el-icon-plus" size="small" class="add-button" @click="showDialog('create')">
          {{ $t('Base.create') }}
        </el-button>
        <div class="emq-table-header">
          <el-row class="search-wrapper" :gutter="20">
            <el-col :span="8">
              <el-input v-model="fuzzyParams.user_name" size="small" :placeholder="$t('Clients.username')"></el-input>
            </el-col>
            <el-col :span="8">
              <el-input v-model="fuzzyParams.client_id" size="small" :placeholder="$t('Clients.clientId')"></el-input>
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
              <span class="btn" @click="showDialog('view', row)">{{ row.client_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" min-width="120px" :label="$t('Clients.username')"> </el-table-column>
          <el-table-column prop="thing_id" min-width="120px" :label="$t('Clients.modelId')"> </el-table-column>
        </el-table>
      </a-card>
    </div>

    <el-dialog
      width="600px"
      :title="accessType === 'view' ? $t('Clients.viewEquipment') : $t('Clients.createEquipment')"
      :visible.sync="dialogVisible"
      @close="clearInput"
    >
      <el-form ref="recordForm" size="small" :model="record" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="client_id" :label="$t('Clients.clientId')">
              <el-input v-model="record.client_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="user_name" :label="$t('Clients.username')">
              <el-input v-model="record.user_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="thing_id" :label="$t('Models.modelName')">
              <el-select v-model="record.thing_id">
                <el-option v-for="(item, index) in ModelData" :key="index" :value="item.id" :label="item.thing_name">
                </el-option>
              </el-select>
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
import { createDevice, loadDevice, queryDevice } from '@/api/devices'
import { loadModel } from '@/api/models'

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
        client_id: [{ required: true, message: this.$t('Models.isRequired') }],
        thing_id: [{ required: true, message: this.$t('Models.isRequired') }],
      },
      ModelData: [],
    }
  },

  watch: {
    tab(val) {
      if (val === 'clients') {
        this.loadData(this.$route.query.id)
      }
    },
  },

  methods: {
    async loadModelData() {
      const data = await loadModel(this.$route.query.id)
      this.ModelData = data.items
    },
    showDialog(type, item) {
      this.loadModelData()
      this.accessType = type
      if (type === 'view') {
        Object.assign(this.record, item)
        this.accessType = 'view'
      } else {
        this.record = {
          client_id: Math.random().toString(16).slice(3),
          user_name: '',
          thing_id: undefined,
        }
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
      const { client_id, user_name } = params
      newParams = {
        client_id: client_id || undefined,
        user_name: user_name || undefined,
      }
      return newParams
    },
    async loadData() {
      this.listLoading = true
      await loadDevice(this.$route.query.id)
        .then((res) => {
          this.listLoading = false
          this.tableData = res.items
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
}
</style>
