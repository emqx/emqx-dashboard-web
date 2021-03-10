<template>
  <div class="subscriptions">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('Subs.currentSubs') }}
          <emq-select
            v-model="nodeName"
            class="node-select"
            size="small"
            :field="{ options: currentNodes }"
            :field-name="{ label: 'name', value: 'node' }"
            @change="handleNodeChange"
          ></emq-select>
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <div class="emq-table-header">
          <el-row class="search-wrapper" :gutter="20">
            <el-col :span="8">
              <el-input v-model="fuzzyParams.clientid" size="small" :placeholder="$t('Clients.clientId')"></el-input>
            </el-col>
            <el-col :span="8" class="form-item-col">
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
              <el-col :span="8">
                <el-select v-model="fuzzyParams.qos" clearable size="small" placeholder="QoS">
                  <el-option :value="0"></el-option>
                  <el-option :value="1"></el-option>
                  <el-option :value="2"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input v-model="fuzzyParams.share" type="text" size="small" :placeholder="$t('Subs.share')">
                </el-input>
              </el-col>
            </template>
            <div class="col-oper">
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">
                {{ $t('Clients.search') }}
              </el-button>
              <el-button plain size="small" :icon="resetIcon" @click="resetSearch">
                {{ $t('Clients.reset') }}
              </el-button>
              <a href="javascript:;" class="show-more" @click="showMoreQuery = !showMoreQuery">
                {{ showMoreQuery ? $t('Clients.collapse') : $t('Clients.expand') }}
                <i :class="showMoreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </a>
            </div>
          </el-row>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="clientid" min-width="130px" :label="$t('Clients.clientId')"></el-table-column>
          <el-table-column prop="topic" :label="$t('Subs.topic')"></el-table-column>
          <el-table-column prop="qos" label="QoS"></el-table-column>
        </el-table>

        <div class="emq-table-footer">
          <el-pagination
            v-if="count > 10"
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[20, 50, 100, 500]"
            :page-size.sync="params._limit"
            :current-page.sync="params._page"
            :total="count"
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
          >
          </el-pagination>
          <custom-pagination
            v-if="count === -1 && tableData.length"
            :hasnext="hasnext"
            :page="params._page"
            @prevClick="handlePrevClick"
            @nextClick="handleNextClick"
          >
          </custom-pagination>
        </div>
      </a-card>
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
      listLoading: true,
      showMoreQuery: false,
      tableData: [],
      hasnext: false,
      params: {
        _page: 1,
        _limit: 20,
      },
      count: 0,
      nodeName: '',
      currentNodes: [{ name: this.$t('RuleEngine.allNodes'), node: 'all' }],
      resetIcon: 'el-icon-refresh',
      fuzzyParams: {
        match: '_match_topic',
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    handleNodeChange() {
      this.loadNodeSubscriptions(true)
    },
    resetSearch() {
      this.resetIcon = 'el-icon-loading'
      this.fuzzyParams = {
        match: '_match_topic',
      }
      this.loadNodeSubscriptions(true)
    },
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
    handleSizeChange() {
      this.loadNodeSubscriptions(true)
    },
    handleCurrentPageChange() {
      this.loadNodeSubscriptions()
    },
    handlePrevClick() {
      if (this.params._page === 1) {
        return
      }
      this.params._page -= 1
      const params = this.genQueryParams(this.fuzzyParams)
      this.loadNodeSubscriptions(false, params)
    },
    handleNextClick() {
      if (!this.hasnext) {
        return
      }
      this.params._page += 1
      const params = this.genQueryParams(this.fuzzyParams)
      this.loadNodeSubscriptions(false, params)
    },
    async loadData() {
      const data = await loadNodes()
      this.currentNodes = this.currentNodes.concat(data)
      this.nodeName = this.nodeName || (this.currentNodes[0] || {}).node
      this.listLoading = false
      this.loadNodeSubscriptions()
    },
    async loadNodeSubscriptions(reload, params = {}) {
      if (reload) {
        this.params._page = 1
      }
      const data = await listNodeSubscriptions(this.nodeName, { ...this.params, ...params })
      const {
        items = [],
        meta: { count = 0, hasnext = false },
      } = data
      this.tableData = items
      this.count = count
      this.hasnext = hasnext
      this.resetIcon = 'el-icon-refresh'
    },
  },
}
</script>

<style lang="scss">
.subscriptions {
  .data-list {
    clear: both;
  }
  .page-header-content-view {
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .app-wrapper {
    .search-wrapper {
      display: block;
      width: 100%;
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner,
      .el-select {
        width: 100%;
      }
      .col-oper {
        float: right;
      }
      .show-more {
        margin-left: 12px;
      }
      .el-col-8 {
        margin-bottom: 20px;
        &.form-item-col {
          margin-bottom: 0px;
        }
      }
      .form-item-row {
        margin-top: 0px;
        .el-select.match .el-input__inner {
          border-radius: 4px 0 0 4px;
        }
        .el-input .el-input__inner {
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }
}
</style>
