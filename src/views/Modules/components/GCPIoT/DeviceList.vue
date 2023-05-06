<template>
  <div class="gcp-device-list">
    <div class="emq-table-header">
      <div class="col-oper">
        <el-row class="search-bar" :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="filterParams.deviceId"
              size="small"
              :placeholder="`TODO:`"
              @keyup.enter.native="initPageNLoad"
            />
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="filterParams.registry"
              size="small"
              :placeholder="`TODO:`"
              @keyup.enter.native="initPageNLoad"
            />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="small" @click="initPageNLoad">
              {{ $t('Base.search') }}
            </el-button>
          </el-col>
        </el-row>
        <div>
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
        <el-table-column prop="topic" :label="$t('Topics.topic')" />
        <el-table-column prop="topic" :label="$t('Topics.topic')" />
        <el-table-column prop="topic" :label="$t('Topics.topic')" />
        <el-table-column width="120px">
          <template slot-scope="{ row }">
            <el-button type="dashed" size="mini" @click="showEdit(row)">
              {{ $t('edit.edit') }}
            </el-button>
            <el-button type="dashed danger" size="mini" @click="handleDelete(row)">
              {{ $t('Base.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { queryDevices, createDevice, deleteDevice } from '@/api/modules.js'

export default {
  name: 'CAConfiguration',
  data() {
    return {
      filterParams: {
        deviceId: '',
        registry: '',
      },
      isListLoading: false,
      deviceList: [],
    }
  },
  methods: {
    async getDeviceList() {
      try {
        this.isListLoading = true
        const { data } = queryDevices()
        debugger
      } catch (error) {
        //
      } finally {
        this.isListLoading = false
      }
    },
    addDevice() {},
    handleChange() {},
    handleError() {},
    showEdit() {},
    handleDelete() {},
  },
  created() {
    this.getDeviceList()
  },
}
</script>
