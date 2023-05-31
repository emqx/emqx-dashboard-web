<template>
  <div class="gcp-iot">
    <div class="gcp-device-list">
      <div class="emq-table-header">
        <div class="col-oper">
          <el-row class="search-bar" :gutter="20">
            <el-col :span="8">
              <el-input
                v-model="filterParams.deviceid"
                size="small"
                :placeholder="$t('Modules.deviceId')"
                @keyup.enter.native="initPageNLoad"
              />
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="filterParams.registry"
                size="small"
                :placeholder="$t('Modules.registry')"
                @keyup.enter.native="initPageNLoad"
              />
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="initPageNLoad">
                {{ $t('Base.search') }}
              </el-button>
            </el-col>
          </el-row>
          <div class="btn-container">
            <el-upload
              ref="upload"
              class="upload-table"
              action="/api"
              accept=".csv,text/csv,application/vnd.ms-excel"
              :limit="1"
              :auto-upload="false"
              :on-change="handleChange"
              :on-error="handleError"
            >
              <el-button slot="trigger" size="small" icon="el-icon-upload2">
                {{ $t('Modules.import') }}
              </el-button>
            </el-upload>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addDevice">
              {{ $t('Base.add') }}
            </el-button>
          </div>
        </div>
      </div>
      <div>
        <el-table :data="deviceList" class="data-list" v-loading="isListLoading">
          <el-table-column prop="deviceid" :label="$t('Modules.deviceId')" />
          <el-table-column prop="registry" :label="$t('Modules.registry')" />
          <el-table-column prop="keys.length" :label="$t('Modules.devicePublicKey')" />
          <el-table-column width="120px">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showEdit(row)">
                {{ $t('Base.edit') }}
              </el-button>
              <el-button type="dashed danger" size="mini" @click="handleDelete(row)">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="emq-table-footer">
          <el-pagination
            v-if="count > 10"
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[20, 50, 100, 500]"
            :page-size.sync="pageParams._limit"
            :current-page.sync="pageParams._page"
            :total="count"
            @size-change="initPageNLoad"
            @current-change="getDeviceList"
          />
          <custom-pagination
            v-if="count === -1 && tableData.length"
            :hasnext="hasnext"
            :page="pageParams._page"
            @prevClick="handlePrevClick"
            @nextClick="handleNextClick"
          />
        </div>
      </div>
    </div>
    <DeviceDialog v-model="isDeviceDialogShow" :edited-device="currentDevice" @submitted="getDeviceList" />
  </div>
</template>

<script>
import { queryDevices, deleteDevice, queryDeviceDetail } from '@/api/modules.js'
import DeviceDialog from './DeviceDialog.vue'

export default {
  name: 'GCPIoT',
  components: {
    DeviceDialog,
  },
  data() {
    return {
      isDeviceDialogShow: false,
      currentDevice: undefined,
      filterParams: {
        deviceid: '',
        registry: '',
      },
      hasnext: false,
      pageParams: {
        _page: 1,
        _limit: 20,
      },
      count: 0,
      isListLoading: false,
      deviceList: [],
    }
  },
  methods: {
    async getDeviceList() {
      try {
        this.isListLoading = true
        if (this.filterParams.deviceid) {
          const data = await queryDeviceDetail(this.filterParams.deviceid)
        }
        const { items, meta } = await queryDevices({ ...this.filterParams, ...this.pageParams })
        this.deviceList = items
        this.count = meta.count
        this.hasnext = meta.hasnext
      } catch (error) {
        //
      } finally {
        this.isListLoading = false
      }
    },
    addDevice() {
      this.currentDevice = undefined
      this.isDeviceDialogShow = true
    },
    initPageNLoad() {
      this.pageParams._page = 1
      this.getDeviceList()
    },
    handleChange() {},
    handleError() {},
    showEdit(device) {
      this.currentDevice = device
      this.isDeviceDialogShow = true
    },
    async handleDelete({ deviceid }) {
      try {
        await this.$msgbox.confirm(this.$t('General.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        await deleteDevice(deviceid)
        this.$message.success(this.$t('Base.deleteSuccess'))
        this.getDeviceList()
      } catch (error) {
        //
      }
    },
  },
  created() {
    this.getDeviceList()
  },
}
</script>

<style lang="scss">
.gcp-iot {
  .col-oper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 13px;
    margin-bottom: 16px;
    .search-bar {
      width: 60%;
      .el-button {
        height: 32px;
      }
    }
  }
  .btn-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .el-upload {
    margin-right: 16px;
  }
}
</style>
