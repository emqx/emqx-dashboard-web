<template>
  <el-dialog
    width="700px"
    custom-class="gcp-device-dialog"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :title="editedDevice ? $t('Modules.editDevice') : $t('Modules.addDevice')"
  >
    <div>
      <el-form ref="recordForm" size="small" :model="device" :rules="rules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('Modules.deviceId')" prop="deviceid">
              <el-input v-model="device.deviceid" :disabled="!!editedDevice" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <div slot="label">
                <label>{{ $t('Modules.devicePublicKey') }}</label>
                <p class="pub-key-tip">{{ $t('Modules.devicePublicKeyTip') }}</p>
              </div>
              <el-button
                class="btn-add"
                icon="el-icon-plus"
                size="small"
                @click="showKeyDialog"
                :disabled="device.keys.length >= 3"
              >
                {{ $t('Base.add') }}
              </el-button>
              <el-table :data="device.keys" class="data-list">
                <el-table-column prop="key_type" :label="$t('Modules.format')" width="160px" />
                <el-table-column prop="key" :label="$t('Modules.publicKey')" width="230px">
                  <template slot-scope="{ row }"> {{ cutKeyToShow(row.key) }} </template>
                </el-table-column>
                <el-table-column prop="expires_at" :label="$t('General.expireAt')">
                  <template slot-scope="{ row }"> {{ formatterExpireAt(row.expires_at) }} </template>
                </el-table-column>
                <el-table-column width="80px">
                  <template slot-scope="{ $index }">
                    <el-button type="dashed danger" size="mini" @click="deleteKey($index)">
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
    <PubKeyDialog v-model="isPubKeyDialogShow" @save="addPubKey" />
  </el-dialog>
</template>

<script>
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { createDevice, updateDevice } from '@/api/modules.js'
import PubKeyDialog from './PubKeyDialog.vue'

const keyBeginningReg = /^(\n)*-----(\w|\s)+-----\n/
const keyEndingReg = /\n-----(\w|\s)+-----(\n)*$/
const cutKeyToShow = (key) => {
  const beginning = key.replace(keyBeginningReg, '').slice(0, 10)
  const ending = key.replace(keyEndingReg, '').slice(-10)
  return `${beginning}....${ending}`
}

const createRawDevice = () => ({
  deviceid: '',
  keys: [],
  registry: '',
  location: '',
  project: '',
})

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
      device: createRawDevice(),
      rules: {
        deviceid: { required: true, message: this.$t('Tools.pleaseEnter') },
      },
      isPubKeyDialogShow: false,
      isSubmitting: false,
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
  watch: {
    async dialogVisible(val) {
      if (val) {
        if (this.editedDevice) {
          this.device = cloneDeep(this.editedDevice)
        } else {
          this.device = createRawDevice()
          this.$nextTick(() => {
            this.$refs.recordForm.clearValidate()
          })
        }
      }
    },
  },
  methods: {
    cutKeyToShow,
    showKeyDialog() {
      if (this.device.keys.length >= 3) {
        return
      }
      this.isPubKeyDialogShow = true
    },
    addPubKey(keyData) {
      this.device.keys.push(keyData)
    },
    formatterExpireAt(expireAt) {
      if (!expireAt || typeof expireAt !== 'number') {
        return this.$t('General.neverExpire')
      }
      return moment(expireAt * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    async deleteKey(index) {
      try {
        await this.$msgbox.confirm(this.$t('General.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        this.device.keys.splice(index, 1)
      } catch (error) {
        //
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },
    getDataForSubmit() {
      const data = cloneDeep(this.device)
      data.keys.forEach((item) => {
        if (!item.expires_at) {
          Reflect.deleteProperty(item, 'expires_at')
        } else {
          item.expires_at = Math.floor(item.expires_at / 1000)
        }
      })

      return data
    },
    requestAddDevice() {
      return createDevice([this.getDataForSubmit()])
    },
    requestUpdateDevice() {
      return updateDevice(this.editedDevice.deviceid, this.getDataForSubmit())
    },
    async save() {
      try {
        await this.$refs.recordForm.validate()
        this.isSubmitting = true
        if (this.editedDevice) {
          await this.requestUpdateDevice()
        } else {
          await this.requestAddDevice()
        }
        this.$message.success(this.$t('Base.addedSuccessfully'))
        this.dialogVisible = false
        this.$emit('submitted')
      } catch (error) {
        //
      } finally {
        this.isSubmitting = false
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
