<template>
  <div class="app-wrapper gateway">
    <el-table :data="tbData" v-loading="tbLoading">
      <el-table-column :label="tl('name')">
        <template #default="{ row }">
          <span :class="`g-${row.name} g-icon`"></span>
          <span class="g-title">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('status')">
        <template #default="{ row }">
          <span>{{ row.status == 'running' ? tl('running') : tl('stopped') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('connection')">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.current_connections}/${row.max_connections}`"
          >
            <el-progress
              :stroke-width="16"
              :percentage="calcPercentage(row.current_connections, row.max_connections)"
              :format="() => {}"
            ></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="tl('listener')" width="80">
        <template #default="{ row }">
          {{ row.listeners.length || 0 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template slot-scope="scope">
          <el-button size="mini">{{ tl('setting') }}</el-button>
          <el-button size="mini">{{ tl('auth') }}</el-button>
          <el-dropdown
            size="small"
            placement="bottom-start"
            @visible-change="dropdownVChange(scope.row)"
          >
            <el-button size="mini"
              >{{ tl('more')
              }}<i
                :class="[
                  'iconfont',
                  !scope.row[dropdownExclusiveKey] ? 'el-icon-caret-bottom' : 'el-icon-caret-top',
                ]"
              ></i
            ></el-button>
            <el-dropdown-menu slot="dropdown" class="no-dropdown-arrow">
              <el-dropdown-item>{{ tl('clients') }}</el-dropdown-item>
              <el-dropdown-item>{{
                isRunning(scope.row.status) ? tl('disable') : tl('enable')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { getGatewayList } from '@/api/gateway'
import { calcPercentage, caseInsensitiveCompare } from '@/common/utils'

export default defineComponent({
  name: 'Gateway',
  setup() {
    let tbData = ref([])
    let tbLoading = ref(false)
    let dropdownExclusiveKey = '_drop'

    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    const isRunning = (status) => {
      return caseInsensitiveCompare(status, 'running')
    }

    const loadGateway = async () => {
      tbLoading.value = true
      let res = await getGatewayList().catch(() => {})
      if (res) {
        let pendingData = []
        Array.prototype.forEach.call(res, (v) => {
          pendingData.push({ ...v, ...{ [dropdownExclusiveKey]: false } })
        })
        tbData.value = pendingData
      } else {
        tbData.value = []
      }
      tbLoading.value = false
    }

    const dropdownVChange = (row) => {
      return Object.assign(row, { [dropdownExclusiveKey]: !row[dropdownExclusiveKey] })
    }

    onMounted(loadGateway)

    return {
      tl,
      tbLoading,
      tbData,
      calcPercentage,
      isRunning,
      dropdownVChange,
      dropdownExclusiveKey,
    }
  },
})
</script>

<style lang="scss" scoped>
.g-icon::before {
  width: 60px;
  height: 60px;
  content: '';
  display: inline-block;
  background-size: contain;
}
.g-title {
  vertical-align: 23px;
  padding: 0 5px;
}
::v-deep .el-popper .popper_arrow {
  display: none;
}
</style>
