<template>
  <el-row :gutter="20" class="external-form">

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
        <el-form-item label="enable_ban" prop="enable_ban">
          <emq-select
            v-model="record.enable_ban"
            :field="{ options: enableOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.enable_ban') }}
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
        <el-form-item label="max_packet_size" prop="max_packet_size">
          <el-input v-model="record.max_packet_size" class="settings-input" placeholder="1048576"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_packet_size') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_clientid_len" prop="max_clientid_len">
          <el-input v-model="record.max_clientid_len" class="settings-input" placeholder="65535"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_clientid_len') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_topic_levels" prop="max_topic_levels">
          <el-input v-model="record.max_topic_levels" class="settings-input" placeholder="0"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_topic_levels') }}
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
        {{ $t('General.max_qos_allowed') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_topic_alias" prop="max_topic_alias">
          <el-input v-model="record.max_topic_alias" class="settings-input" placeholder="0"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_topic_alias') }}
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
        {{ $t('General.retain_available') }}
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
        {{ $t('General.wildcard_subscription') }}
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
        {{ $t('General.shared_subscription') }}
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
        <el-form-item label="retry_interval" prop="retry_interval">
          <el-input v-model="record.retry_interval" class="settings-input" placeholder="20s"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.retry_interval') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="keepalive_backoff" prop="keepalive_backoff">
          <el-input v-model="record.keepalive_backoff" class="settings-input" placeholder="0.75"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.keepalive_backoff') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_subscriptions" prop="max_subscriptions">
          <el-input v-model="record.max_subscriptions" class="settings-input" placeholder="0"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_subscriptions') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="idle_timeout" prop="idle_timeout">
          <el-input v-model="record.idle_timeout" class="settings-input" placeholder="15s"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.idle_timeout') }}
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
          <el-input v-model="record.flapping_banned_expiry_interval" class="settings-input" placeholder="1h"></el-input>
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
        <el-form-item label="force_gc_policy" prop="force_gc_policy">
          <el-input v-model="record.force_gc_policy" class="settings-input" placeholder="1000|1MB"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.force_gc_policy') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_awaiting_rel" prop="max_awaiting_rel">
          <el-input v-model="record.max_awaiting_rel" class="settings-input" placeholder="100"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_awaiting_rel') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_inflight" prop="max_inflight">
          <el-input v-model="record.max_inflight" class="settings-input" placeholder="32"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_inflight') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="max_mqueue_len" prop="max_mqueue_len">
          <el-input v-model="record.max_mqueue_len" class="settings-input" placeholder="1000"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.max_mqueue_len') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="await_rel_timeout" prop="await_rel_timeout">
          <el-input v-model="record.await_rel_timeout" class="settings-input" placeholder="300s"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.await_rel_timeout') }}
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
      <el-col :span="12">
        <el-form-item label="mqueue_default_priority" prop="mqueue_default_priority">
          <emq-select
            v-model="record.mqueue_default_priority"
            :field="{ options: priorityOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.mqueue_default_priority') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="mqueue_priorities" prop="mqueue_priorities">
          <el-input v-model="record.mqueue_priorities" class="settings-input" placeholder="none"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.mqueue_priorities') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="session_expiry_interval" prop="session_expiry_interval">
          <el-input v-model="record.session_expiry_interval" class="settings-input" placeholder="2h"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.session_expiry_interval') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="upgrade_qos" prop="upgrade_qos">
          <emq-select
            v-model="record.upgrade_qos"
            :field="{ options: enableOptions }"
          >
          </emq-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.upgrade_qos') }}
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
  name: 'ExternalForm',

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
      this.$emit('update', 'external', this.record)
    },
  },
}
</script>
