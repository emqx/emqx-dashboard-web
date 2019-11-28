<template>
  <div class="node">
    <page-header>
      <div class="page-header-title-view">
        <div class="title">{{ name }}</div>
      </div>

      <div class="page-header-content-view">
        <div class="content">
          <p class="description">
            {{ $t('Overview.currentNodeInfo') }}
          </p>
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">

        <el-tab-pane :label="$t('Overview.basicInfo')" name="basic">
          <div class="card-wrapper">
            <a-card class="emq-list-card">
              <div class="emq-title">{{ $t('Overview.basic') }}</div>
              <node-basic-card :value="record" :show-button="false"></node-basic-card>
            </a-card>

            <a-card class="emq-list-card">
              <div class="emq-title">
                {{ $t('Overview.listener') }}
                <div class="sub-title">
                  {{ $t('Overview.ListeningPorts') }}
                </div>
              </div>

              <el-table :data="listeners">
                <el-table-column prop="protocol" min-width="100px" :label="$t('Overview.listenerProtocol')"></el-table-column>
                <el-table-column prop="listen_on" min-width="80px" :label="$t('Overview.listenerAddress')"></el-table-column>
                <el-table-column prop="acceptors" min-width="60px" label="Acceptors"></el-table-column>
                <el-table-column prop="current_conns" min-width="120px" :label="$t('Overview.connectCurrentAndMax')">
                  <template slot-scope="{ row }">
                    {{ row.current_conns }}/{{ row.max_conns }}
                  </template>
                </el-table-column>
              </el-table>

            </a-card>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="$t('Overview.metric')" name="metrics">
          <div class="card-wrapper">

            <a-card class="emq-list-card">
              <div class="emq-title">
                {{ $t('Overview.dataList') }}
                <div class="sub-title">
                  {{ $t('Overview.packetStatisticsOfNodes') }}
                </div>
              </div>

              <el-row :gutter="30">
                <el-col :span="8">
                  <el-table :data="metricsData.packets">
                    <el-table-column prop="key" :label="$t('Overview.mqttPackages')" min-width="100px"></el-table-column>
                    <el-table-column prop="value" label="" width="120px" sortable></el-table-column>
                  </el-table>
                </el-col>

                <el-col :span="8">
                  <el-table :data="metricsData.messages">
                    <el-table-column prop="key" :label="$t('Overview.messageNumber')" min-width="100px"></el-table-column>
                    <el-table-column prop="value" label="" width="120px" sortable></el-table-column>
                  </el-table>
                </el-col>

                <el-col :span="8">
                  <el-table :data="metricsData.bytes">
                    <el-table-column prop="key" :label="$t('Overview.traffic')" min-width="100px"></el-table-column>
                    <el-table-column prop="value" label="" width="120px" sortable></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </a-card>
          </div>
        </el-tab-pane>

      </el-tabs>

    </div>
  </div>
</template>


<script>
import {
  loadNodeDetail, loadListeners, loadMetrics,
} from '@/api/overview'

import NodeBasicCard from './components/NodeBasicCard'

export default {
  name: 'Node',

  components: { NodeBasicCard },

  props: {},

  data() {
    return {
      activeName: 'basic',
      record: {},
      metrics: {},
      listeners: [],
    }
  },

  computed: {
    name() {
      return this.$route.query.name
    },
    metricsData() {
      const metrics = this.metrics || {}
      const data = Object.entries(metrics)
      if (data.length === 0) {
        return {
          packets: [],
          messages: [],
          bytes: [],
        }
      }

      const indexTable = {
        packets: ['received', 'sent', 'connect', 'connack', 'auth', 'disconnect.sent', 'disconnect.received', 'pingreq', 'pingresp', 'publish.received', 'publish.sent', 'puback.received', 'puback.sent', 'puback.missed', 'pubcomp.received', 'pubcomp.sent', 'pubcomp.missed', 'pubrec.received', 'pubrec.sent', 'pubrec.missed', 'pubrel.received', 'pubrel.sent', 'pubrel.missed', 'subscribe', 'suback', 'unsubscribe', 'unsuback'],
        messages: ['received', 'sent', 'dropped', 'retained', 'qos0.received', 'qos0.sent', 'qos1.received', 'qos1.sent', 'qos2.received', 'qos2.expired', 'qos2.sent', 'qos2.dropped'],
        bytes: ['received', 'sent'],
      }
      const dataMap = {
        packets: {},
        messages: {},
        bytes: {},
      }
      data.forEach((item) => {
        const [_key, value] = item
        const primaryKey = _key.split('.').shift()
        const valueKey = _key.replace(`${primaryKey}.`, '')
        dataMap[primaryKey] = dataMap[primaryKey] || {}
        dataMap[primaryKey][valueKey] = value
      })

      function magicMap(key) {
        const list = []
        indexTable[key].forEach((k) => {
          const v = dataMap[key][k]
          if (v) {
            list.push({
              key: k,
              value: v,
            })
            delete dataMap[key][k]
          }
        })
        // eslint-disable-next-line
        const otherList = Object.entries(dataMap[key]).map(([key, value]) => ({ key, value }))
        return [...list, ...otherList]
      }

      return {
        packets: magicMap('packets'),
        messages: magicMap('messages'),
        bytes: magicMap('bytes'),
      }
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    handleTabClick() {},
    async loadData() {
      this.record = await loadNodeDetail(this.name)
      this.metrics = await loadMetrics(this.name)
      this.listeners = await loadListeners(this.name)
    },
  },
}
</script>


<style lang="scss">
.node {
  .emq-title {
    margin-bottom: 40px;
  }

  .page-header-footer {
    position: absolute;
    bottom: -14px;

    .el-tabs__item {
      font-weight: normal;

      &.is-active {
        font-weight: 500;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }

  .card-wrapper {
    .emq-list-card {
      margin-bottom: 24px;
    }
  }
}
</style>
