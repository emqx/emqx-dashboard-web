<template>
  <div>
    <el-tabs>
      <el-tab-pane :label="tl('setting')" v-loading="configPending">
        <el-row>
          <el-form
            ref="delayedForm"
            :rules="delayedRules"
            :model="delayedConfig"
            :disabled="!configEnable"
          >
            <el-col :span="10">
              <el-form-item :label="tl('maxDelayedMsg')" prop="max_delayed_messages">
                <el-input
                  v-model.number="delayedConfig.max_delayed_messages"
                  :readonly="delayedOption == 'unlimited'"
                >
                  <el-select slot="append" v-model="delayedOption">
                    <el-option value="unlimited" :label="tl('unlimited')"></el-option>
                    <el-option value="custom" :label="tl('custom')"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-button size="small" type="primary" @click="updateDelayedConfig()">{{
            $t('Base.update')
          }}</el-button>
        </el-row>
        <div class="part-header">{{ tl('enable') }}</div>

        <el-row>
          <el-col :span="13">{{ tl('enableDescDelay') }}</el-col>
          <el-col :span="6">
            <el-switch v-model="delayedConfig.enable" @change="updateDelayedConfig()"></el-switch>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="tl('dataManage')" v-loading="tbLoading">
        <el-table :data="delayedTbData">
          <el-table-column :label="'Topic'" prop="topic" sortable></el-table-column>
          <el-table-column :label="'QoS'" prop="qos" sortable></el-table-column>
          <el-table-column :label="'Payload'">
            <template #default="{ row }">
              <el-button size="mini" @click="checkPayload(row)">{{ tl('openPayload') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="'From ClientID'" prop="from_clientid" sortable></el-table-column>
          <el-table-column
            :label="tl('delayedTime')"
            prop="delayed_interval"
            sortable
          ></el-table-column>
          <el-table-column
            :label="tl('remainTime')"
            prop="delayed_remaining"
            sortable
          ></el-table-column>
          <el-table-column :label="tl('publishTime')" sortable>
            <template #default="{ row }">
              {{ row.publish_at && dateFormat(row.publish_at) }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button size="mini" type="danger" plain @click="deleteDelayedInfo(row)">{{
                $t('Base.delete')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="emq-table-footer">
          <common-pagination :count="tbCount" :reload-func="loadDelayedList"></common-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="payloadDialog" :title="'Payload'">
      <el-row v-loading="payloadLoading">
        <textarea v-model="payloadDetail" class="payload-text" readonly></textarea>
      </el-row>
      <template #footer>
        <span v-if="isCopyShow" class="payload-copied">{{ $t('Base.copied') }}</span>

        <el-button
          size="small"
          v-clipboard:copy="payloadDetail"
          v-clipboard:success="copySuccess"
          >{{ $t('Base.copy') }}</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, watch } from '@vue/composition-api'
import {
  getDelayedConfig,
  editDelayedConfig,
  getDelayedList,
  getDelayedInfo,
  delDelayedInfo,
} from '@/api/advanced'
import CommonPagination from '@/components/commonPagination.vue'
import { dateFormat } from '@/common/utils'

export default defineComponent({
  name: 'Postpone',
  props: ['translate'],
  components: {
    CommonPagination,
  },
  setup(props) {
    let delayedConfig = reactive({
      enable: false,
      max_delayed_messages: 0,
    })
    let delayedTbData = ref([])
    let configPending = ref(true)
    let tbLoading = ref(false)
    let configEnable = ref(false)
    let tbCount = ref(0)

    let delayedOption = ref('custom')
    let delayedForm = ref(null)
    let delayedRules = {
      max_delayed_messages: [
        { required: true, message: props.translate('required'), trigger: 'blur' },
        { type: 'number', message: props.translate('needNumber'), trigger: 'blur' },
      ],
    }
    let payloadDialog = ref(false)
    let payloadLoading = ref(false)
    let payloadDetail = ref('')
    let isCopyShow = ref(false)

    watch(delayedOption, (newOption) => {
      if (newOption == 'unlimited') {
        delayedConfig.max_delayed_messages = 0
      }
    })

    const getDelayedOption = () => {
      if (delayedConfig?.max_delayed_messages == 0) {
        return 'unlimited'
      } else {
        return 'custom'
      }
    }
    const getConfigFormEnable = () => {
      if (delayedConfig?.enable === true) {
        configEnable.value = true
      } else {
        configEnable.value = false
      }
    }

    const loadDelayedConfig = async () => {
      configPending.value = true
      delayedForm.value?.resetFields()

      let res = await getDelayedConfig().catch(() => {})
      if (res) {
        Object.assign(delayedConfig, res)
        getConfigFormEnable()
        delayedOption.value = getDelayedOption()
      }
      configPending.value = false
    }

    const loadDelayedList = async () => {
      tbLoading.value = true
      let res = await getDelayedList().catch(() => {})
      if (res) {
        delayedTbData.value = res.data
        tbCount.value = res.meta?.count
      }
      tbLoading.value = false
    }

    const deleteDelayedInfo = async function (row) {
      this.$confirm(this.$t('General.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          const { msgid } = row
          if (!msgid) return
          let res = await delDelayedInfo(id).catch(() => {})
          if (res) {
            loadDelayedList()
          } else {
          }
        })
        .catch(() => {})
    }

    // const dateFormat = (date) => {
    //   return moment(date).format('YYYY-MM-DD HH:mm:ss')
    // }

    const checkPayload = async function (row) {
      payloadDialog.value = true
      payloadLoading.value = true
      payloadDetail.value = ''
      const { topic } = row
      let res = await getDelayedInfo(topic).catch(() => {})
      if (res) {
        payloadDetail.value = res?.payload
      } else {
      }
      payloadLoading.value = false
    }

    const updateDelayedConfig = async function () {
      let valid = await delayedForm.value?.validate().catch(() => {})
      if (!valid) return
      configPending.value = true
      let res = await editDelayedConfig(delayedConfig).catch(() => {})
      if (res) {
        getConfigFormEnable()
        this.$message({
          type: 'success',
          message: this.$t('Base.updateSuccess'),
        })
      } else {
        loadDelayedConfig()
      }
      configPending.value = false
    }

    onMounted(() => {
      loadDelayedConfig()
      loadDelayedList()
    })

    const reloading = () => {
      loadDelayedList()
      loadDelayedConfig()
    }

    let copyShowTimeout = ref(null)
    const copySuccess = () => {
      isCopyShow.value = true
      clearTimeout(copyShowTimeout)
      copyShowTimeout = setTimeout(() => {
        isCopyShow.value = false
      }, 2000)
    }

    return {
      tl: props.translate,
      delayedTbData,
      delayedConfig,
      updateDelayedConfig,
      configPending,
      deleteDelayedInfo,
      delayedOption,
      reloading,
      tbLoading,
      delayedForm,
      delayedRules,
      configEnable,
      tbCount,
      loadDelayedList,
      checkPayload,
      payloadDialog,
      payloadLoading,
      payloadDetail,
      dateFormat,
      isCopyShow,
      copySuccess,
    }
  },
})
</script>
<style lang="scss" scoped>
.el-form-item ::v-deep .el-form-item__content {
  margin-right: 10px;
}
.el-input-group--append ::v-deep .el-input-group__append {
  width: 110px;
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

.payload-copied {
  padding-right: 10px;
}
</style>
