<template>
  <div class="topic-metrics">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('Analysis.metricsTip') }}
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <div class="emq-table-header">
          <el-button
            v-if="!modClosed"
            class="confirm-btn"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleOperation"
          >
            {{ $t('Base.create') }}
          </el-button>
          <el-button v-else size="small" class="confirm-btn" type="primary" @click="handleModLoad">
            {{ $t('Analysis.enable') }}
          </el-button>
        </div>

        <el-table
          ref="crudTable"
          :data="topics"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @expand-change="handleExpandChange"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="expand-header">
                {{ $t('Analysis.details') }}
                <el-radio-group v-model="topicQos" :prop="props" class="topic-qos-radio" size="mini">
                  <el-radio-button label="all">{{ $t('Plugins.all') }}</el-radio-button>
                  <el-radio-button label="qos0">QoS 0</el-radio-button>
                  <el-radio-button label="qos1">QoS 1</el-radio-button>
                  <el-radio-button label="qos2">QoS 2</el-radio-button>
                </el-radio-group>
              </div>
              <el-row class="expand-body" :gutter="20">
                <el-col :span="8">
                  <div class="message-card in">
                    <div>
                      {{ $t('Analysis.messageIn') }}
                      <span class="message-rate">
                        {{ $t('Analysis.rateItem', [getCurrentTopicData('in', 'rate')]) }}
                        {{ $t('Analysis.rate') }}
                      </span>
                    </div>
                    <div class="message-card--body">
                      {{ getCurrentTopicData('in', 'count') }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="message-card out">
                    <div>
                      {{ $t('Analysis.messageOut') }}
                      <span class="message-rate">
                        {{ $t('Analysis.rateItem', [getCurrentTopicData('out', 'rate')]) }}
                        {{ $t('Analysis.rate') }}
                      </span>
                    </div>
                    <div class="message-card--body">
                      {{ getCurrentTopicData('out', 'count') }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="message-card drop">
                    <div>
                      {{ $t('Analysis.messageDrop') }}
                      <span class="message-rate">
                        {{ $t('Analysis.rateItem', [getCurrentTopicDropRate(currentTopic['messages.dropped.rate'])]) }}
                        {{ $t('Analysis.rate') }}
                      </span>
                    </div>
                    <div class="message-card--body">
                      {{ currentTopic['messages.dropped.count'] }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="topic" :label="$t('Topics.topic')"></el-table-column>
          <el-table-column prop="messageIn" :label="$t('Analysis.messageIn')"></el-table-column>
          <el-table-column prop="messageOut" :label="$t('Analysis.messageOut')"></el-table-column>
          <el-table-column prop="messageDrop" :label="$t('Analysis.messageDrop')"></el-table-column>
          <el-table-column>
            <template slot-scope="{ row, $index }">
              <el-button size="mini" type="dashed" @click="viewTopicDetails(row, $index)">
                {{ $t('Base.view') }}
              </el-button>
              <el-button type="dashed danger" size="mini" @click="deleteTopicMetric(row)">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>

    <el-dialog
      :title="$t('Analysis.addTopic')"
      width="400px"
      :visible.sync="addVisible"
      class="create-subscribe"
      @keyup.enter.native="handleAdd"
    >
      <el-form ref="record" class="el-form--public" :model="record" :rules="rules" size="small" label-position="top">
        <el-form-item prop="topic" :label="$t('Topics.topic')">
          <el-input v-model="record.topic" placeholder="Topic"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="handleClose">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="handleAdd">{{ $t('Base.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTopicMetrics,
  enableTopicMetrics,
  addTopicMetrics,
  deleteTopicMetrics,
  loadTopicMetrics,
} from '@/api/analysis'

export default {
  name: 'TopicMetrics',

  data() {
    return {
      expands: [],
      addVisible: false,
      popoverVisible: false,
      modClosed: false,
      topicQos: 'all',
      timer: 0,
      listLoading: true,
      topics: [],
      currentExpandRow: {},
      currentTopic: {},
      record: {},
      rules: {
        topic: {
          required: true,
          message: this.$t('Clients.pleaseEnter'),
        },
      },
    }
  },

  watch: {
    currentExpandRow: {
      deep: true,
      handler() {
        clearInterval(this.timer)
      },
    },
  },

  created() {
    this.loadData()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },

  methods: {
    getRowKeys(row) {
      return row.topic
    },
    async loadData() {
      try {
        const res = await listTopicMetrics()
        this.topics = res.map((item) => {
          const { metrics } = item
          return {
            topic: item.topic,
            messageIn: metrics['messages.in.count'],
            messageOut: metrics['messages.out.count'],
            messageDrop: metrics['messages.dropped.count'],
          }
        })
        this.listLoading = false
        this.modClosed = false
      } catch (error) {
        this.listLoading = false
        this.modClosed = true
      }
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    handleOperation() {
      this.addVisible = true
    },
    async handleModLoad() {
      await enableTopicMetrics({ type: 'topic_metrics' })
      this.$message.success(this.$t('Base.enableSuccess'))
      this.loadData()
      this.modClosed = false
    },
    deleteTopicMetric(row) {
      this.$confirm(this.$t('Plugins.confirmDelete'), this.$t('Base.warning'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          await deleteTopicMetrics(row.topic)
          this.loadData()
        })
        .catch(() => {})
    },
    handleAdd() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        const body = {}
        Object.assign(body, this.record)
        await addTopicMetrics(body)
        this.handleClose()
        this.loadData()
      })
    },
    handleClose() {
      this.addVisible = false
      this.$refs.record.resetFields()
    },
    viewTopicDetails(row, index) {
      const elExpand = document.querySelectorAll('.el-table__expand-icon')[index]
      if (elExpand) {
        elExpand.click()
      }
    },
    async loadDetail() {
      const res = await loadTopicMetrics(this.currentTopic.topic)
      this.currentTopic = res
      this.loadData()
    },
    setLoadDetailInterval() {
      this.timer = setInterval(async () => {
        const res = await loadTopicMetrics(this.currentExpandRow.topic)
        if (res) {
          this.currentTopic = res
        }
      }, 10000)
    },
    async handleExpandChange(row, expandedRows) {
      if (!expandedRows.length) {
        this.currentExpandRow = {}
        clearInterval(this.timer)
        return
      }
      this.currentExpandRow = row
      this.currentTopic = {}
      const res = await loadTopicMetrics(row.topic)
      if (res) {
        this.currentTopic = res
        this.$refs.crudTable.store.states.expandRows = expandedRows.length ? [row] : []
        this.loadData()
        this.setLoadDetailInterval()
      }
    },
    getCurrentTopicData(type, analysis) {
      const label = {
        all: 'messages',
        qos0: 'messages.qos0',
        qos1: 'messages.qos1',
        qos2: 'messages.qos2',
      }
      const key = label[this.topicQos]
      const res = this.currentTopic[`${key}.${type}.${analysis}`]
      if (analysis === 'rate' && res) {
        return res.toFixed(2)
      }
      return res
    },
    getCurrentTopicDropRate(rate) {
      if (rate) {
        return rate.toFixed(2)
      }
      return rate
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    next()
  },
}
</script>

<style lang="scss">
.topic-metrics {
  .el-table {
    .expand-header {
      height: 32px;
      line-height: 32px;
      margin-bottom: 20px;
    }
    .topic-qos-radio {
      float: right;
    }
    .message-card {
      height: 112px;
      border-radius: 4px;
      padding: 6px 12px;
      color: #fff;
      &.in {
        background: linear-gradient(0.25turn, #3e3ab4, #4c5ae0);
      }
      &.out {
        background: linear-gradient(0.25turn, #0c7cd1, #19bcc2);
      }
      &.drop {
        background: linear-gradient(0.25turn, #00ac70, #34c388);
      }
      .message-card--body {
        font-size: 28px;
        height: 80px;
        line-height: 80px;
        text-align: center;
      }
      .message-rate {
        float: right;
      }
    }
  }
}
</style>
