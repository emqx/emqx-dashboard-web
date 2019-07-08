<template>
  <div class="node-basic-card">
    <div class="version-wrapper">
      <img class="logo" src="../../../assets/emqx_logo.png" alt="logo">
      <div class="version">{{ record.version }}</div>
      <div class="jump">
        <el-button v-if="showButton" type="dashed" size="mini" @click="toDetails">{{ $t('Overview.details') }}</el-button>
      </div>
    </div>

    <div class="basic-info">
      <div class="title">
        {{ record.sysdescr }}
      </div>
      <el-row :gutter="10">

        <el-col :span="11">
          <ul class="field-info">
            <li class="field-info-item">
              <div class="field-title">
                系统时间:
              </div>
              <span class="field-value">
                {{ record.datetime }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                启动时间:
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
                当前连接:
              </div>
              <span class="field-value">
                {{ record.connections }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                节点状态:
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
          </ul>
        </el-col>

        <el-col :span="2" class="v-line-wrapper">
          <div class="v-line"></div>
        </el-col>

        <el-col :span="11">
          <ul class="field-info">
            <li class="field-info-item">
              <div class="field-title">
                内存:
              </div>
              <span class="field-value">
                {{ record.memory_used }} / {{ record.memory_total }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                最大文件句柄:
              </div>
              <span class="field-value">
                {{ record.max_fds }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                Erlang 进程:
              </div>
              <span class="field-value">
                {{ record.process_used }} / {{ record.process_available }}
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                CPU 负载
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
    return {}
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
    width: 100px;
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
      height: 160px;
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
