<template>
  <div class="app-wrapper subscriptions">
    <el-row class="search-wrapper" :gutter="20">
      <el-col :span="6">
        <el-select v-model="nodeName" :placeholder="$t('Clients.node')" size="small">
          <el-option v-for="item in currentNodes" :value="item.node" :key="item.node"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="fuzzyParams.clientid"
          size="small"
          :placeholder="$t('Clients.clientId')"
        ></el-input>
      </el-col>
      <el-col :span="6" class="form-item-col">
        <el-row class="form-item-row">
          <el-col :span="8">
            <el-select v-model="fuzzyParams.match" class="match" size="small">
              <el-option label="filter" value="_match_topic"></el-option>
              <el-option label="topic" value="topic"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            <el-input v-model="fuzzyParams.topic" type="text" size="small"> </el-input>
          </el-col>
        </el-row>
      </el-col>

      <template v-if="showMoreQuery">
        <el-col :span="6">
          <el-select v-model="fuzzyParams.qos" clearable size="small" placeholder="QoS">
            <el-option :value="0"></el-option>
            <el-option :value="1"></el-option>
            <el-option :value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.share"
            type="text"
            size="small"
            :placeholder="$t('Subs.share')"
          >
          </el-input>
        </el-col>
      </template>
      <el-col class="col-oper" :span="6">
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">
          {{ $t('Clients.search') }}
        </el-button>

        <a href="javascript:;" class="show-more" @click="showMoreQuery = !showMoreQuery">
          <i :class="showMoreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </a>
      </el-col>
    </el-row>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="clientid" sortable :label="$t('Clients.clientId')"></el-table-column>
      <el-table-column prop="topic" :label="$t('Subs.topic')" sortable></el-table-column>
      <el-table-column prop="qos" label="QoS" sortable></el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <el-pagination
        v-if="count > 0"
        layout="total, sizes, prev, pager, next"
        :page-sizes="[20, 50, 100, 500]"
        :page-size.sync="params.limit"
        :current-page.sync="params.page"
        :total="count"
        @size-change="
          () => {
            this.loadNodeSubscriptions(true)
          }
        "
        @current-change="loadNodeSubscriptions"
      >
      </el-pagination>
      <custom-pagination
        v-if="count === -1 && tableData.length"
        :hasnext="hasnext"
        :page="params.page"
        @prevClick="handlePrevClick"
        @nextClick="handleNextClick"
      >
      </custom-pagination>
    </div>
  </div>
</template>

<script>
import CustomPagination from '@/components/CustomPagination.vue'
import { listNodeSubscriptions } from '@/api/subs'
import { loadNodes } from '@/api/common'

export default {
  name: 'Subscriptions',

  components: {
    CustomPagination,
  },

  data() {
    return {
      showMoreQuery: false,
      tableData: [],
      hasnext: false,
      params: {
        page: 1,
        limit: 20,
      },
      count: 0,
      lockTable: true,
      nodeName: '',
      currentNodes: [],
      fuzzyParams: {
        match: '_match_topic',
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async handleSearch() {
      const params = this.genQueryParams(this.fuzzyParams)
      this.count = 0
      this.loadNodeSubscriptions(true, params)
    },
    genQueryParams(params) {
      let newParams = {}
      const { clientid, topic, qos, share, match } = params
      newParams = {
        clientid: clientid || undefined,
        qos: qos === '' ? undefined : qos,
        share: share || undefined,
      }
      if (topic) {
        newParams[match] = topic
      }
      return newParams
    },

    handlePrevClick() {
      if (this.params.page === 1) {
        return
      }
      this.params.page -= 1
      const params = this.genQueryParams(this.fuzzyParams)
      this.loadNodeSubscriptions(false, params)
    },
    handleNextClick() {
      if (!this.hasnext) {
        return
      }
      this.params.page += 1
      const params = this.genQueryParams(this.fuzzyParams)
      this.loadNodeSubscriptions(false, params)
    },
    async loadData() {
      const res = await loadNodes().catch(() => {})
      this.currentNodes = res
      this.loadNodeSubscriptions()
    },
    async loadNodeSubscriptions(reload, params = {}) {
      if (reload) {
        this.params.page = 1
      }
      this.lockTable = true
      const res = await listNodeSubscriptions(this.nodeName, {
        ...this.params,
        ...params,
      }).catch(() => {})

      if (res) {
        const {
          data,
          meta: { count = 0, hasnext = false },
        } = res
        this.tableData = data
        this.count = count
        this.hasnext = hasnext
      }

      this.lockTable = false
    },
  },
}
</script>

<style lang="scss" scoped>
.show-more {
  margin-left: 12px;
}
</style>
