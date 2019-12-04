<template>
  <el-row :gutter="20" class="config-form">

    <el-form
      ref="record"
      class="basic-config-form"
      size="small"
      label-suffix=":"
      label-width="225px"
      label-position="left"
      :model="record"
      :rules="rules"
    >
      <div
        v-for="(key, index) in recordKeys"
        :key="index"
      >
        <el-col
          :span="12"
        >
          <el-form-item :label="key" :prop="key">

            <template v-if="deepRecord[key] === 'true' || deepRecord[key] === 'false'">
              <emq-select
                v-model="record[key]"
                :field="{ options: boolOptions }"
              >
              </emq-select>
            </template>

            <template v-else-if="deepRecord[key] === 'allow' || deepRecord[key] === 'deny'">
              <emq-select
                v-model="record[key]"
                :field="{ options: permitOptions }"
              >
              </emq-select>
            </template>

            <template v-else-if="deepRecord[key] === 'ignore' || deepRecord[key] === 'disconnect'">
              <emq-select
                v-model="record[key]"
                :field="{ options: actionOptions }"
              >
              </emq-select>
            </template>

            <template v-else-if="deepRecord[key] === 'on' || deepRecord[key] === 'off'">
              <emq-select
                v-model="record[key]"
                :field="{ options: enableOptions }"
              >
              </emq-select>
            </template>

            <template v-else-if="deepRecord[key] === 'highest' || deepRecord[key] === 'lowest'">
              <emq-select
                v-model="record[key]"
                :field="{ options: priorityOptions }"
              >
              </emq-select>
            </template>

            <template v-else-if="key === 'max_qos_allowed' || key === 'mqtt_max_qos_allowed'">
              <emq-select
                v-model="record[key]"
                :field="{ options: qosOptions }"
              >
              </emq-select>
            </template>

            <template v-else>
              <el-input
                v-model="record[key]"
                class="form-item-input"
                :placeholder="record[key]"
              >
              </el-input>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item-desc">
          {{ $t(`Settings.${key}`) }}
        </el-col>
      </div>
    </el-form>

    <el-col class="button-group__center" :span="24">
      <el-button plain :disabled="cancelDisabled" type="default" size="medium" @click="cancel">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button :loading="btnLoading" type="primary" size="medium" @click="save">
        {{ $t('Base.apply') }}
      </el-button>
    </el-col>
  </el-row>
</template>


<script>
export default {
  name: 'ConfigForm',

  props: {
    record: {
      type: Object,
      requried: true,
      default: () => ({}),
    },
    rules: {
      type: Object,
      requried: true,
      default: () => ({}),
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
    cancelDisabled: {
      type: Boolean,
      default: false,
    },
    cancel: {
      type: Function,
      default: () => {},
    },
    boolOptions: {
      type: Array,
      default: () => [],
    },
    permitOptions: {
      type: Array,
      default: () => [],
    },
    actionOptions: {
      type: Array,
      default: () => [],
    },
    enableOptions: {
      type: Array,
      default: () => [],
    },
    priorityOptions: {
      type: Array,
      default: () => [],
    },
    qosOptions: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      deepRecord: JSON.parse(JSON.stringify(this.record)),
    }
  },

  computed: {
    recordKeys() {
      return Object.keys(this.record)
    },
  },

  methods: {
    async save() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      this.$emit('update', this.record)
    },
  },
}
</script>
