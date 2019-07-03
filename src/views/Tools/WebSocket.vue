<template>
  <div class="websocket">
    <a-card
      class="emq-list-card"
    >
      <div class="websocket-config">

        <div class="emq-title">
          连接配置
        </div>

        <el-form
          ref="configForm"
          hide-required-asterisk
          :model="connection"
          size="small"
          :rules="connectionRules"
          label-position="top"
          @keyup.enter.native="createConnection"
        >

          <!--<el-form-item prop="protocols" label="协议类型">
          <!--<emq-select-->
          <!--v-model="connection.protocols"-->
          <!--:readonly="client.connected"-->
          <!--:field="{ list: ['ws', 'wss'] }"-->
          <!--@change="protocolsChange"></emq-select>-->
          <!--</el-form-item>-->

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="host" label="主机名">
                <el-input v-model="connection.host" :readonly="client.connected"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="port" label="端口">
                <el-input
                  v-model.number="connection.port" type="number" placeholder="8083/8084"
                  :readonly="client.connected"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="endpoint" label="挂载点">
                <el-input v-model="connection.endpoint" placeholder="/mqtt" :readonly="client.connected"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">


              <el-form-item prop="clientId" label="Client ID">
                <el-input v-model="connection.clientId" :readonly="client.connected">
                  <i slot="suffix" title="随机生成" :disabled="client.connected" class="el-icon-refresh el-input_icon" @click="refreshClientId"></i>
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
                <el-input
                  v-model.number="connection.keepalive"
                  :readonly="client.connected"
                  type="number"
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

              <!--<span class="btn">{{ connectUrl }}</span>-->
            </el-col>

            <el-col :span="24" class="footer-area">
              <el-button
                type="primary"
                size="small"
                class="conn-btn"
                :disabled="client.connected"
                @click="createConnection"
              >
                {{ client.connected ? '已连接' : '连接' }}
              </el-button>

              <el-button
                type="danger"
                size="small"
                class="conn-btn"
                :disabled="!client.connected"
                @click="destroyConnection"
              >
                断开连接
              </el-button>
            </el-col>


          </el-row>

          <!--
          <div v-if="false" class="connection-wrapper">
            <el-form-item label="Last-Will Topic">
              <el-input v-model="connection.will.topic" :readonly="client.connected"></el-input>
            </el-form-item>

            <el-form-item label="Last-Will QoS">
              <emq-select v-model.number="connection.will.qos" :readonly="client.connected"
                          :field="{ list: [0, 1, 2] }"
              ></emq-select>
            </el-form-item>

            <el-form-item label="Last-Will Retain">
              <el-checkbox v-model="connection.will.retain" :readonly="client.connected"></el-checkbox>
            </el-form-item>

            <div>
              <el-form-item label="Last-Will Message">
                <el-input v-model="connection.will.payload" type="textarea" :readonly="client.connected"></el-input>
              </el-form-item>
            </div>
          </div>
          -->
        </el-form>
      </div>
    </a-card>


    <a-card class="emq-list-card">
      <div class="emq-title">
        订阅
      </div>

      <el-row :gitter="20">
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
                  订 阅
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-col>

        <el-col :span="12">
          <el-scrollbar wrap-class="sub-item-wrapper" :native="false">
            <a-card v-for="(item, i) in subscriptions" :key="i" class="sub-item">
              <i class="el-icon-close close-btn" @click="_doUnSubscribe(item)"></i>
              <div class="sub-item-header">
                <span class="qos">QoS: {{ item.qos }}</span>
                <span class="create-at">{{ item.createAt }}</span>
              </div>
              <div class="topic">{{ item.topic }}</div>
            </a-card>
          </el-scrollbar>
        </el-col>

      </el-row>
    </a-card>


    <a-card class="emq-list-card">
      <div class="emq-title">
        发布
      </div>

      <div class="connection-wrapper">
        <el-form
          ref="pubForm"
          hide-required-asterisk
          label-position="top" :model="messageRecord" :rules="messageRecordRules" size="small"
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
                <emq-select v-model.number="messageRecord.qos" :field="{ list: [0, 1, 2] }" size="small"></emq-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <span slot="label">&nbsp;</span>
                <el-checkbox v-model="messageRecord.retain" style="margin-right: 20px">Retain</el-checkbox>
                <el-button type="primary" size="small" class="conn-btn" style="float: right" @click="_doPublish">
                  发 布
                </el-button>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </div>

      <div class="line"></div>

      <el-scrollbar view-class="message-item-wrapper" :native="false">
        <a-card v-for="(item, i) in messages" :key="i" class="message-item" :class="{ 'message-out': item.out }">
          <div class="message-item-header">
            <span>Topic: {{ item.topic }}</span>
            <span>QoS: {{ item.qos }}</span>
            <span v-if="item.retain">Retain</span>
            <span class="create-at">{{ item.createAt }}</span>
          </div>
          <div class="message-item-content">
            <code>{{ item.payload }}</code>
          </div>
        </a-card>
      </el-scrollbar>
    </a-card>

  </div>
