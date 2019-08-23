<template>
  <div class="websocket-item">
    <el-card class="emq-list-card">
      <div class="websocket-config">

        <div class="emq-title">
          {{ $t('Tools.connectionConfiguration') }}
        </div>

        <el-form
          ref="configForm"
          hide-required-asterisk
          size="small"
          label-position="top"
          :model="connection"
          :rules="connectionRules"
          @keyup.enter.native="createConnection"
        >

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="host" :label="$t('Tools.host')">
                <el-input v-model="connection.host" :readonly="client.connected"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="port" :label="$t('Tools.port')">
                <el-input v-model.number="connection.port" type="number" placeholder="8083/8084"
                          :readonly="client.connected"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="endpoint" :label="$t('Tools.mountPoint')">
                <el-input v-model="connection.endpoint" placeholder="/mqtt" :readonly="client.connected"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">

              <el-form-item prop="clientId" label="Client ID">
                <el-input v-model="connection.clientId" :readonly="client.connected">
                  <i slot="suffix" :title="$t('Tools.randomGeneration')" :disabled="client.connected"
                     class="el-icon-refresh el-input_icon" @click="refreshClientId"
                  ></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">

              <el-form-item prop="username" label="Username">
                <el-input v-model="connection.username" :readonly="client.connected"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">

              <el-form-item prop="password" label="Password">
                <el-input v-model="connection.password" :readonly="client.connected"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">

              <el-form-item prop="keepalive" label="Keepalive">
                <el-input v-model.number="connection.keepalive" :readonly="client.connected" type="number"
                          placeholder="60"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="footer-area">
              <el-checkbox v-model="connection.clean" :disabled="client.connected">
                Clean Session
              </el-checkbox>

              <el-checkbox v-model="connection.ssl" :disabled="client.connected" @change="protocolsChange">
                SSL
              </el-checkbox>

            </el-col>

            <el-col :span="24" class="footer-area">
              <el-button
                type="primary"
                size="small"
                class="conn-btn"
                style="margin-right: 20px"
                :disabled="client.connected || connecting"
                @click="createConnection"
              >
                {{ client.connected ? $t('Tools.connected') : connecting ? $t('Tools.inConnection') :
                  $t('Tools.connect') }}
              </el-button>

              <el-button
                type="danger"
                size="small"
                class="conn-btn"
                :disabled="!client.connected && !connecting"
                @click="destroyConnection"
              >
                {{ connecting ? $t('Tools.cancelConnection') : $t('Tools.disconnect') }}
              </el-button>
            </el-col>

          </el-row>

        </el-form>
      </div>
    </el-card>

    <el-card class="emq-list-card">
      <div class="emq-title">
        {{ $t('Tools.Subscription') }}
      </div>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form
            ref="subForm"
            hide-required-asterisk
            :model="subscriptionsRecord"
            :rules="subscriptionsRules"
            size="small"
            label-position="top"
            @keyup.enter.native="_doSubscribe"
          >
            <el-form-item prop="topic" label="Topic">
              <el-input v-model="subscriptionsRecord.topic"></el-input>
            </el-form-item>

            <el-form-item prop="qos" label="QoS">
              <emq-select v-model.number="subscriptionsRecord.qos" :field="{ list: [0, 1, 2] }"></emq-select>
            </el-form-item>
            <div>
              <el-form-item>
                <el-button type="primary" size="small" class="conn-btn" @click="_doSubscribe">
                  {{ $t('Tools.Subscribe') }}
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-col>

        <el-col :span="12">
          <el-table :data="subscriptions" max-height="400px" style="margin-top: 10px;">
            <el-table-column show-overflow-tooltip prop="topic" label="Topic" min-width="180px"></el-table-column>
            <el-table-column prop="qos" label="QoS" width="80px"></el-table-column>
            <el-table-column prop="createAt" :label="$t('Tools.time')"></el-table-column>
            <el-table-column width="80px">
              <template slot-scope="{ row }">
                <a class="btn" @click="_doUnSubscribe(row)">{{ $t('Base.cancel') }}</a>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

      </el-row>
    </el-card>

    <el-card class="emq-list-card">
      <div class="emq-title">
        {{ $t('Tools.publish') }}
      </div>

      <div class="connection-wrapper">
        <el-form
          ref="pubForm"
          hide-required-asterisk label-position="top"
          :model="messageRecord"
          :rules="messageRecordRules"
          size="small"
          @keyup.enter.native="_doPublish"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item prop="topic" label="Topic">
                <el-input v-model="messageRecord.topic" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="payload" label="Payload">
                <el-input v-model="messageRecord.payload" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="qos" label="QoS">
                <emq-select v-model.number="messageRecord.qos" :field="{ list: [0, 1, 2] }" size="small">
                </emq-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <span slot="label">&nbsp;</span>
                <el-checkbox v-model="messageRecord.retain" style="margin-right: 20px">Retain</el-checkbox>
                <el-button type="primary" size="small" class="conn-btn" style="float: right" @click="_doPublish">
                  {{ $t('Tools.publish') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </div>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="message-btn">
            {{ $t('Tools.received') }}
            <i class="icon el-icon-refresh" :title="$t('Tools.clear')" @click="messageIn = []"></i>
          </div>
          <el-table class="list-table" :data="messageIn" max-height="400px" style="margin-top: 10px;">
            <el-table-column show-overflow-tooltip prop="topic" label="Topic" min-width="120px"></el-table-column>
            <el-table-column prop="qos" label="QoS" width="80px">
              <template slot-scope="{ row }">
                {{ row.qos }} {{ row.retain ? ' Retain' : '' }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="payload" label="Payload" min-width="180px">
              <template slot-scope="{ row }">
                <code>{{ row.payload }}</code>
              </template>
            </el-table-column>
            <el-table-column prop="createAt" :label="$t('Tools.time')"></el-table-column>
          </el-table>
        </el-col>

        <el-col :span="12">
          <div class="message-btn">
            {{ $t('Tools.published') }}
            <i class="icon el-icon-refresh" :title="$t('Tools.clear')" @click="messageOut = []"></i>
          </div>
          <el-table class="list-table" :data="messageOut" max-height="400px" style="margin-top: 10px;">
            <el-table-column show-overflow-tooltip prop="topic" label="Topic" min-width="120px"></el-table-column>
            <el-table-column prop="qos" label="QoS" width="80px">
              <template slot-scope="{ row }">
                {{ row.qos }} {{ row.retain ? ' Retain' : '' }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="payload" label="Payload" min-width="180px">
              <template slot-scope="{ row }">
                <code>{{ row.payload }}</code>
              </template>
            </el-table-column>
            <el-table-column prop="createAt" :label="$t('Tools.time')"></el-table-column>
          </el-table>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>


<script>
import mqtt from 'mqtt'
import moment from 'moment'

export default {
  name: 'WebSocketItem',

  components: {},

  props: {
    messageCount: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      times: 0,
      maxTims: 4,
      connecting: false,
      messageRecordRules: {
        topic: { required: true, message: this.$t('Tools.pleaseEnter') },
      },
      stateIcon: {
        0: 'el-icon-message',
        1: 'el-icon-loading',
        3: 'el-icon-warning',
      },
      connectionRules: {
        host: { required: true },
        port: [{ type: 'number', required: true, message: this.$t('Tools.pleaseEnter') }, {
          type: 'number',
          min: 1,
          max: 65535,
          message: this.$t('Tools.rangeError'),
        }],
        keepalive: [{ type: 'number', required: true, message: this.$t('Tools.pleaseEnter') }, {
          type: 'number',
          min: 0,
          message: this.$t('Tools.rangeError'),
        }],
      },
      subscriptionsRules: {
        topic: [{ required: true, message: this.$t('Tools.pleaseEnter') }],
      },
      client: {
        reconnecting: false,
      },
      connection: {
        host: this.getOption().host,
        port: this.getOption().port,
        protocols: this.getOption().protocols,
        clientId: this.getOption().clientId,
        ssl: false,

        endpoint: '/mqtt',
        username: '',
        password: '',
        keepalive: 60,
        clean: true,
        reconnectPeriod: 4000,
        connectTimeout: 4000,

        will: {
          topic: '',
          payload: '',
          qos: 0,
          retain: false,
        },
      },
      messageRecord: {
        topic: 'testtopic/1',
        qos: 0,
        payload: '{ "msg": "hello" }',
        retain: false,
      },
      subscriptionsRecord: {
        topic: 'testtopic/#',
        qos: 0,
      },

      subscriptions: [],

      messageIn: [],
      messageOut: [],

      activeIndex: '0',
      sessions: [],
    }
  },

  computed: {
    btnStatusText() {
      let text = this.$t('Tools.connect')
      if (this.client.connected) {
        text = this.$t('Tools.disconnect')
      } else if (this.client.connecting) {
        text = this.$t('Tools.inConnection')
      }
      return text
    },
    connectUrl() {
      const {
        host, port, ssl, endpoint,
      } = this.connection
      const protocol = ssl ? 'wss://' : 'ws://'
      return `${protocol}${host}:${port}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
    },
  },

  beforeDestroy() {
    this.destroyConnection()
  },

  methods: {
    addMessages(msg, content) {
      const messageLimit = 5000
      this[msg].unshift(content)
      if (this[msg].length > messageLimit) {
        this[msg].pop()
      }
    },
    getNow() {
      return moment().format('HH:mm:ss')
    },
    onMessage(topic, payload, packet = {}) {
      const message = {
        out: false,
        createAt: this.getNow(),
        topic,
        payload: payload.toString(),
        qos: packet.qos,
        retain: packet.retain,
      }
      this.addMessages('messageIn', message)
      let { messageCount } = this
      this.$emit('update:messageCount', messageCount += 1)
    },
    handleConnect() {
      if (this.client.connected) {
        this.client.end()
      } else {
        this.createConnection()
      }
    },
    destroyConnection() {
      if (this.client.connected || this.connecting) {
        try {
          this.connecting = false
          this.times = 0
          this.client.end()
        } catch (e) {
          console.log(e)
        }
      }
    },
    _doUnSubscribe(item) {
      if (!this.client.connected) {
        this.$message.error(this.$t('Tools.clientNotConnected'))
        return
      }
      this.client.unsubscribe(item.topic, (error) => {
        if (error) {
          return
        }
        this.subscriptions = this.subscriptions.filter($ => $.topic !== item.topic)
      })
    },
    async _doSubscribe() {
      const valid = await this.$refs.subForm.validate()
      if (!valid) {
        return
      }
      if (!this.client.connected) {
        this.$message.error(this.$t('Tools.clientNotConnected'))
        return
      }
      const { topic, qos } = this.subscriptionsRecord
      this.client.subscribe(topic, { qos }, (err, res) => {
        // 是否超过最大订阅数
        let isMoreMaxSubs = false
        res.forEach((item) => {
          if (![0, 1, 2].includes(item.qos)) {
            isMoreMaxSubs = true
          }
        })
        if (err || isMoreMaxSubs) {
          this.$message.error(this.$t('Tools.subscriptionFailure'))
          return
        }
        if (this.subscriptions.find($ => $.topic === topic)) {
          return
        }
        this.subscriptions.unshift({
          topic,
          qos,
          createAt: this.getNow(),
        })
      })
    },
    async _doPublish() {
      const valid = await this.$refs.pubForm.validate()
      if (!valid) {
        return
      }
      if (!this.client.connected) {
        this.$message.error(this.$t('Tools.clientNotConnected'))
        return
      }
      const {
        topic, qos, payload, retain,
      } = this.messageRecord
      this.client.publish(topic, payload, {
        qos, retain,
      }, (err) => {
        if (err) {
          this.$message.error(this.$t('Tools.publishingFailure'))
          return
        }
        const message = {
          out: true,
          createAt: this.getNow(),
          topic,
          payload,
          qos,
          retain,
        }
        this.addMessages('messageOut', message)
      })
    },
    _getDefaultConnection() {
      return {
        ...this.getOption(),

        endpoint: '/mqtt',
        username: '',
        password: '',
        keepalive: 60,
        clean: true,
        reconnectPeriod: 4000,
        connectTimeout: 4000,

        will: {
          topic: '',
          payload: '',
          qos: 0,
          retain: false,
        },
      }
    },
    protocolsChange() {
      const { port, ssl } = this.connection
      if (!ssl && port === 8084) {
        this.connection.port = 8083
      } else if (ssl && port === 8083) {
        this.connection.port = 8084
      }
    },
    refreshClientId() {
      if (this.client.connected) {
        return
      }
      this.connection.clientId = this.getOption().clientId
    },
    createConnection() {
      if (this.client.connected) {
        this.connecting = false
        this.times = 0
        return
      }
      this.$refs.configForm.validate((valid) => {
        if (!valid) {
          return
        }
        const {
          clientId, username, port,
          password, reconnectPeriod, keepalive, clean, connectTimeout, will,
        } = this.connection

        this.connecting = true
        this.times = 0
        this.client = mqtt.connect(this.connectUrl, {
          port,
          clientId,
          username,
          password,
          reconnectPeriod,
          keepalive,
          clean,
          connectTimeout,
          will: will.topic ? will : undefined,
        })
        window.client = this.client
        this.client.on('error', (error) => {
          this.$message.error(error.toString())
          this.connecting = false
          try {
            this.client.end()
          } catch (e) {
            console.log(e)
          }
        })
        this.client.on('reconnect', () => {
          if (this.times > this.maxTims) {
            this.destroyConnection()
            this.$message.error(this.$t('Tools.connectionDisconnected'))
          }
          if (this.connecting) {
            this.times += 1
          }
        })

        this.client.on('connect', () => {
          this.connecting = false
        })
        this.client.on('message', this.onMessage)
        this.client.on('reconnection', this.onMessage)
      })
    },
    getOption() {
      return {
        host: window.location.hostname,
        protocols: window.location.protocol === 'http:' ? 'ws' : 'wss',
        port: window.location.protocol === 'http:' ? 8083 : 8084,
        clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
      }
    },
    atSessionChange(i) {
      this.activeIndex = i
      const session = this.sessions[i]
      if (!session) {
        return
      }

      this.client = session.client || {}
      this.connection = session.connection || {}
      this.messageRecord = session.messageRecord || {}
      this.subscriptionsRecord = session.subscriptionsRecord || {}

      this.subscriptions = session.subscriptions || []
    },
    sessionChange(i) {
      this.activeIndex = i
    },
  },
}
</script>


<style lang="scss">
.websocket-item {
  .el-form-item {
    .el-form-item__label {
      padding: 0;
    }
  }

  .el-row {
    .el-input,
    .emq-select {
      width: 100%;
    }
  }

  .emq-list-card {
    border-radius: 2px;
    box-shadow: none;
    .el-card__body {
      padding: 24px 32px;
    }
  }

  .websocket-header {
    background-color: #fff;
  }

  .session-item {
    margin-right: 12px;
  }

  .session-btn {
    float: right;
  }

  .connection-wrapper {
    .el-form-item {
      .el-form-item__label {
        padding: 0;
      }
    }
  }

  .conn-btn {
    min-width: 90px;
  }

  .el-input_icon {
    cursor: pointer;
  }

  .emq-title {
    margin-bottom: 24px;
  }

  .line {
    background-color: #f1f1f1;
    margin: 24px auto;
  }

  .emq-list-card {
    margin-bottom: 24px;
  }

  .sub-item-wrapper {
    max-height: 720px;
  }

  .sub-item.ant-card {
    margin: 0 20px 12px 20px;

    .qos,
    .create-at {
      font-size: 12px;
      color: #888;
      margin-right: 12px;
    }

    .topic {
      font-size: 16px;
      color: #000;
      margin: 4px auto;
    }

    .ant-card-body {
      padding: 12px;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 18px;
      cursor: pointer;
      color: #d8d8d8;
    }
  }

  .message-item-wrapper {
    max-height: 2048px;
  }

  .message-item.ant-card {
    margin: 20px auto;
    position: relative;

    &:not(.message-out) {
      border-left: 4px solid #d8d8d8;
    }

    &.message-out {
      border-right: 4px solid #d8d8d8;
    }

    .ant-card-body {
      padding: 6px;
      position: relative;
      color: #000;
    }

    .message-item-header {
      font-size: 12px;
      color: #888;

      & > span {
        margin-right: 12px;
      }

      .create-at {
        float: right;
      }
    }

    .message-item-content {
      margin-top: 6px;
      padding: 6px;
    }
  }

  .footer-area {
    margin-top: 20px;
  }

  .message-btn {
    margin: 10px auto;

    .icon {
      margin-left: 6px;
      cursor: pointer;
    }
  }
}
</style>
