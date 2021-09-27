<template>
  <div>
    <el-form>
      <div class="part-header">
        {{ tl('basic') }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('connectionRequire')">
            <el-select v-model="cValue.connection_required">
              <el-option value="true"></el-option>
              <el-option value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('notifyType')">
            <el-select v-model="cValue.notify_type">
              <el-option value="qos"></el-option>
              <el-option value="con"></el-option>
              <el-option value="non"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('heartbeat')">
            <el-input v-model="cValue.heartbeat[0]" :placeholder="cValueDefault.heartbeat[0]">
              <el-select slot="append" v-model="cValue.heartbeat[1]">
                <el-option value="s"></el-option>
              </el-select>
            </el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="cValue.enable_stats">
              <el-option value="true"></el-option>
              <el-option value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('subQos')">
            <el-select v-model="cValue.subscribe_qos">
              <el-option value="coap"></el-option>
              <el-option value="0"></el-option>
              <el-option value="1"></el-option>
              <el-option value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('pubQos')">
            <el-select v-model="cValue.publish_qos">
              <el-option value="coap"></el-option>
              <el-option value="0"></el-option>
              <el-option value="1"></el-option>
              <el-option value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('mountSetting') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'CoapBasic',
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, context) {
    let cValueDefault = {
      connection_required: false,
      heartbeat: [30, 's'],
      notify_type: 'qos',
      enable_stats: true,

      subscribe_qos: 'coap',
      publish_qos: 'coap',
      mountpoint: '',
    }
    let cValue = reactive({ ...cValueDefault, ...props.value })
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    watch(
      () => ({ ...cValue }),
      (v) => {
        context.emit('update:value', v)
      },
    )

    return {
      tl,
      cValueDefault,
      cValue,
    }
  },
})
</script>

<style lang="scss" scoped></style>
