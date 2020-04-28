<template>
  <div class="node-basic-card">
    <div class="version-wrapper">
      <div class="version-title">
        {{ $t('Overview.version') }}: {{ record.version }}
      </div>
    </div>

    <div class="basic-info">
      <el-row>
        <el-form
          class="node-form"
          label-suffix=":"
          label-position="left"
          label-width="150px"
        >
          <el-col :span="12">
            <el-form-item :label="$t('Overview.systemTime')">
              <span class="form-item-value">{{ record.datetime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Overview.memory')">
              <span class="form-item-value">
                {{ record.memory_used | formatMemory }} / {{ record.memory_total | formatMemory }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Overview.uptime')">
              <span class="form-item-value">{{ record.uptime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Overview.maxFds')">
              <span class="form-item-value">{{ record.max_fds }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="OTP Release">
              <span class="form-item-value">{{ record.otp_release }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`Erlang ${$t('Overview.process')}`">
              <span class="form-item-value">{{ record.process_used }} / {{ record.process_available }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Overview.nodeState')">
              <span class="form-item-value">
                <a-badge
                  is-dot
                  :status="record.node_status === 'Running' ? 'success' : 'error'"
                  :text="record.node_status === 'Running' ? $t('Overview.running') : $t('Overview.stopped')"
                >
                </a-badge>
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`CPU ${$t('Overview.load')}`">
              <span class="form-item-value">
                {{ record.load1 }} / {{ record.load5 }} / {{ record.load15 }}
              </span>
              <el-popover
                trigger="hover"
                content="load1/load5/load15"
              >
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Overview.currentConnection')">
              <span class="form-item-value">
                {{ record['connections.count'] }} / {{ record['connections.max'] }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Overview.topics')">
              <span class="form-item-value">
                {{ record['topics.count'] }} / {{ record['topics.max'] }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Overview.subscription')">
              <span class="form-item-value">
                {{ record['subscriptions.count'] }} / {{ record['subscriptions.max'] }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Overview.retained')">
              <span class="form-item-value">
                {{ record['retained.count'] }} / {{ record['retained.max'] }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Overview.shareSubscription')">
              <span class="form-item-value">
                {{ record['subscriptions.shared.count'] }} / {{ record['subscriptions.shared.max'] }}
              </span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <el-button
        v-if="showButton"
        class="form-btn"
        type="primary"
        size="small"
        @click="toDetails"
      >
        {{ $t('Overview.viewMore') }}
      </el-button>
    </div>
  </div>
</template>


<script>
import { formatNumberSize } from '@/common/utils'

export default {
  name: 'NodeBasicCard',

  components: {},

  filters: {
    formatMemory(val) {
      if (typeof val === 'number') {
        return formatNumberSize(val)
      }
      return val
    },
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    showButton: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      data: {
        datetime: '2019-07-08 16:27:14',
        node: 'emqx@127.0.0.1',
        node_status: 'Running',
        otp_release: 'R21/10.3.4',
        sysdescr: 'EMQ X Broker',
        uptime: '2 days,6 hours, 47 minutes, 50 seconds',
        version: '0.0.0+build.1.ref6ab9527',
        'subscriptions.shared.max': 0,
        'subscriptions.max': 102,
        'subscribers.max': 102,
        'resources.max': 2,
        'topics.count': 1,
        'subscriptions.count': 62,
        'suboptions.max': 102,
        'topics.max': 2,
        'sessions.persistent.max': 0,
        'connections.max': 102,
        'sessions.persistent.count': 0,
        'actions.count': 17,
        'retained.count': 4,
        'rules.count': 1,
        'routes.count': 1,
        'subscriptions.shared.count': 0,
        'suboptions.count': 62,
        'sessions.count': 62,
        'actions.max': 17,
        'retained.max': 4,
        'sessions.max': 102,
        'rules.max': 1,
        'routes.max': 2,
        'resources.count': 2,
        'subscribers.count': 62,
        'connections.count': 62,
        connections: 77,
        load1: '9.41',
        load15: '10.59',
        load5: '10.77',
        max_fds: 7168,
        memory_total: '1.14G',
        memory_used: '415.58M',
        name: 'emqx@127.0.0.1',
        process_available: 2097152,
        process_used: 538,
      },
    }
  },

  computed: {
    record() {
      return this.value
    },
  },

  created() {},

  methods: {
    toDetails() {
      this.$router.push({
        path: '/monitor/node',
        query: {
          name: this.record.node,
        },
      })
    },
  },
}
</script>


<style lang="scss">
.node-basic-card {
  padding: 10px;

  .field-info {
    &.stats {
      .field-title {
        width: 130px;
      }
    }
  }

  .version-wrapper {
    width: 100%;
    padding: 8px 16px;
    border-radius: 2px;
    background: #F8F8F8;
    font-size: 14px;
    .version-title {
      color: #333333;
      font-weight: bolder;
    }
  }

  .basic-info {
    margin-top: 20px;
    padding: 0px 16px;
    .node-form {
      .el-form-item {
        margin-bottom: -6px;
      }
      .el-form-item__label {
        color: #666;
      }
      .form-item-value {
        color: #333;
      }
    }
    .form-btn {
      margin-top: 20px;
      width: 120px;
    }
    .ant-badge {
      margin-top: -3px;
      .ant-badge-status-text {
        font-size: 14px;
      }
      .ant-badge-status-dot {
        width: 8px;
        height: 8px;
      }
    }
    .el-icon-question {
      margin-left: 6px;
    }
  }
}
</style>