</template>


<script>
import mqtt from 'mqtt'
import moment from 'moment'
import mqttMatch from 'mqtt-match'

window.moment = moment
export default {
  name: 'WebSocket',

  components: {},

  props: {},

  data() {
    const that = this
    return {
      messageRecordRules: {
        topic: { required: true, message: '请输入' },
      },
      stateIcon: {
        0: 'el-icon-message',
        1: 'el-icon-loading',
        3: 'el-icon-warning',
      },
      connectionRules: {
        host: { required: true },
        port: [{ type: 'number', required: true, message: '请输入' }, {
          type: 'number',
          min: 1,
          max: 65535,
          message: '范围错误',
        }],
        keepalive: [{ type: 'number', required: true, message: '请输入' }, { type: 'number', min: 0, message: '范围错误' }],
      },
      subscriptionsRules: {
        topic: [{ required: true, message: '请输入' }],
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
      messages: [],

      activeIndex: '0',
      sessions: [],
    }
  },

  computed: {
    btnStatusText() {
      let text = '连接'
      if (this.client.connected) {
        text = '断开连接'
      } else if (this.client.connecting) {
        text = '连接中'
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

  watch: {},

  created() {},

  methods: {
    _now() {
      return moment().format('YYYY-MM-DD HH:mm:ss')
    },
    onMessage(topic, payload, packet = {}) {
      this.messages.unshift({
        out: false,
        createAt: this._now(),
        topic,
        payload: payload.toString(),
        qos: packet.qos,
        retain: packet.retain,
      })
    },
    handleConnect() {
      if (this.client.connected) {
        this.client.end()
      } else {
        this.createConnection()
      }
    },
    destroyConnection() {
      if (this.client.connected) {
        this.client.end()
      }
    },
    _doUnSubscribe(item) {
      if (!this.client.connected) {
        this.$message.error('客户端未连接')
        return
      }
      this.client.unsubscribe(item.topic, (error) => {
        if (error) {
          return
        }
        this.subscriptions = this.subscriptions.filter($ => $.topic !== item.topic)
        this.messages = this.messages.filter($ => mqttMatch($.topic, item.topic))
      })
    },
    async _doSubscribe() {
      const valid = await this.$refs.subForm.validate()
      if (!valid) {
        return
      }
      if (!this.client.connected) {
        this.$message.error('客户端未连接')
        return
      }
      const { topic, qos } = this.subscriptionsRecord
      this.client.subscribe(topic, { qos }, (err, granted) => {
        if (err) {
          this.$message.error('订阅失败')
          return
        }
        if (this.subscriptions.find($ => $.topic === topic)) {
          return
        }
        this.subscriptions.unshift({
          topic,
          qos,
          createAt: this._now(),
        })
      })
    },
    async _doPublish() {
      const valid = await this.$refs.pubForm.validate()
      if (!valid) {
        return
      }
      if (!this.client.connected) {
        this.$message.error('客户端未连接')
        return
      }
      const {
        topic, qos, payload, retain,
      } = this.messageRecord
      this.client.publish(topic, payload, {
        qos, retain,
      }, (err) => {
        if (err) {
          this.$message.error('发布失败')
          return
        }
        this.messages.unshift({
          out: true,
          createAt: this._now(),
          topic,
          payload,
          qos,
          retain,
        })
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
        return
      }
      this.$refs.configForm.validate((valid) => {
        if (!valid) {
          return
        }
        const {
          protocols, host, endpoint, clientId, username, port,
          password, reconnectPeriod, keepalive, clean, connectTimeout, will,
        } = this.connection

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
        this.client.on('error', () => {
          try {
            this.client.end()
          } catch (e) {
            console.log(e)
          }
        })

        // this.client.on('connect', this.onMessage)
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
      this.messages = session.messages || []
    },
    sessionChange(i) {
      this.activeIndex = i
    },
  },
}
</script>


<style lang="scss">
.websocket {


  .el-form-item {
    .el-form-item__label {
      padding: 0;
    }
  }

  .el-row {
    .el-input, .emq-select {
      width: 100%;
    }
  }

  .emq-list-card {
    .ant-card-head-title {
      /*text-align: left !important;*/
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

    .qos, .create-at {
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
}
</style>
