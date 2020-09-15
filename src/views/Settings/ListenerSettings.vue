<template>
  <a-card class="listener-settings emq-list-card">
    <div class="emq-title listener-title">{{ $t('Settings.listenerTitle') }}</div>
    <el-button type="primary" size="small" icon="el-icon-plus" class="create-btn">
      {{ $t('Base.create') }}
    </el-button>
    <el-table :data="tableData" class="data-list">
      <el-table-column prop="protocol" :label="$t('Settings.listenerProtocol')"></el-table-column>
      <el-table-column prop="zone" :label="$t('Settings.zone')"></el-table-column>
      <el-table-column prop="address" :label="$t('Settings.listenerAddr')"></el-table-column>
      <el-table-column prop="acceptors" :label="$t('Settings.acceptors')"></el-table-column>
      <el-table-column prop="maxConnection" :label="$t('Settings.maxConnection')"></el-table-column>
      <el-table-column>
        <template slot-scope="{ row }">
          <el-button type="dashed danger" size="mini" @click="deleteListener(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog @open="loadConfigList" :visible.sync="listenerDialogVisible" title="创建" width="520px">
      <el-form ref="record" :model="record" :rules="rules" size="small" label-position="top">
        <el-row class="config-item-wrapper" :gutter="20">
          <div v-if="configLoading" class="params-loading-wrapper">
            <a-skeleton active></a-skeleton>
          </div>
          <template v-else-if="showConfigList.length > 0">
            <div v-for="(item, i) in showConfigList" :key="i">
              <el-col :span="item.type === 'textarea' || item.type === 'object' ? 24 : 12">
                <el-form-item v-bind="item.formItemAttributes">
                  <template v-if="item.formItemAttributes.description" slot="label">
                    {{ item.formItemAttributes.label }}
                    <el-popover width="220" trigger="hover" placement="top">
                      <div class="emq-popover-content" v-html="item.formItemAttributes.description"></div>
                      <i slot="reference" class="el-icon-question"></i>
                    </el-popover>
                  </template>
                  <template v-if="item.elType === 'object'">
                    <key-and-value-editor v-model="record.config[item.key]"></key-and-value-editor>
                  </template>
                  <template v-else-if="item.elType === 'file'">
                    <file-editor v-model="record.config[item.key]"></file-editor>
                  </template>
                  <!-- input -->
                  <template v-else-if="item.elType !== 'select'">
                    <el-input
                      v-if="item.type === 'number'"
                      v-model.number="record.config[item.key]"
                      v-bind="item.bindAttributes"
                    >
                    </el-input>
                    <el-input v-else v-model="record.config[item.key]" v-bind="item.bindAttributes"> </el-input>
                  </template>
                  <!-- select -->
                  <template v-else>
                    <emq-select
                      v-if="item.type === 'number'"
                      v-model.number="record.config[item.key]"
                      v-bind="item.bindAttributes"
                      class="reset-width"
                    >
                    </emq-select>
                    <emq-select
                      v-else
                      v-model="record.config[item.key]"
                      v-bind="item.bindAttributes"
                      class="reset-width"
                    >
                    </emq-select>
                  </template>
                </el-form-item>
              </el-col>
            </div>
          </template>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button size="small" @click="handleCancel">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button class="dialog-primary-btn" type="primary" size="small" @click="handleCreate">
          {{ $t('Base.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </a-card>
</template>

<script>
import KeyAndValueEditor from '@/components/KeyAndValueEditor'
import FileEditor from '@/components/FileEditor'

export default {
  name: 'ListenerSettings',

  components: {
    KeyAndValueEditor,
    FileEditor,
  },

  data() {
    return {
      tableData: [],
      listenerDialogVisible: false,
      record: {
        config: {},
      },
      rules: {
        config: {},
      },
      configLoading: false,
      showConfigList: [],
    }
  },

  methods: {
    deleteListener() {},
    loadConfigList() {},
    handleCancel() {
      setTimeout(() => {
        this.$refs.record.clearValidate()
        this.listenerDialogVisible = false
      }, 10)
    },
    handleCreate() {},
  },
}
</script>

<style lang="scss">
.listener-settings {
  .listener-title {
    margin: 0;
  }

  .create-btn {
    margin: 15px 0 20px;
  }
}
</style>
