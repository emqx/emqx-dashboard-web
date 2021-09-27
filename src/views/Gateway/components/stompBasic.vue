<template>
  <div>
    <el-form>
      <div class="part-header">
        {{ tl('basic') }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('maxHeader')">
            <el-input
              v-model="sValue.max_headers"
              :placeholder="sValueDefault.max_headers"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxHeaderLen')">
            <el-input
              v-model="sValue.max_headers_length"
              :placeholder="sValueDefault.max_headers_length"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxBodyLen')">
            <el-input
              v-model="sValue.max_body_length"
              :placeholder="sValueDefault.max_body_length"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <el-input v-model="sValue.idle_timeout[0]" :placeholder="sValueDefault.idle_timeout[0]">
              <el-select slot="append" v-model="sValueDefault.idle_timeout[1]">
                <el-option value="s"></el-option>
              </el-select>
            </el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="sValue.enable_stats">
              <el-option value="true"></el-option>
              <el-option value="false"></el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <div class="part-header">{{ tl('mountSetting') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input
              v-model="sValue.mountpoint"
              :placeholder="sValueDefault.mountpoint"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'StompBasic',
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, context) {
    let sValueDefault = {
      max_headers: 10,
      max_headers_length: 1024,
      max_body_length: 8192,
      idle_timeout: [30, 's'],
      enable_stats: true,
      mountpoint: '',
    }
    let sValue = reactive(Object.assign({}, sValueDefault, props.value))
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }
    watch(
      () => ({ ...sValue }),
      (v) => {
        context.emit('update:value', v)
      },
    )
    return {
      tl,
      idleTimeUnit: 's',
      sValue,
      sValueDefault,
    }
  },
})
</script>
<style lang="scss" scoped>
.part-header {
  margin-bottom: 20px;
}
</style>
