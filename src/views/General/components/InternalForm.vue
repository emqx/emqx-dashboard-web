<template>
  <el-row :gutter="20" class="internal-form">

    <el-form
      ref="record"
      class="settings-form"
      size="small"
      label-suffix=":"
      label-width="225px"
      label-position="left"
      :model="record"
      :rules="rules"
    >
      <el-col :span="12">
        <el-form-item label="enable_acl" prop="enable_acl">
          <emq-select
            v-model="record.enable_acl"
            :field="{ options: enableOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.enable_acl') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="acl_nomatch" prop="acl_nomatch">
          <emq-select
            v-model="record.acl_nomatch"
            :field="{ options: permitOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.acl_nomatch') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="acl_deny_action" prop="acl_deny_action">
          <emq-select
            v-model="record.acl_deny_action"
            :field="{ options: actionOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.acl_deny_action') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="allow_anonymous" prop="allow_anonymous">
          <emq-select
            v-model="record.allow_anonymous"
            :field="{ options: boolOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.allow_anonymous') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="enable_stats" prop="enable_stats">
          <emq-select
            v-model="record.enable_stats"
            :field="{ options: enableOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.enable_stats') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="use_username_as_clientid" prop="use_username_as_clientid">
          <emq-select
            v-model="record.use_username_as_clientid"
            :field="{ options: boolOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.use_username_as_clientid') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_subscriptions" prop="max_subscriptions">
          <el-input v-model="record.max_subscriptions" class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_subscriptions') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="ignore_loop_deliver" prop="ignore_loop_deliver">
          <emq-select
            v-model="record.ignore_loop_deliver"
            :field="{ options: boolOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.ignore_loop_deliver') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="mqueue_store_qos0" prop="mqueue_store_qos0">
          <emq-select
            v-model="record.mqueue_store_qos0"
            :field="{ options: boolOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.mqueue_store_qos0') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="flapping_banned_expiry_interval" prop="flapping_banned_expiry_interval">
          <el-input v-model="record.flapping_banned_expiry_interval" class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.flapping_banned_expiry_interval') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="flapping_threshold" prop="flapping_threshold">
          <el-input v-model="record.flapping_threshold" disabled class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.flapping_threshold') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_awaiting_rel" prop="max_awaiting_rel">
          <el-input v-model="record.max_awaiting_rel" class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_awaiting_rel') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_inflight" prop="max_inflight">
          <el-input v-model="record.max_inflight" class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_inflight') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_mqueue_len" prop="max_mqueue_len">
          <el-input v-model="record.max_mqueue_len" class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_mqueue_len') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="enable_flapping_detect" prop="enable_flapping_detect">
          <emq-select
            v-model="record.enable_flapping_detect"
            :field="{ options: enableOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.enable_flapping_detect') }}
      </el-col>
    </el-form>

    <el-col class="button-group_center" :span="24">
      <el-button disabled type="default" size="medium">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button :loading="btnLoading" type="primary" size="medium" @click="save">
        {{ $t('Base.save') }}
      </el-button>
    </el-col>
  </el-row>
</template>


<script>
export default {
  name: 'InternalForm',

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
  },

  data() {
    return {}
  },

  methods: {
    async save() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      this.$emit('update', 'external', this.record)
    },
  },
}
</script>
