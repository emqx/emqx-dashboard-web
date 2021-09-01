<template>
  <div class="topicMetrics app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="openAdd()">{{
        tl('addTopic')
      }}</el-button>
    </div>

    <el-table :data="topicMetricsTb" v-loading="tbLoading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="expand-header">
            {{ $t('Base.details') }}
            <el-radio-group v-model="topicQos" :prop="props" class="topic-qos-radio" size="mini">
              <el-radio-button label="all">{{ $t('Base.all') }}</el-radio-button>
              <el-radio-button label="qos0">QoS 0</el-radio-button>
              <el-radio-button label="qos1">QoS 1</el-radio-button>
              <el-radio-button label="qos2">QoS 2</el-radio-button>
            </el-radio-group>
          </div>
          <el-row class="expand-body" :gutter="20">
            <el-col :span="8">
              <div class="message-card in">
                <div>
                  {{ tl('msgIn') }}
                  <span class="message-rate">
                    {{ getCurrentTopicData('in', 'rate') + ' ' + tl('rate') }}
                  </span>
                </div>
                <div class="message-card--body">
                  {{ getCurrentTopicData('in', 'count') }}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="message-card out">
                <div>
                  {{ tl('msgOut') }}
                  <span class="message-rate">
                    {{ getCurrentTopicData('out', 'rate') + ' ' + tl('rate') }}
                  </span>
                </div>
                <div class="message-card--body">
                  {{ getCurrentTopicData('out', 'count') }}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="message-card drop">
                <div>
                  {{ tl('msgDrop') }}
                  <span class="message-rate">
                    {{
                      getCurrentTopicDropRate(currentTopic['messages.dropped.rate']) +
                      ' ' +
                      tl('rate')
                    }}
                  </span>
                </div>
                <div class="message-card--body">
                  {{ currentTopic['messages.dropped.count'] }}
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="'Topic'" prop="topic" sortable></el-table-column>
      <el-table-column :label="tl('msgIn')" sortable>
        <template #default="{ row }">
          {{ row.metrics['messages.in.count'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('msgOut')" sortable>
        <template #default="{ row }">
          {{ row.metrics['messages.out.count'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('msgDrop')" sortable>
        <template #default="{ row }">
          {{ row.metrics['messages.dropped.count'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('startTime')" sortable>
        <template #default="{ row }">
          {{ (row.reset_at && df(row.reset_at)) || (row.create_time && df(row.create_time)) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="mini">{{ $t('Base.view') }}</el-button>
          <el-button size="mini" @click="resetTopic(row)">{{ $t('Base.reset') }}</el-button>
          <el-button size="mini" type="danger" plain @click="deleteTopic(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="tl('addTopic')" :visible.sync="addVisible">
      <el-form ref="record" :model="topicInput" size="small" label-position="top">
        <el-form-item prop="topic" :label="'topic'">
          <el-input v-model="topicInput.topic"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="addVisible = false">{{
          $t('Base.cancel')
        }}</el-button>
        <el-button type="primary" size="small" @click="addTopic()">{{ $t('Base.add') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from '@vue/composition-api'
import {
  getTopicMetrics,
  addTopicMetrics,
  deleteTopicMetrics,
  resetTopicMetrics,
} from '@/api/advanced'
import { dateFormat } from '@/common/utils'

export default defineComponent({
  name: 'TopicMetrics',
  setup() {
    let addVisible = ref(false)
    let topicInput = reactive({
      topic: '',
    })
    let record = ref(null)
    let topicMetricsTb = ref([])
    let tbLoading = ref(false)

    const translate = function (key, collection = 'Tools') {
      return this.$t(collection + '.' + key)
    }

    const openAdd = () => {
      addVisible.value = true
    }

    const loadTopicMetrics = async function () {
      tbLoading.value = true
      let res = await getTopicMetrics().catch(() => {})
      if (res) {
        topicMetricsTb.value = res
      }
      tbLoading.value = false
    }

    const addTopic = async function () {
      let { topic } = topicInput
      let res = await addTopicMetrics(topic).catch(() => {})
      if (res) {
        this.$message({
          type: 'success',
          message: this.$t('Base.createSuccess'),
        })
        loadTopicMetrics()
      }
      addVisible.value = false
    }

    const deleteTopic = async function (row) {
      let confirm = await this.$confirm(this.$t('General.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).catch((e) => e)

      if (confirm !== 'confirm') return
      let { topic } = row
      let res = await deleteTopicMetrics(topic).catch(() => {})
      if (res) {
        this.$message({
          type: 'success',
          message: this.$t('Base.deleteSuccess'),
        })
        loadTopicMetrics()
      }
    }

    const resetTopic = async function (row) {
      let confirm = await this.$confirm(this.$t('General.confirmReset'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).catch((e) => e)

      if (confirm !== 'confirm') return
      let { topic } = row
      let res = await resetTopicMetrics(topic).catch(() => {})
      if (res) {
        this.$message({
          type: 'success',
          message: this.$t('Base.resetSuccess'),
        })
        loadTopicMetrics()
      }
    }

    onMounted(loadTopicMetrics)

    return {
      df: dateFormat,
      tl: translate,
      addVisible,
      openAdd,
      record,
      topicInput,
      addTopic,
      topicMetricsTb,
      tbLoading,
      deleteTopic,
      resetTopic,
    }
  },
})
</script>

<style lang="scss" scoped>
.message-card {
  height: 112px;
  border-radius: 4px;
  padding: 6px 12px;
  color: #fff;
  &.in {
    background: linear-gradient(0.25turn, #3e3ab4, #4c5ae0);
  }
  &.out {
    background: linear-gradient(0.25turn, #0c7cd1, #19bcc2);
  }
  &.drop {
    background: linear-gradient(0.25turn, #00ac70, #34c388);
  }
  .message-card--body {
    font-size: 28px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .message-rate {
    float: right;
  }
}
</style>
