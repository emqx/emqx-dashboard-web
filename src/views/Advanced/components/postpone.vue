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
                <el-input v-model="delayedConfig.max_delayed_messages">
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
          <el-table-column :label="tl('publishTime')" prop="publish_at" sortable></el-table-column>

          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button size="mini" type="danger" plain @click="deleteDelayedInfo(row)">{{
                $t('Base.delete')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import {
  getDelayedConfig,
  editDelayedConfig,
  getDelayedList,
  getDelayedInfo,
  delDelayedInfo,
} from '@/api/advanced'

export default defineComponent({
  name: 'Postpone',
  props: ['translate'],

  setup(props) {
    let delayedConfig = reactive({
      enable: false,
      max_delayed_messages: 0,
    })
    let delayedTbData = ref([])
    let configPending = ref(true)
    let tbLoading = ref(false)
    let configEnable = ref(false)

    let delayedOption = ref('custom')
    let delayedForm = ref(null)
    let delayedRules = {
      max_delayed_messages: [
        { required: true, message: props.translate('required'), trigger: 'blur' },
        { type: 'number', message: props.translate('needNumber'), trigger: 'blur' },
      ],
    }

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
      }
      tbLoading.value = false
    }

    const deleteDelayedInfo = async function (row) {
      this.$confirm(this.$t('General.confirmDeleteUser'), {
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

    const updateDelayedConfig = async function () {
      let valid = await delayedForm.value?.validate().catch(() => {})
      if (!valid) return
      configPending.value = true
      let res = await editDelayedConfig(delayedConfig).catch(() => {})
      if (res) {
        getConfigFormEnable()
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
    }
  },
})
</script>
<style lang="scss" scoped>
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
</style>
