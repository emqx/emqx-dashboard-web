<template>
  <div>
    <div class="title-desc">{{ translate('eventTitleDesc') }}</div>
    <div class="section-header">
      <div>{{ translate('configMsg') }}</div>
    </div>
    <div>
      <el-row v-for="item in eventType" :key="item">
        <el-col :span="15">
          <div class="item-title">{{ `$events/${item}` }}</div>
          <div class="item-desc">{{ translate(item) }}</div>
        </el-col>
        <el-col :span="5" class="item-switch">
          <el-switch></el-switch>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'Message',
  props: ['translate'],
  setup() {
    let eventType = ref([
      'client_connected',
      'client_disconnected',
      'client_subscribed',
      'client_unsubscribed',
      'message_delivered',
      'message_dropped',
      'message_acked',
    ])

    return {
      eventType,
    }
  },
})
</script>
<style lang="scss" scoped>
.title-desc {
  color: #8d96a2;
}
.item-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
}
.item-desc {
  font-size: 14px;
  color: #5b5b5b;
  line-height: 28px;
}
.el-row {
  padding: 20px;
  border: 1px solid #eeeef7;
}
.el-row:not(:first-of-type) {
  border-top: none;
}
.item-switch > .el-switch {
  height: 50px;
}
</style>