<template>
  <div class="log-trace">
    <el-button size="small" @click="openCreateDialog" type="primary">{{ $t('Base.create') }}</el-button>
    <div class="part-header">
      {{ $t('LogTrace.activeList') }}
    </div>
    <el-table :data="aTraceTb" v-loading="aTraceTbLoading">
      <el-table-column :label="$t('LogTrace.name')" prop="name"></el-table-column>
      <el-table-column :label="$t('LogTrace.type')" prop="type"></el-table-column>
      <el-table-column :label="$t('LogTrace.condition')">
        <template #default="{ row }">
          {{ row[row.type] }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.startTime')">
        <template #default="{ row }">
          {{
            moment(row.start_at).format('YYYY-MM-DD HH:mm:ss') + '-' + moment(row.end_at).format('YYYY-MM-DD HH:mm:ss')
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.status')"></el-table-column>
      <el-table-column :label="$t('LogTrace.logSize')">
        <template #default="{ row }">
          {{ Object.keys(row.log_size).reduce((c, v) => c + row.log_size[v], 0) / 1024 }}KB
        </template>
      </el-table-column>
      <el-table-column min-width="100">
        <template #default="{ row }">
          <el-button type="dashed" size="mini" @click="viewDetail(row)">{{ $t('LogTrace.view') }}</el-button>
          <el-button type="dashed" size="mini" @click="download(row)">{{ $t('LogTrace.download') }}</el-button>
          <el-button size="mini" plain type="danger" @click="stopTraceHandler(row)">{{
            $t('LogTrace.stop')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="part-header">
      {{ $t('LogTrace.finishedList') }}
    </div>
    <el-table :data="fTraceTb" v-loading="fTraceTbLoading">
      <el-table-column :label="$t('LogTrace.name')" prop="name"></el-table-column>
      <el-table-column :label="$t('LogTrace.type')" prop="type"></el-table-column>
      <el-table-column :label="$t('LogTrace.condition')">
        <template #default="{ row }">
          {{ row[row.type] }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.startTime')">
        <template #default="{ row }">
          {{
            moment(row.start_at).format('YYYY-MM-DD HH:mm:ss') + '-' + moment(row.end_at).format('YYYY-MM-DD HH:mm:ss')
          }}
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
    </el-table>
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
                <el-option value="clientid"></el-option>
                <el-option value="topic"></el-option>
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
          <el-col :span="12" style="clear: both">
            <el-form-item :label="$t('LogTrace.startTime')" prop="startTime">
              <el-date-picker
                type="datetimerange"
                :start-placeholde="$t('LogTrace.startTime')"
                :end-placeholde="$t('LogTrace.endTime')"
                v-model="record.startTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
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
          </el-col>
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
    <el-dialog :title="$t('LogTrace.viewLog')" :visible.sync="viewDialog">
      <div v-loading="viewNodeLoading" :element-loading-text="nextPageLoading">
        <el-row>
          <el-col :span="10">
            <emq-select
              v-model="node"
              size="mini"
              :field="{ options: nodes }"
              :field-name="{ label: 'name', value: 'node' }"
            ></emq-select>
          </el-col>
        </el-row>
        <el-row>
          <div :style="{ height: initialHeight + 'px' }" class="m-container">
            <monaco
              id="log-trace"
              v-model="logContent"
              :scroll-loading="true"
              :scroll-func="scrollLoadFunc"
              lang="powershell"
              :disabled="true"
            ></monaco>
          </div>
        </el-row>
      </div>
      <div class="dialog-align-footer" slot="footer">
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { getTraceList, addTrace, getTraceLog, downloadTrace, stopTrace, deleteTrace } from '@/api/logTrace'
import { loadNodes as loadNodesApi } from '@/api/overview'
import Monaco from '@/components/Monaco.vue'

let LOG_VIEW_POSITION = 0
const MAX_LOG_SIZE = 5 * 1024 * 1024
const BYTEPERPAGE = 50 * 1024

export default {
  components: { Monaco },
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
    const needOnePacket = this.$t('LogTrace.needOnePacket')
    return {
      aTraceTb: [],
      fTraceTb: [],
      nodes: [],
      node: '',
      packetType: {
        clientid: [
          'CONNECT',
          'CONNACK',
          'AUTH',
          'PUBLISH',
          'PUBACK',
          'PUBREC',
          'PUBREL',
          'PUBCOMP',
          'SUBSCRIBE',
          'SUBACK',
          'UNSUBSCRIBE',
          'UNSUBACK',
          'PINGREQ',
          'PINGRESP',
          'DISCONNECT',
        ],
        topic: ['PUBLISH', 'SUBSCRIBE', 'UNSUBSCRIBE'],
      },
      createDialog: false,
      viewDialog: false,
      createRules: {
        name: [
          { required: true, messages: this.$t('General.pleaseEnter') },
          { validator: nameValidator, trigger: ['blur', 'change'] },
        ],
        topic: [{ required: true, messages: this.$t('General.pleaseEnter') }],
        clientid: [{ required: true, messages: this.$t('General.pleaseEnter') }],
        startTime: [
          {
            validator(r, v, cb) {
              // eslint-disable-next-line no-unused-expressions
              v && v[0] && v[1] ? cb() : cb(new Error(needStartTime))
            },
          },
        ],
        packets: [
          {
            validator(r, v, cb) {
              // eslint-disable-next-line no-unused-expressions
              v.length ? cb() : cb(new Error(needOnePacket))
            },
          },
        ],
      },
      logContent: '',
      initialHeight: 350,
      createLoading: false,
      aTraceTbLoading: false,
      fTraceTbLoading: false,
      viewNodeLoading: false,
      record: {
        packets: [],
        startTime: [],
        type: 'clientid',
      },
      viewLogName: '',
      nextPageLoading: '',
    }
  },
  created() {
    this.loadTraceList()
  },
  watch: {
    node(v, oldV) {
      if (v && oldV && v.node !== oldV.node) this.viewDetail({ name: this.viewLogName })
    },
  },
  methods: {
    moment,
    async loadNodes() {
      this.nodes = (await loadNodesApi().catch(() => {})) || []
      this.node = this.nodes[0]
    },
    async loadTraceList() {
      // eslint-disable-next-line no-unused-expressions
      ;(this.aTraceTbLoading = true), (this.fTraceTbLoading = true)
      const traceList = await Promise.all([getTraceList(true), getTraceList(false)]).catch(() => {})
      this.aTraceTb = traceList[0]
      this.fTraceTb = traceList[1]
      this.aTraceTbLoading = false
      this.fTraceTbLoading = false
    },

    async submitTrace() {
      this.$refs.createForm.validate(async (valid) => {
        if (!valid) return

        this.createLoading = true
        const sendbody = {
          ...this.record,
          start_at: new Date(this.record.startTime[0]).toISOString,
          end_at: new Date(this.record.startTime[1]).toISOString,
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
      this.record.startTime = [timeNow, new Date(timeNow.getTime() + 30 * 60 * 1000)]
    },
    async viewDetail(row) {
      if (!row || !row.name) return
      this.viewDialog = true
      this.viewNodeLoading = true
      this.viewLogName = row.name
      LOG_VIEW_POSITION = 0
      this.logContent = ''
      this.nextPageLoading = ''
      await this.loadNodes()
      await this.loadLogDetail(row.name)

      this.viewNodeLoading = false
    },
    async loadLogDetail(name) {
      const params = { position: LOG_VIEW_POSITION, bytes: BYTEPERPAGE, node: this.node.node }
      const logResp = await getTraceLog(name, params).catch(() => {})
      if (logResp && logResp.items) {
        this.logContent += logResp.items
        LOG_VIEW_POSITION += BYTEPERPAGE + 1
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
      if (event.scrollTop + this.initialHeight >= event.scrollHeight && !this.viewNodeLoading) {
        if (LOG_VIEW_POSITION <= MAX_LOG_SIZE) {
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
    cancelDialog() {
      this.createDialog = false
    },
    cancelViewDialog() {
      this.viewDialog = false
    },
  },
}
</script>

<style lang="scss" scoped>
.part-header {
  margin: 30px 0 10px;
  font-weight: 700;
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
</style>
