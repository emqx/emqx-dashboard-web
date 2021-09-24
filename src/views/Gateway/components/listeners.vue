<template>
  <div>
    <div class="section-header" v-if="!showIntegration">
      <div></div>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog()">
        {{ tl('addListener') }}
      </el-button>
    </div>
    <el-table :data="listenerTable">
      <el-table-column :label="'ID'"></el-table-column>
      <el-table-column :label="tl('lType')"></el-table-column>
      <el-table-column :label="tl('lAddress')"></el-table-column>
      <el-table-column label="Acceptors"></el-table-column>
      <el-table-column :label="tl('lMaxConn')"></el-table-column>
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
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('lType')">
              <el-select>
                <el-option :value="'tcp'"></el-option>
                <el-option :value="'ssl'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('lAddress')">
              <el-input></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="part-header">{{ tl('listenerSetting') }}</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('Base.enable') + ' Proxy Protocol'">
              <el-select>
                <el-option value="True" label="True"></el-option>
                <el-option value="False" label="False"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Acceptors'">
              <el-input></el-input>
            </el-form-item>
          </el-col>
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
import { defineComponent, onMounted, ref } from '@vue/composition-api'
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
    let addListenerDialog = ref(false)
    let listenerTable = ref([])

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
