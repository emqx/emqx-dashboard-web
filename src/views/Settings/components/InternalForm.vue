<template>
  <el-row :gutter="20" class="internal-form">

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
        {{ $t('Settings.enable_acl') }}
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
        {{ $t('Settings.acl_nomatch') }}
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
        {{ $t('Settings.acl_deny_action') }}
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
        {{ $t('Settings.allow_anonymous') }}
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
        {{ $t('Settings.enable_stats') }}
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
        {{ $t('Settings.use_username_as_clientid') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_subscriptions" prop="max_subscriptions">
          <el-input v-model="record.max_subscriptions" class="form-item-input" placeholder="0"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.max_subscriptions') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_packet_size" prop="max_packet_size">
          <el-input v-model="record.max_packet_size" class="form-item-input" placeholder="1048576"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.max_packet_size') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_clientid_len" prop="max_clientid_len">
          <el-input v-model="record.max_clientid_len" class="form-item-input" placeholder="65535"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.max_clientid_len') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_topic_levels" prop="max_topic_levels">
          <el-input v-model="record.max_topic_levels" class="form-item-input" placeholder="0"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.max_topic_levels') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_qos_allowed" prop="max_qos_allowed">
          <emq-select
            v-model="record.max_qos_allowed"
            :field="{ options: qosOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.max_qos_allowed') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_topic_alias" prop="max_topic_alias">
          <el-input v-model="record.max_topic_alias" class="form-item-input" placeholder="0"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.max_topic_alias') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="retain_available" prop="retain_available">
          <emq-select
            v-model="record.retain_available"
            :field="{ options: boolOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.retain_available') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="wildcard_subscription" prop="wildcard_subscription">
          <emq-select
            v-model="record.wildcard_subscription"
            :field="{ options: boolOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.wildcard_subscription') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="shared_subscription" prop="shared_subscription">
          <emq-select
            v-model="record.shared_subscription"
            :field="{ options: boolOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.shared_subscription') }}
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
        {{ $t('Settings.ignore_loop_deliver') }}
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
        {{ $t('Settings.mqueue_store_qos0') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="flapping_banned_expiry_interval" prop="flapping_banned_expiry_interval">
          <el-input v-model="record.flapping_banned_expiry_interval" class="form-item-input" placeholder="1h"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.flapping_banned_expiry_interval') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="flapping_threshold" prop="flapping_threshold">
          <el-input v-model="record.flapping_threshold" disabled class="form-item-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.flapping_threshold') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_awaiting_rel" prop="max_awaiting_rel">
          <el-input v-model="record.max_awaiting_rel" class="form-item-input" placeholder="100"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.max_awaiting_rel') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_inflight" prop="max_inflight">
          <el-input v-model="record.max_inflight" class="form-item-input" placeholder="32"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.max_inflight') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_mqueue_len" prop="max_mqueue_len">
          <el-input v-model="record.max_mqueue_len" class="form-item-input" placeholder="1000"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('Settings.max_mqueue_len') }}
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
        {{ $t('Settings.enable_flapping_detect') }}
      </el-col>
    </el-form>

    <el-col class="button-group__center" :span="24">
      <el-button :disabled="cancelDisabled" type="default" size="medium" @click="cancel">
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
    return {}
  },

  methods: {
    async save() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      this.$emit('update', 'internal', this.record)
    },
    initForm() {
      this.$refs.record.clearValidate()
    },
  },
}
</script>
