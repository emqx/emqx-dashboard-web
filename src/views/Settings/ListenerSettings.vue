<template>
  <a-card class="listener-settings emq-list-card">
    <template v-if="!showConfigDetail">
      <div class="emq-table-header">
        <el-button
          class="confirm-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          :disabled="notAbleChange"
          @click="addListener"
        >
          {{ $t('Base.add') }}
        </el-button>
      </div>
      <el-table :data="listeners">
        <el-table-column prop="name" :label="$t('Settings.listenerName')">
          <template slot-scope="{ row }">
            <a @click="editListener(row)">{{ row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="transport_type" :label="$t('Modules.listener_type')"></el-table-column>
        <el-table-column prop="configs.listener" :label="$t('Modules.listen_on')"></el-table-column>
        <el-table-column prop="configs.acceptors" label="Acceptors"></el-table-column>
        <el-table-column :label="$t('Settings.isOpened')">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.enabled"
              active-color="#13ce66"
              inactive-color="#d0d3e0"
              :disabled="notAbleChange"
              @change="updataStatus(...arguments, row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- add or edit -->
    <template v-else>
      <el-row>
        <el-col :span="4">
          <span class="return-button" @click="returnList">
            <i class="el-icon-arrow-left"></i>{{ $t('Settings.returnList') }}
          </span>
        </el-col>
        <el-col v-if="oper === 'edit'" :span="4" :offset="16">
          <el-button type="text" class="delete-button" :disabled="notAbleChange" @click="deleteListener">
            {{ $t('Base.delete') }}
          </el-button>
        </el-col>
      </el-row>

      <config-detail
        :oper="oper"
        :editConfig="editConfig"
        from="listener"
        :listenerType="transport_type"
        :btn-loading="saveLoading"
        :listenerZoneOptions="listenerZoneOptions"
        v-model="disabled"
        @update="handleUpdate(...arguments)"
      >
      </config-detail>
    </template>
  </a-card>
</template>

<script>
import { loadlistenerConfigs, loadZoneConfigs, updateOneConfig, addOneConfig, deleteOneListener } from '@/api/settings'
import ConfigDetail from './components/ConfigDetail'

export default {
  name: 'ListenerSettings',

  components: {
    ConfigDetail,
  },

  data() {
    return {
      listeners: [],
      showConfigDetail: false,
      editConfig: {},
      transport_type: 'tcp',
      editListenerName: '',
      disabled: true,
      listenerZoneOptions: [],
      saveLoading: false,
      oper: 'edit',
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.listeners = await loadlistenerConfigs()
      this.listenerZoneOptions = []
      const zoneResList = await loadZoneConfigs()
      zoneResList.forEach((item) => {
        const oneZoneOption = {
          label: item.name,
          value: item.name,
        }
        this.listenerZoneOptions.push(oneZoneOption)
      })
    },
    sureReturn() {
      this.showConfigDetail = false
      this.loadData()
    },
    async returnList() {
      if (!this.disabled) {
        const status = await this.$confirm(this.$t('Settings.noSaveConfirm'), {
          type: 'warning',
          cancelButtonText: this.$t('Settings.no'),
        })
        if (status === 'confirm') {
          this.sureReturn()
          return true
        }
        return false
      }
      this.sureReturn()
      return true
    },
    addListener() {
      this.oper = 'add'
      this.showConfigDetail = true
      this.transport_type = 'tcp'
      this.editConfig = {}
    },
    editListener(row) {
      this.oper = 'edit'
      this.showConfigDetail = true
      this.editConfig = { ...row.configs }
      this.transport_type = row.transport_type
      this.editListenerName = row.name
    },
    async handleUpdate(name, record, type) {
      this.saveLoading = true
      let data
      const { ...configs } = record
      if (this.oper !== 'add') {
        data = { transport_type: type, configs }
        this.$confirm(this.$t('Settings.confirmUpdateListener'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
          .then(async () => {
            const res = await updateOneConfig('listeners', this.editListenerName, data)
            if (res) {
              this.updataSuccess(name, 'edit')
            }
          })
          .catch(() => {})
      } else {
        data = { name, transport_type: type, configs }
        const res = await addOneConfig('listeners', data)
        if (res) {
          this.updataSuccess(name)
        }
      }
      this.saveLoading = false
    },
    updataSuccess(name) {
      this.loadData()
      this.disabled = true
      if (!name) {
        this.$message.success(this.$t('Base.applySuccess'))
      } else {
        this.$message.success(this.$t('Base.createSuccess'))
      }
      this.showConfigDetail = false
    },
    async updataStatus(val, row) {
      row.enabled = !val
      const { transport_type, enabled } = row
      const data = {
        type: 'listener',
        transport_type,
        enabled: !enabled,
      }
      if (enabled) {
        this.$confirm(`${this.$t('Settings.isStopListener') + row.name}?`, {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
          .then(async () => {
            this.toggleEnabled(row, data)
          })
          .catch(() => {})
      } else {
        this.toggleEnabled(row, data)
      }
    },
    async toggleEnabled(row, data) {
      await updateOneConfig('listeners', row.name, data)
      this.loadData()
    },
    async deleteListener() {
      this.$confirm(this.$t('Settings.isDeleteListener'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          const res = await deleteOneListener(this.editListenerName, this.transport_type)
          if (res) {
            this.$message.success(this.$t('Base.deleteSuccess'))
            this.sureReturn()
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss">
.listener-settings {
  .return-button {
    color: #34c388;
    font-size: 14px;
    cursor: pointer;
    i {
      font-weight: bold;
    }
  }
  .el-col-offset-16 {
    text-align: right;
  }
}
.delete-button {
  display: inline-block;
  color: #ff0000;
  font-size: 14px;
}
</style>
