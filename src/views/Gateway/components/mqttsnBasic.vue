<template>
  <div>
    <el-form>
      <div class="part-header">
        {{ tl('basic') }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="'Gateway ID'">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('broadcast')">
            <el-select></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('qos3')">
            <el-select></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <el-input>
              <el-select slot="append">
                <el-option value="s"></el-option>
              </el-select>
            </el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select>
              <el-option value="true"></el-option>
              <el-option value="false"></el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <div class="part-header">
        {{ tl('predefinedTopic') }}
      </div>
      <topic-edit-list :list.sync="topicList"></topic-edit-list>
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
import { defineComponent, ref } from '@vue/composition-api'
import topicEditList from './topicEditList.vue'

export default defineComponent({
  components: { topicEditList },
  name: 'MqttsnBasic',
  setup() {
    let topicList = ref([])
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    return {
      tl,
      topicList,
    }
  },
})
</script>

<style lang="scss" scoped>
.part-header {
  margin-bottom: 20px;
}
</style>
