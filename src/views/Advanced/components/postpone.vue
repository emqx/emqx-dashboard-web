<template>
  <div>
    <el-tabs>
      <el-tab-pane :label="tl('setting')">
        <el-row>
          <el-form>
            <el-col :span="10">
              <el-form-item :label="tl('maxDelayedMsg')">
                <el-input>
                  <el-select slot="append"></el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-button size="small" type="primary">{{ $t('Base.update') }}</el-button>
        </el-row>
        <div class="part-header">{{ tl('enable') }}</div>

        <el-row>
          <el-col :span="13">{{ tl('enableDescDelay') }}</el-col>
          <el-col :span="6">
            <el-switch></el-switch>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="tl('dataManage')">
        <el-table>
          <el-table-column :label="'Topic'"></el-table-column>
          <el-table-column :label="'QoS'"></el-table-column>
          <el-table-column :label="'Payload'">
            <template></template>
          </el-table-column>
          <el-table-column :label="'From ClientID'"></el-table-column>
          <el-table-column :label="tl('delayedTime')"></el-table-column>
          <el-table-column :label="tl('remainTime')"></el-table-column>

          <el-table-column :label="$t('Base.operation')">
            <template #default="{}">
              <el-button size="mini" type="danger" plain>{{ $t('Base.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Postpone',
  props: ['translate'],

  setup(props) {
    return {
      tl: props.translate,
    }
  },
})
</script>
<style lang="scss" scoped>
</style>