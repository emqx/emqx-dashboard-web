<template>
  <div class="node-basic-card">
    <div class="version-wrapper">
      <img class="logo" src="../../../assets/emqx_logo.png" alt="logo">
      <div class="version">{{ record.version }}</div>
      <div class="jump">
        <el-button v-if="showButton" type="dashed" size="mini" @click="toDetails">{{ $t('Overview.details') }}
        </el-button>
      </div>
    </div>

    <div class="basic-info">
      <div class="title">
        {{ record.sysdescr }}
      </div>

      <el-row :gutter="20">

        <el-col :span="11">

          <ul class="field-info">
            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.systemTime') }}:
              </div>
              <span class="field-value">
                {{ record.datetime }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.uptime') }}:
              </div>
              <span class="field-value">
                {{ record.uptime }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                OTP Release:
              </div>
              <span class="field-value">
                {{ record.otp_release }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.nodeState') }}:
              </div>
              <span class="field-value">
                <a-badge
                  is-dot
                  :status="record.node_status === 'Running' ? 'success' : 'error'"
                  :text="record.node_status === 'Running' ? $t('Overview.running') : $t('Overview.stopped')"
                >
                </a-badge>
              </span>
            </li>


            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.memory') }}:
              </div>
              <span class="field-value">
                {{ record.memory_used }} / {{ record.memory_total }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.maxFds') }}:
              </div>
              <span class="field-value">
                {{ record.max_fds }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                Erlang {{ $t('Overview.process') }}:
              </div>
              <span class="field-value">
                {{ record.process_used }} / {{ record.process_available }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                CPU {{ $t('Overview.load') }}
                <el-popover
                  trigger="hover"
                  content="load1/load4/load15"
                >
                  <i slot="reference" class="el-icon-question"></i>
                </el-popover>
                :
              </div>
              <span class="field-value">
                {{ record.load1 }} / {{ record.load5 }} / {{ record.load15 }}
              </span>
            </li>


          </ul>
        </el-col>

        <el-col :span="2" class="v-line-wrapper">
          <div class="v-line"></div>
        </el-col>

        <el-col :span="11">
          <ul class="field-info stats">
            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.currentConnection') }}:
              </div>
              <span class="field-value">
                {{ record['connections.count'] }} / {{ record['connections.max'] }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.topics') }}:
              </div>
              <span class="field-value">
                {{ record['topics.count'] }} / {{ record['topics.max'] }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.subscription') }}:
              </div>
              <span class="field-value">
                {{ record['subscriptions.count'] }} / {{ record['subscriptions.max'] }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.retained') }}:
              </div>
              <span class="field-value">
                {{ record['retained.count'] }} / {{ record['retained.max'] }}
              </span>
            </li>


            <li class="field-info-item">
              <div class="field-title">
                {{ $t('Overview.shareSubscription') }}:
              </div>
              <span class="field-value">
                {{ record['subscriptions.shared.count'] }} / {{ record['subscriptions.shared.max'] }}
              </span>
            </li>
          </ul>
        </el-col>

      </el-row>
    </div>
  </div>
</template>


<script>
export default {
  name: 'NodeBasicCard',

  components: {},

  props: {
    value: {
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
        'datetime': '2019-07-08 16:27:14',
        'node': 'emqx@127.0.0.1',
        'node_status': 'Running',
        'otp_release': 'R21/10.3.4',
        'sysdescr': 'EMQ X Broker',
        'uptime': '2 days,6 hours, 47 minutes, 50 seconds',
        'version': '0.0.0+build.1.ref6ab9527',
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
        'connections': 77,
        'load1': '9.41',
        'load15': '10.59',
        'load5': '10.77',
        'max_fds': 7168,
        'memory_total': '1.14G',
        'memory_used': '415.58M',
        'name': 'emqx@127.0.0.1',
        'process_available': 2097152,
        'process_used': 538,
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
        path: '/overview/node',
        query: {
          name: this.record.name,
        },
      })
    },
  },
}
</script>


<style lang="scss">
.node-basic-card {
  padding: 16px;
  display: flex;
  align-items: center;

  .field-title {
    width: 110px;
  }

  .field-info {
    &.stats {
      .field-title {
        width: 130px;
      }
    }
  }
  .version-wrapper {
    width: 100px;
    text-align: center;
    word-break: break-word;

    .logo {
      width: 48px;
      height: auto;
    }

    .version {
      margin-top: 12px;
      font-size: 12px;
      color: #34C388;
      line-height: 1.2;
    }

    .jump {
      margin-top: 12px;
    }
  }

  .basic-info {
    flex: 1;
    margin-left: 32px;

    .title {
      font-size: 14px;
      font-weight: bold;
      color: #101010;
    }
  }

  .v-line-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    .v-line {
      width: 1px;
      height: 240px;
      background-color: #d8d8d8;
    }
  }

  .ant-badge {
    margin-top: -3px;

    .ant-badge-status-text {
      color: #101010;
      font-size: 12px;
    }
  }
}
</style>
