<template>
  <div>
    <el-tabs>
      <el-tab-pane :label="tl('setting')" v-loading="configLoading">
        <div class="part-header">{{ tl('storage') }}</div>
        <el-form
          :disabled="!configEnable"
          ref="retainerForm"
          :rules="retainerRules"
          :model="retainerConfig"
        >
          <el-row>
            <el-col :span="16">
              <el-form-item :label="tl('storageType')">
                <el-select v-model="retainerConfig.config.type">
                  <el-option value="built_in_database" :label="tl('builtInDatabase')"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item :label="tl('storage')">
                <el-select v-model="retainerConfig.config.storage_type">
                  <el-option value="ram"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="part-header">{{ tl('policy') }}</div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Max Retained Messages" prop="config.max_retained_messages">
                <el-input v-model.number="retainerConfig.config.max_retained_messages">
                  <el-select slot="append" v-model="selOptions.retained">
                    <el-option value="unlimited" :label="tl('unlimited')"></el-option>
                    <el-option value="custom" :label="tl('custom')"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Max Payload Size" prop="max_payload_size[0]">
                <el-input v-model.number="retainerConfig.max_payload_size[0]">
                  <el-select slot="append" v-model="selOptions.payload">
                    <el-option value="KB" label="KB"></el-option>
                    <el-option value="MB" label="MB"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="tl('expire')" prop="msg_expiry_interval[0]">
                <el-input v-model.number="retainerConfig.msg_expiry_interval[0]">
                  <el-select slot="append" v-model="selOptions.expiry">
                    <el-option value="0s" :label="tl('noExp')"></el-option>
                    <el-option value="s" :label="tl('sec')"></el-option>
                    <el-option value="m" :label="tl('min')"></el-option>
                    <el-option value="h" :label="tl('hour')"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="tl('intervalClean')" prop="msg_clear_interval[0]">
                <el-input v-model.number="retainerConfig.msg_clear_interval[0]">
                  <el-select slot="append" v-model="selOptions.clean">
                    <el-option value="0s" :label="tl('disable')"></el-option>
                    <el-option value="s" :label="tl('sec')"></el-option>
                    <el-option value="m" :label="tl('min')"></el-option>
                    <el-option value="h" :label="tl('hour')"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="part-header">{{ tl('flowControl') }}</div>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="tl('readNumber')" prop="flow_control.max_read_number">
                <el-input v-model.number="retainerConfig.flow_control.max_read_number">
                  <el-select slot="append" v-model="selOptions.read">
                    <el-option value="unlimited" :label="tl('unlimited')"></el-option>
                    <el-option value="custom" :label="tl('custom')"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="tl('deliverQuota')" prop="flow_control.msg_deliver_quota">
                <el-input v-model.number="retainerConfig.flow_control.msg_deliver_quota">
                  <el-select slot="append" v-model="selOptions.deliver">
                    <el-option value="unlimited" :label="tl('unlimited')"></el-option>
                    <el-option value="custom" :label="tl('custom')"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                :label="tl('releaseInterval')"
                prop="flow_control.quota_release_interval[0]"
              >
                <el-input v-model.number="retainerConfig.flow_control.quota_release_interval[0]">
                  <el-select slot="append" v-model="selOptions.release">
                    <el-option value="s" :label="tl('sec')"></el-option>
                    <el-option value="m" :label="tl('min')"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button size="small" type="primary" @click="updateConfigData()">{{
              $t('Base.update')
            }}</el-button>
          </el-row>
        </el-form>
        <div class="part-header">{{ tl('enable') }}</div>
        <el-row>
          <el-col :span="13">{{ tl('enableDesc') }}</el-col>
          <el-col :span="6">
            <el-switch v-model="retainerConfig.enable" @change="updateConfigData()"></el-switch>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="tl('dataManage')">
        <el-table :data="tbData" v-loading="tbLoading">
          <el-table-column :label="'Topic'" prop="topic" sortable></el-table-column>
          <el-table-column :label="'QoS'" prop="qos" sortable></el-table-column>
          <el-table-column :label="'Payload'">
            <template #default="{ row }">
              <el-button size="mini" @click="checkPayload(row)">{{ tl('openPayload') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="'From ClientID'" prop="from_clientid" sortable></el-table-column>
          <el-table-column :label="tl('createDate')" prop="publish_at" sortable></el-table-column>
          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button size="mini" type="danger" plain @click="deleteRetainerTopic(row)">{{
                $t('Base.delete')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="payloadDialog" :title="'Payload'">
      <el-row v-loading="payloadLoading">
        <textarea v-model="payloadDetail" class="payload-text"></textarea>
      </el-row>
      <template #footer>
        <el-button size="small">{{ $t('Base.copy') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import {
  getRetainer,
  getRetainerList,
  updateRetainer,
  getRetainerTopic,
  delRetainerTopic,
} from '@/api/advanced'

export default defineComponent({
  name: 'Retainer',
  props: ['translate'],
  setup(props) {
    let retainerConfig = reactive({
      max_payload_size: [1, 'MB'],
      msg_clear_interval: [0, 's'],
      msg_expiry_interval: [0, 's'],
      config: {
        storage: 'ram',
        type: 'built_in_database',
        max_retained_messages: 0,
      },
      flow_control: {
        max_read_number: 0,
        msg_deliver_quota: 0,
        quota_release_interval: [0, 's'],
      },
      enable: false,
    })

    let selOptions = reactive({
      retained: 'custom',
      payload: 'KB',
      expiry: 's',
      clean: 's',
      read: 'custom',
      deliver: 'custom',
      release: 's',
    })

    let configLoading = ref(true)
    let configEnable = ref(false)
    let tbLoading = ref(true)
    let tbData = ref([])
    let payloadDialog = ref(false)
    let payloadDetail = ref('')
    let payloadLoading = ref(false)
    let retainerForm = ref(null)

    let validatorRules = [
      { required: true, message: props.translate('required'), trigger: 'blur' },
      { type: 'number', message: props.translate('needNumber'), trigger: 'blur' },
    ]

    const retainerRules = ref({
      config: {
        max_retained_messages: validatorRules,
      },
      max_payload_size: {
        0: validatorRules,
      },
      msg_expiry_interval: {
        0: validatorRules,
      },
      msg_clear_interval: {
        0: validatorRules,
      },
      flow_control: {
        max_read_number: validatorRules,
        msg_deliver_quota: validatorRules,
        quota_release_interval: {
          0: validatorRules,
        },
      },
    })

    const loadConfigData = async () => {
      configLoading.value = true
      retainerForm.value?.resetFields()
      let res = await getRetainer().catch(() => {})
      if (res) {
        Object.assign(retainerConfig, res)
        getConfigFormEnable()
        derivedOptionsFromConfig()
      } else {
      }
      configLoading.value = false
    }

    const getConfigFormEnable = () => {
      if (retainerConfig?.enable === true) {
        configEnable.value = true
      } else {
        configEnable.value = false
      }
    }

    const derivedOptionsFromConfig = () => {
      let config = retainerConfig
      if (config?.config?.max_retained_messages === 0) {
        selOptions.retained = 'unlimited'
      } else {
        selOptions.retained = 'custom'
      }
      if (config?.max_payload_size) {
        let matching = config.max_payload_size.match(/(\d+)(\w{2,})/)
        selOptions.payload = matching[2]
        config.max_payload_size = [+matching[1], matching[2]]
      }
      if (config?.msg_expiry_interval) {
        let matching = config.msg_expiry_interval.match(/(\d+)(\w)/)
        selOptions.expiry = matching[1] === '0' ? config.msg_expiry_interval : matching[2]
        config.msg_expiry_interval = [+matching[1], matching[2]]
      }
      if (config?.msg_clear_interval) {
        let matching = config.msg_clear_interval.match(/(\d+)(\w)/)
        selOptions.clean = matching[1] === '0' ? config.msg_clear_interval : matching[2]
        config.msg_clear_interval = [+matching[1], matching[2]]
      }
      if (config?.flow_control?.max_read_number === 0) {
        selOptions.read = 'unlimited'
      } else {
        selOptions.read = 'custom'
      }
      if (config?.flow_control?.msg_deliver_quota === 0) {
        selOptions.deliver = 'unlimited'
      } else {
        selOptions.deliver = 'custom'
      }
      if (config?.flow_control?.quota_release_interval) {
        let matching = config.flow_control.quota_release_interval.match(/(\d+)(\w)/)
        selOptions.release = matching[2]
        config.flow_control.quota_release_interval = [+matching[1], matching[2]]
      }
    }

    const changeSelType1 = async (event, e) => {
      console.log(event)
    }

    const composeConfigFromForm = (config) => {
      combineData(config)
      function combineData(data) {
        if (typeof data == 'object' && data !== null) {
          Object.keys(data).forEach((k) => {
            if (data[k] instanceof Array) {
              setProperDataFromForm(k, data[k])

              data[k] = data[k].join('')
            } else if (typeof data[k] == 'object' && data[k] !== null) {
              combineData(data[k])
              return
            } else {
              setProperDataFromForm(k, data[k])
            }
          })
        }
      }
    }

    const setProperDataFromForm = (key, data) => {
      if (key === 'max_retained_messages') {
        return selOptions.retained == 'unlimited' ? 0 : data
      }
      if (key === 'max_payload_size') {
        return [data[0], selOptions.payload]
      }
      if (key === 'msg_expiry_interval') {
        return selOptions.expiry === '0s' ? '0s' : [data[0], selOptions, expiry]
      }
      if (key === 'msg_clear_interval') {
        return selOptions.clean === '0s' ? '0s' : [data[0], selOptions.clean]
      }
      if (key === 'max_read_number') {
        return selOptions.read === 'unlimited' ? 0 : data
      }
      if (key === 'msg_deliver_quota') {
        return selOptions.deliver === 'unlimited' ? 0 : data
      }
      if (key === 'quota_release_interval') {
        return [data[0], selOptions.release]
      }
    }

    const updateConfigData = async function () {
      let valid = await this.$refs.retainerForm.validate().catch(() => {})
      if (!valid) return

      configLoading.value = true
      composeConfigFromForm(retainerConfig)

      let res = await updateRetainer(retainerConfig).catch(() => {})
      if (res) {
        getConfigFormEnable()
        this.$message({
          type: 'success',
          message: this.$t('Base.updateSuccess'),
        })
      } else {
        loadConfigData()
      }
      configLoading.value = false
    }

    const deleteRetainerTopic = async function (row) {
      this.$confirm(this.$t('General.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          const { topic } = row
          if (!topic) return
          let res = await delRetainerTopic(topic).catch(() => {})
          if (res) {
            loadTbData()
          } else {
          }
        })
        .catch(() => {})
    }

    const loadTbData = async () => {
      tbLoading.value = true
      let res = await getRetainerList().catch(() => {})
      if (res) {
        tbData.value = res
      }
      tbLoading.value = false
    }

    const checkPayload = async (row) => {
      payloadDialog.value = true
      payloadDetail.value = ''
      payloadLoading.value = true
      const { topic } = row
      if (!topic) return
      let res = await getRetainerTopic(topic).catch(() => {})
      if (res) {
        payloadDetail.value = res[0].payload
      }
      payloadLoading.value = false
    }

    onMounted(() => {
      loadConfigData()
      loadTbData()
    })

    const reloading = () => {
      loadConfigData()
      loadTbData()
    }

    return {
      tl: props.translate,
      retainerConfig,
      configLoading,
      tbLoading,
      tbData,
      updateConfigData,
      selOptions,
      changeSelType1,
      configEnable,
      deleteRetainerTopic,
      reloading,
      payloadDialog,
      checkPayload,
      payloadDetail,
      payloadLoading,
      retainerRules,
      retainerForm,
    }
  },
})
</script>
<style lang="scss" scoped>
.el-tab-pane {
  margin: 10px;
}
.el-form-item ::v-deep .el-form-item__content {
  margin-right: 10px;
}
.el-input-group--append ::v-deep .el-input-group__append {
  width: 120px;
  padding: 0;

  .el-select {
    margin: -10px 0;
  }
}

.payload-text {
  width: 100%;
  height: 220px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  padding: 5px;
}
</style>
