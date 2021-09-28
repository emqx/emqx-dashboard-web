<template>
  <div>
    <div class="section-header" v-if="!showIntegration">
      <div></div>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog()">
        {{ tl('addListener') }}
      </el-button>
    </div>
    <el-table :data="listenerTable">
      <el-table-column :label="'ID'" sortable></el-table-column>
      <el-table-column :label="tl('lType')" sortable></el-table-column>
      <el-table-column :label="tl('lAddress')" sortable></el-table-column>
      <el-table-column label="Acceptors" sortable></el-table-column>
      <el-table-column :label="tl('lMaxConn')" sortable></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template>
          <el-button size="mini">{{ $t('Base.edit') }}</el-button>
          <el-button size="mini" type="danger" plain>{{ $t('Base.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="not-standalone-btn" v-if="showIntegration">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog()">
        {{ tl('addListener') }}
      </el-button>
    </div>

    <el-dialog :title="tl('addListener')" :visible.sync="addListenerDialog">
      <div class="part-header">{{ tl('basic') }}</div>
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="tl('name')">
              <el-input v-model="listenerInput.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('lType')">
              <el-select v-model="listenerInput.type">
                <el-option :value="'tcp'"></el-option>
                <el-option :value="'ssl'"></el-option>
                <el-option :value="'udp'"></el-option>
                <el-option :value="'dtls'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('lAddress')">
              <el-input v-model="listenerInput.bind"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('mountPoint')">
              <el-input v-model="listenerInput.mountpoint"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="part-header">{{ tl('listenerSetting') }}</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="'Acceptors'">
              <el-input v-model="listenerInput.acceptors"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('maxConn')">
              <el-input v-model="listenerInput.max_connections"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('maxConnRate')">
              <el-input v-model="listenerInput.max_conn_rate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="part-header">
          {{ listenerInput.type.toUpperCase() + ' ' + tl('configSetting') }}
        </div>
        <el-row :gutter="20">
          <template v-if="listenerInput.type === 'ssl' || listenerInput.type === 'dtls'">
            <el-col :span="24">
              <el-form-item> </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item> </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item> </el-form-item>
            </el-col>
            <template v-if="listenerInput.type === 'ssl'">
              <el-col :span="12">
                <el-form-item :label="tl('sslversion')">
                  <el-select v-model="listenerInput.ssl.versions">
                    <el-option value="tlsv1.3,tlsv1.2,tlsv1.1,tlsv1"></el-option>
                    <el-option value="tlsv1.2,tlsv1.1,tlsv1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <template v-else-if="listenerInput.type === 'dtls'">
              <el-col :span="12">
                <el-form-item :label="tl('dtlsversion')">
                  <el-select v-model="listenerInput.dtls.versions">
                    <el-option value="dtlsv1.2,dtlsv1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="12">
              <el-form-item :label="'Verify'">
                <el-select v-model="listenerInput.xtls.verify">
                  <el-option value="verify_none"></el-option>
                  <el-option value="verify_peer"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Fail If No Peer Cert'">
                <el-select v-model="listenerInput.xtls.fail_if_no_peer_cert">
                  <el-option value="true"></el-option>
                  <el-option value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Server Name Indacation'">
                <el-input v-model="listenerInput.xtls.server_name_indication"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Intermediate Certificate Depth'">
                <el-input v-model="listenerInput.xtls.depth"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Key Password'">
                <el-input v-model="listenerInput.xtls.password"></el-input>
              </el-form-item>
            </el-col>
          </template>

          <template v-if="listenerInput.type === 'tcp'">
            <el-col :span="12">
              <el-form-item :label="'ActiveN'">
                <el-input
                  v-model="listenerInput.tcp.active_n"
                  :placeholder="baseInput.tcp.active_n"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Buffer'">
                <el-input
                  v-model="listenerInput.tcp.buffer"
                  :placeholder="baseInput.tcp.buffer"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'TCP_NODELAY'">
                <el-select v-model="listenerInput.tcp.nodelay">
                  <el-option value="true"></el-option>
                  <el-option value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'SO_REUSEADDR'">
                <el-select v-model="listenerInput.tcp.reuseaddr">
                  <el-option value="true"></el-option>
                  <el-option value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="tl('sendTimeout')">
                <el-input
                  v-model="listenerInput.tcp.send_timeout[0]"
                  :placeholder="baseInput.tcp.send_timeout[0]"
                >
                  <el-select slot="append" v-model="listenerInput.tcp.send_timeout[1]">
                    <el-option value="s"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="tl('sendTimeoutClose')">
                <el-select v-model="listenerInput.tcp.send_timeout_close">
                  <el-option value="true"></el-option>
                  <el-option value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Proxy Protocol'">
                <el-select v-model="listenerInput.tcp.proxy_protocol">
                  <el-option value="true"></el-option>
                  <el-option value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Proxy Protocol Timeout'">
                <el-input
                  v-model="listenerInput.tcp.proxy_protocol_timeout[0]"
                  :placeholder="baseInput.tcp.proxy_protocol_timeout[0]"
                >
                  <el-select slot="append" v-model="listenerInput.tcp.proxy_protocol_timeout[1]">
                    <el-option value="s"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </template>

          <template v-else-if="listenerInput.type === 'udp'"> </template>
        </el-row>
      </el-form>
      <template #footer>
        <el-button size="small" @click="addListenerDialog = false">{{
          $t('Base.cancel')
        }}</el-button>
        <el-button type="primary" size="small" @click="addListener()">{{
          $t('Base.add')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, watch } from '@vue/composition-api'
import { getGatewayListeners } from '@/api/gateway'

export default defineComponent({
  props: {
    integration: {
      type: Boolean,
      required: false,
      default: false,
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    let baseInput = {
      type: 'tcp',
      name: '',
      bind: '',
      acceptors: 16,
      max_connections: 102400,
      max_conn_rate: 1000,
      mountpoint: '',
      tcp: {
        nodelay: false,
        reuseaddr: true,
        send_timeout_close: true,
        proxy_protocol: false,
        active_n: 100,
        buffer: '',
        send_timeout: [15, 's'],
        proxy_protocol_timeout: [15, 's'],
      },
      udp: {},
      dtls: {
        versions: 'dtls1.2,dtlsv1',
      },
      ssl: {
        versions: 'tlsv1.3,tlsv1.2,tlsv1.1,tlsv1',
      },
      xtls: {
        cacertfile: '',
        certfile: '',
        keyfile: '',
        verify: 'verify_none',
        fail_if_no_peer_cert: false,
        server_name_indication: 'disable',
        depth: 10,
        password: '',
      },
    }
    let addListenerDialog = ref(false)
    let listenerTable = ref([])
    let listenerInput = ref({ ...baseInput })

    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    const openAddDialog = () => {
      addListenerDialog.value = true
    }

    const loadListenerData = async function () {
      let res = await getGatewayListeners(props.name).catch(() => {})
      if (res) {
        listenerTable.value = res
      }
    }

    const addListener = async function () {}

    onMounted(() => {
      if (!props.integration) {
        loadListenerData()
      }
    })

    return {
      tl,
      showIntegration: !!props.integration,
      openAddDialog,
      addListenerDialog,
      listenerTable,
      addListener,
      listenerInput,
      baseInput,
    }
  },
})
</script>

<style lang="scss" scoped>
.not-standalone-btn {
  margin-top: 40px;
  margin-bottom: 20px;
}
</style>
