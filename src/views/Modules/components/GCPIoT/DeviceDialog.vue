<template>
  <el-dialog custom-class="gcp-device-dialog" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <div>
      <el-form ref="recordForm" size="small" :model="device" :rules="rules">
        <el-form-item :label="$t('Modules.deviceId')" prop="deviceid">
          <el-input v-model="device.deviceid" />
        </el-form-item>
        <el-form-item prop="deviceid">
          <div slot="label">
            <label>{{ $t('Modules.devicePublicKey') }}</label>
            <p>{{ $t('Modules.devicePublicKeyTip') }}</p>
          </div>
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
        <el-form-item :label="$t('Modules.registry')" prop="registry">
          <el-input v-model="device.registry" />
        </el-form-item>
        <el-form-item :label="$t('Modules.region')" prop="location">
          <el-input v-model="device.location" />
        </el-form-item>
        <el-form-item :label="$t('Modules.project')" prop="project">
          <el-input v-model="device.project" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-align-footer">
      <el-button plain size="small" @click="closeDialog">{{ $t('Base.cancel') }}</el-button>
      <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createDevice } from '@/api/modules.js'

export default {
  components: {},
  props: {
    value: {
      type: Boolean,
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
}
</script>
