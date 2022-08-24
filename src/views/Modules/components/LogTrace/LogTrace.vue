<template>
  <div class="log-trace">
    <el-button size="small" @click="openCreateDialog" type="primary">{{ $t('Base.create') }}</el-button>
    <!-- <div class="part-header">
      {{ $t('LogTrace.activeList') }}
    </div> -->
    <el-table :data="traceTable" v-loading="traceTbLoading" class="data-table">
      <el-table-column :label="$t('LogTrace.name')" prop="name"></el-table-column>
      <el-table-column :label="$t('LogTrace.type')" prop="type"></el-table-column>
      <el-table-column :label="$t('LogTrace.condition')">
        <template #default="{ row }">
          {{ row[row.type] }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.startEndTime')" min-width="90">
        <template #default="{ row }">
          {{ moment(row.start_at).format('YYYY-MM-DD HH:mm:ss') }}<br />{{
            moment(row.end_at).format('YYYY-MM-DD HH:mm:ss')
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.status')">
        <template #default="{ row }">
          <a-badge
            is-dot
            :status="row.status === 'running' ? 'success' : row.status === 'stopped' ? 'default' : 'warning'"
            :text="$t('LogTrace.s' + row.status)"
          ></a-badge>
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.logSize')">
        <template #default="{ row }">
          {{ (Object.keys(row.log_size).reduce((c, v) => c + row.log_size[v], 0) / 1024).toFixed(2) }}KB
        </template>
      </el-table-column>
      <el-table-column min-width="100">
        <template #default="{ row }">
          <el-button type="dashed" size="mini" @click="viewDetail(row)">{{ $t('LogTrace.view') }}</el-button>
          <el-button type="dashed" size="mini" @click="download(row)">{{ $t('LogTrace.download') }}</el-button>
          <template v-if="row.status !== 'stopped'">
            <el-button size="mini" type="dashed" @click="stopTraceHandler(row)">{{ $t('LogTrace.stop') }}</el-button>
          </template>
          <template v-else>
            <el-button size="mini" type="dashed" @click="deleteTraceHandler(row)">{{
              $t('LogTrace.delete')
            }}</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="part-header">
      {{ $t('LogTrace.finishedList') }}
    </div> -->
    <!-- <el-table :data="fTraceTb" v-loading="fTraceTbLoading">
      <el-table-column :label="$t('LogTrace.name')" prop="name"></el-table-column>
      <el-table-column :label="$t('LogTrace.type')" prop="type"></el-table-column>
      <el-table-column :label="$t('LogTrace.condition')">
        <template #default="{ row }">
          {{ row[row.type] }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.startEndTime')" min-width="90">
        <template #default="{ row }">
          {{ moment(row.start_at).format('YYYY-MM-DD HH:mm:ss') }}<br />
          {{ moment(row.end_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.logSize')">
        <template #default="{ row }">
          {{ (Object.keys(row.log_size).reduce((c, v) => c + row.log_size[v], 0) / 1024).toFixed(2) }}KB
        </template>
      </el-table-column>
      <el-table-column min-width="100">
        <template #default="{ row }">
          <el-button type="dashed" size="mini" @click="viewDetail(row)">{{ $t('LogTrace.view') }}</el-button>
          <el-button type="dashed" size="mini" @click="download(row)">{{ $t('LogTrace.download') }}</el-button>
          <el-button size="mini" type="danger" plain @click="deleteTraceHandler(row)">{{
            $t('LogTrace.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <el-dialog :title="$t('LogTrace.createLog')" :visible.sync="createDialog">
      <el-form ref="createForm" size="small" label-position="top" :model="record" :rules="createRules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('LogTrace.name')" prop="name">
              <el-input v-model="record.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('LogTrace.type')" prop="type">
              <el-select v-model="record.type">
                <el-option
                  v-for="{ value, label } in typeOptions"
                  :key="value"
                  :value="value"
                  :label="label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="record.type === 'topic'">
            <el-form-item label="Topic" prop="topic">
              <el-input v-model="record.topic"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="record.type === 'clientid'">
            <el-form-item label="ClientID" prop="clientid">
              <el-input v-model="record.clientid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="record.type === 'ip_address'">
            <el-form-item label="IP Address" prop="ip_address">
              <el-input v-model="record.ip_address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item :label="$t('LogTrace.startEndTime')" prop="startTime">
              <el-date-picker
                type="datetimerange"
                :start-placeholde="$t('LogTrace.startTime')"
                :end-placeholde="$t('LogTrace.endTime')"
                :picker-options="pickerOptions"
                v-model="record.startTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="Packets" prop="packets">
              <el-checkbox-group v-model="record.packets">
                <template v-for="item in packetType.clientid">
                  <div :key="item">
                    <el-checkbox
                      :label="item"
                      :disabled="record.type === 'topic' && !packetType.topic.includes(item)"
                      class="packet-chkbox"
                    ></el-checkbox>
                  </div>
                </template>
              </el-checkbox-group>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div class="dialog-align-footer" slot="footer">
        <el-button size="small" @click="cancelDialog()">{{ $t('Base.cancel') }}</el-button>
        <el-button
          class="dialog-primary-btn"
          type="primary"
          size="small"
          @click="submitTrace()"
          :loading="createLoading"
        >
          {{ $t('Base.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('LogTrace.viewLog')" :visible.sync="viewDialog" custom-class="log-dialog" fullscreen>
      <div v-loading="viewNodeLoading" :element-loading-text="nextPageLoading">
        <el-row>
          <el-col :span="6">
            <el-select v-model="node" size="small">
              <el-option v-for="item in nodes" :value="item.node" :key="item.node"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button
              class="dialog-primary-btn"
              type="primary"
              size="small"
              @click="download({ name: viewLogName })"
              :disabled="viewNodeLoading"
            >
              {{ $t('Base.download') }}
            </el-button>
          </el-col>
        </el-row>
        <p class="default-node-tip">{{ $t('Modules.defaultNodeTip') }}</p>
        <el-row>
          <div :style="{ height: initialHeight + 'px' }" class="m-container" ref="monacoContainer">
            <log-content
              id="log-trace"
              v-model="logContent"
              :scroll-loading="true"
              :scroll-func="scrollLoadFunc"
              lang="powershell"
              :disabled="true"
            />
          </div>
        </el-row>
      </div>
      <!-- <div class="dialog-align-footer" slot="footer">
        <el-button size="small" @click="cancelViewDialog()">{{ $t('Base.cancel') }}</el-button>
        <el-button
          class="dialog-primary-btn"
          type="primary"
          size="small"
          @click="download({ name: viewLogName })"
          :disabled="viewNodeLoading"
        >
          {{ $t('Base.download') }}
        </el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import {
  getTraceList,
  addTrace,
  getTraceLog,
  downloadTrace,
  stopTrace,
  deleteTrace,
  getTraceDetail,
} from '@/api/logTrace'
import { loadNodes as loadNodesApi } from '@/api/overview'
import LogContent from './LogContent.vue'

let LOG_VIEW_POSITION = 0
let LAST_ACTIVED_SCROLLTOP = 0
const MAX_LOG_SIZE = 5 * 1024 * 1024
const BYTEPERPAGE = 50 * 1024
const DEFAULT_DURATION = 30 * 60 * 1000

const typeOptions = [
  {
    value: 'clientid',
    label: 'ClientID',
  },
  {
    value: 'topic',
    label: 'Topic',
  },
  {
    value: 'ip_address',
    label: 'IP Address',
  },
]

export default {
  components: { LogContent },
  name: 'LogTrace',
  data() {
    const nameValidator = (rule, value, callback) => {
      if (/[\w-]+/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('General.validString')))
      }
    }
    const needStartTime = this.$t('LogTrace.needStartTime')
    // const needOnePacket = this.$t('LogTrace.needOnePacket')
    const pickerOptions = {
      disabledDate(date) {
        return date.getTime() < new Date(new Date().setHours(0)).getTime()
      },
    }
    return {
      typeOptions,
      pickerOptions,
      // aTraceTb: [],
      traceTable: [],
      nodes: [],
      node: '',
      // packetType: {
      //   clientid: [
      //     'CONNECT',
      //     'CONNACK',
      //     'AUTH',
      //     'PUBLISH',
      //     'PUBACK',
      //     'PUBREC',
      //     'PUBREL',
      //     'PUBCOMP',
      //     'SUBSCRIBE',
      //     'SUBACK',
      //     'UNSUBSCRIBE',
      //     'UNSUBACK',
      //     'PINGREQ',
      //     'PINGRESP',
      //     'DISCONNECT',
      //   ],
      //   topic: ['PUBLISH', 'SUBSCRIBE', 'UNSUBSCRIBE'],
      // },
      createDialog: false,
      viewDialog: false,
      createRules: {
        name: [
          { required: true, message: this.$t('General.pleaseEnter') },
          { validator: nameValidator, trigger: ['blur', 'change'] },
        ],
        topic: [{ required: true, message: this.$t('General.pleaseEnter') }],
        clientid: [{ required: true, message: this.$t('General.pleaseEnter') }],
        ip_address: [
          { required: true, message: this.$t('General.pleaseEnter') },
          // {
          //   validator(r, v, cb) {},
          // },
        ],
        startTime: [
          {
            validator(r, v, cb) {
              // eslint-disable-next-line no-unused-expressions
              v && v[0] && v[1] ? cb() : cb(new Error(needStartTime))
            },
          },
        ],
        // packets: [
        //   {
        //     validator(r, v, cb) {
        //       // eslint-disable-next-line no-unused-expressions
        //       v.length ? cb() : cb(new Error(needOnePacket))
        //     },
        //   },
        // ],
      },
      logContent: '',
      initialHeight: 350,
      createLoading: false,
      traceTbLoading: false,
      // fTraceTbLoading: false,
      viewNodeLoading: false,
      record: {
        // packets: [],
        name: '',
        type: typeOptions[0].value,
        clientid: '',
        ip_address: '',
        topic: '',
        startTime: [],
      },
      viewLogName: '',
      nextPageLoading: '',
      // Prevents monaco components from repeatedly triggering load events for unknown reasons
      isLoadedDataWithin300MS: false,
    }
  },
  created() {
    this.loadTraceList()
  },
  watch: {
    node(v, oldV) {
      if (v && oldV && v !== oldV) this.viewDetail({ name: this.viewLogName }, true)
    },
  },
  methods: {
    moment,
    async loadNodes() {
      this.nodes = []
      const nodes = await loadNodesApi().catch(() => {})
      if (nodes) {
        nodes.forEach((v) => {
          this.nodes.push({ node: v.node })
        })
        this.node = (this.nodes[0] && this.nodes[0].node) || ''
      }
    },
    async loadTraceList() {
      this.traceTbLoading = true
      // this.fTraceTbLoading = true
      const traceList = await getTraceList().catch(() => {})
      this.traceTable = traceList
      // this.fTraceTb = traceList[1]
      this.traceTbLoading = false
      // this.fTraceTbLoading = false
    },

    async submitTrace() {
      this.$refs.createForm.validate(async (valid) => {
        if (!valid) return

        this.createLoading = true
        const { clientid, ip_address, name, topic, type } = this.record
        let targetInfo = {}
        switch (type) {
          case typeOptions[0].value:
            targetInfo = { clientid, type }
            break
          case typeOptions[1].value:
            targetInfo = { topic, type }
            break
          case typeOptions[2].value:
            targetInfo = { ip_address, type }
            break
          default:
            break
        }
        const sendbody = {
          name,
          ...targetInfo,
          start_at: new Date(this.record.startTime[0]).toISOString(),
          end_at: new Date(this.record.startTime[1]).toISOString(),
        }

        delete sendbody.startTime
        const res = await addTrace(sendbody).catch(() => {})
        if (res) {
          this.$message.success(this.$t('LogTrace.createSuc'))
          this.loadTraceList()
          this.cancelDialog()
        }
        this.createLoading = false
      })
    },
    async openCreateDialog() {
      this.createDialog = true
      const timeNow = new Date()
      this.record.startTime = [timeNow, new Date(timeNow.getTime() + DEFAULT_DURATION)]
    },
    async getWhichNodeHasNewestLog(name) {
      const nodeList = await getTraceDetail(name)
      if (!nodeList || nodeList.length === 0) {
        return false
      }
      return nodeList.sort((node1, node2) => node2.mtime - node1.mtime)[0].node
    },
    initLogContent() {
      LOG_VIEW_POSITION = 0
      LAST_ACTIVED_SCROLLTOP = 0
      this.logContent = ''
      this.nextPageLoading = ''
    },
    async viewDetail(row, changeNode = false) {
      if (!row || !row.name) return
      this.viewDialog = true
      this.$nextTick(() => {
        this.countInitialHeight()
      })
      this.viewNodeLoading = true
      this.viewLogName = row.name

      this.initLogContent()

      if (!changeNode) {
        await this.loadNodes()
        const node = await this.getWhichNodeHasNewestLog(row.name)
        this.node = node || this.node
      }
      await this.loadLogDetail(row.name)

      this.viewNodeLoading = false
    },
    async loadLogDetail(name) {
      if (this.isLoadedDataWithin300MS) {
        return
      }
      this.isLoadedDataWithin300MS = true
      window.setTimeout(() => {
        this.isLoadedDataWithin300MS = false
      }, 300)

      const params = { position: LOG_VIEW_POSITION, bytes: BYTEPERPAGE, node: this.node }
      const logResp = await getTraceLog(name, params).catch(() => {})
      if (logResp && logResp.items) {
        const { meta = {} } = logResp
        this.logContent += logResp.items
        LOG_VIEW_POSITION = meta.position ? meta.position : LOG_VIEW_POSITION + BYTEPERPAGE
      }
    },
    async download(row) {
      if (!row.name) {
        return
      }
      await downloadTrace(row.name)
      // download link, no more action needed
    },
    async stopTraceHandler(row) {
      if (!row.name) return
      const res = await stopTrace(row.name).catch(() => {})
      if (res) {
        this.$message.success(this.$t('LogTrace.stopSuc'))
        this.loadTraceList()
      }
    },
    async scrollLoadFunc(event) {
      if (
        event.scrollTop + this.initialHeight >= event.scrollHeight &&
        event.scrollTopChanged &&
        event.scrollTop >= LAST_ACTIVED_SCROLLTOP
      ) {
        if (LOG_VIEW_POSITION <= MAX_LOG_SIZE) {
          LAST_ACTIVED_SCROLLTOP = event.scrollTop
          this.viewNodeLoading = true
          this.nextPageLoading = this.$t('LogTrace.loadNextPage')
          await this.loadLogDetail(this.viewLogName)
          this.viewNodeLoading = false
        } else {
          this.$messages.warning(this.$t('LogTrace.tooLargeLog'))
        }
      }
    },
    async deleteTraceHandler(row) {
      if (!row.name) {
        return
      }
      const prompt = await this.$confirm(this.$t('LogTrace.confirmDeleteTrace'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).catch(() => {})

      if (prompt) {
        const res = await deleteTrace(row.name).catch(() => {})
        if (res) {
          this.$message.success(this.$t('LogTrace.deleteSuc'))
          this.loadTraceList()
        }
      }
    },
    countInitialHeight() {
      const windowHeight = window.innerHeight
      const containerTop = this.$refs.monacoContainer.getBoundingClientRect().top
      this.initialHeight = windowHeight - containerTop - 50
    },
    cancelDialog() {
      this.createDialog = false
      this.$refs.createForm.resetFields()
    },
    cancelViewDialog() {
      this.viewDialog = false
    },
  },
  beforeRouteLeave() {
    this.viewDialog = false
  },
}
</script>

<style lang="scss" scoped>
.data-table {
  margin-top: 30px;
}
.el-select {
  width: 100%;
}
.el-date-editor {
  width: 100% !important;
}
.packet-chkbox {
  line-height: 18px;
}
.m-container {
  border: 1px solid #ddd;
  margin-top: 30px;
}

.el-button.el-button--small {
  line-height: 14px;
}

.default-node-tip {
  margin-bottom: 0;
  margin-top: 8px;
  color: #bcbcbc;
}
</style>
