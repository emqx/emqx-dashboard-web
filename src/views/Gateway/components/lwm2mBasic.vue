<template>
  <div>
    <el-form>
      <div class="part-header">
        {{ tl('basic') }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('resDirectory')">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('qmodewindow')">
            <el-input>
              <el-select slot="append">
                <el-option value="s"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('minLifetime')">
            <el-input>
              <el-select slot="append">
                <el-option value="s"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxLifetime')">
            <el-input>
              <el-select slot="append">
                <el-option value="s"></el-option>
              </el-select> </el-input
          ></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('aObserve')">
            <el-select>
              <el-option value="true"></el-option>
              <el-option value="false"></el-option> </el-select
          ></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('updateStrategy')">
            <el-select>
              <el-option value="always"></el-option>
              <el-option value="contains_object_list"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select>
              <el-option value="true"></el-option>
              <el-option value="false"></el-option>
            </el-select> </el-form-item></el-col
        ><el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <el-input>
              <el-select slot="append">
                <el-option value="s"></el-option>
              </el-select>
            </el-input>
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
        <el-col :span="12">
          <el-form-item :label="tl('trCommand')"> <el-input></el-input></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('trResponse')"><el-input></el-input></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('trNotify')"><el-input></el-input></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('trRegister')"><el-input></el-input></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('trUpdate')"><el-input></el-input></el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Lwm2mBasic',
  value: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  setup(props, context) {
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    return {
      tl,
    }
  },
})
</script>

<style lang="scss" scoped></style>
