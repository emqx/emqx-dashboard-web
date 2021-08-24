<template>
  <div>
    <el-tabs>
      <el-tab-pane :label="tl('setting')">
        <div class="part-header">{{ tl('storage') }}</div>
        <el-form>
          <el-row>
            <el-col :span="16">
              <el-form-item :label="tl('storageType')">
                <el-select></el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item :label="tl('storage')">
                <el-select></el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="part-header">{{ tl('policy') }}</div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Max Retained Messages">
                <el-input>
                  <el-select slot="append" v-model="rMsgSel">
                    <el-option
                      v-for="item in rMsgOptions"
                      :key="item.key"
                      :value="item.key"
                      :label="tl(`${item.label}`)"
                    ></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Max Payload Size">
                <el-input>
                  <el-select slot="append" v-model="payLoadSel">
                    <el-option v-for="item in payloadOptions" :key="item.key" :value="item.key" :label="item.label"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="tl('expire')">
                <el-input>
                  <el-select slot="append"></el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="tl('intervalClean')">
                <el-input>
                  <el-select slot="append"></el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="part-header">{{ tl('flowControl') }}</div>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="tl('readNumber')">
                <el-input>
                  <el-select slot="append"></el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="tl('deliverQuota')">
                <el-input>
                  <el-select slot="append"></el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button size="small" type="primary">{{ $t('Base.update') }}</el-button>
          </el-row>
        </el-form>
        <div class="part-header">{{ tl('enable') }}</div>
        <el-row>
          <el-col :span="13">{{ tl('enableDesc') }}</el-col>
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
          <el-table-column :label="tl('createDate')"></el-table-column>
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
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'Retainer',
  props: ['translate'],
  setup(props) {
    const rMsgOptions = ref([
      { key: 0, disabled: true, label: 'unlimited' },
      { key: 1, disabled: false, label: 'custom' },
    ])

    const payloadOptions = ref([
      { key: 'KB', label: 'KB' },
      { key: 'MB', label: 'MB' },
    ])

    const rMsgSel = 0
    const payLoadSel = 'KB'

    return {
      tl: props.translate,
      rMsgSel,
      rMsgOptions,
      payloadOptions,
      payLoadSel,
    }
  },
})
</script>
<style lang="scss" scoped>
.el-tab-pane {
  margin: 10px;
}
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
