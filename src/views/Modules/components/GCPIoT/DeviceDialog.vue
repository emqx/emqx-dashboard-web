<template>
  <el-dialog
    width="700px"
    custom-class="gcp-device-dialog"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :title="editedDevice ? $t('Modules.addDevice') : $t('Modules.editDevice')"
  >
    <div>
      <el-form ref="recordForm" size="small" :model="device" :rules="rules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('Modules.deviceId')" prop="deviceid">
              <el-input v-model="device.deviceid" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <div slot="label">
                <label>{{ $t('Modules.devicePublicKey') }}</label>
                <p class="pub-key-tip">{{ $t('Modules.devicePublicKeyTip') }}</p>
              </div>
              <el-button class="btn-add" icon="el-icon-plus" size="small" @click="addPubKey">
                {{ $t('Base.add') }}
              </el-button>
              <el-table :data="keyList" class="data-list">
                <el-table-column prop="topic" :label="$t('Modules.format')" />
                <el-table-column prop="topic" :label="$t('Modules.publicKey')" />
                <el-table-column prop="topic" :label="$t('General.expireAt')" />
                <el-table-column width="120px">
                  <template slot-scope="{ row }">
                    <el-button type="dashed danger" size="mini" @click="deleteKey(row)">
                      {{ $t('Base.delete') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Modules.registry')" prop="registry">
              <el-input v-model="device.registry" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Modules.region')" prop="location">
              <el-input v-model="device.location" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Modules.project')" prop="project">
              <el-input v-model="device.project" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-align-footer">
      <el-button plain size="small" @click="closeDialog">{{ $t('Base.cancel') }}</el-button>
      <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
    </div>
    <PubKeyDialog v-model="isPubKeyDialogShow" />
  </el-dialog>
</template>

<script>
import { createDevice } from '@/api/modules.js'
import PubKeyDialog from './PubKeyDialog.vue'

export default {
  components: { PubKeyDialog },
  props: {
    value: {
      type: Boolean,
    },
    editedDevice: {
      type: Object,
    },
  },
  data() {
    return {
      device: {
        key: '',
        key_type: '',
        expires_at: '',
        project: '',
        location: '',
        registry: '',
        deviceid: '123',
      },
      rules: {
        deviceid: {
          required: true,
        },
      },
      keyList: [],
      isPubKeyDialogShow: false,
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },

  methods: {
    addPubKey() {
      this.isPubKeyDialogShow = true
    },
    deleteKey() {},
    closeDialog() {
      this.dialogVisible = false
    },
    async save() {
      try {
        this.$refs.recordForm.validate()
        createDevice(this.device)
      } catch (error) {
        //
      }
    },
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        // TODO:
      }
    },
  },
}
</script>

<style lang="scss">
.gcp-device-dialog {
  .pub-key-tip {
    opacity: 0.7;
    margin-bottom: 4px;
  }
  .btn-add {
    margin-bottom: 12px;
  }
}
</style>
