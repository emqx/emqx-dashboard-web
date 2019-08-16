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
        <!-- TODO: 验证是否带有单位 s ？ -->
        <el-form-item label="retry_interval" prop="retry_interval">
          <el-input v-model="record.retry_interval" class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.retry_interval') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="keepalive_backoff" prop="keepalive_backoff">
          <el-input v-model="record.keepalive_backoff" class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.keepalive_backoff') }}
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
        <el-form-item label="idle_timeout" prop="idle_timeout">
          <el-input v-model="record.idle_timeout" class="settings-input"></el-input>
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
        <el-form-item label="force_gc_policy" prop="force_gc_policy">
          <el-input v-model="record.force_gc_policy" class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.force_gc_policy') }}
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
        <el-form-item label="await_rel_timeout" prop="await_rel_timeout">
          <el-input v-model="record.await_rel_timeout" class="settings-input"></el-input>
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
          <el-input v-model="record.mqueue_priorities" class="settings-input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="form-item-desc">
        {{ $t('General.mqueue_priorities') }}
      </el-col>
      <el-col :span="12">
        <el-form-item label="session_expiry_interval" prop="session_expiry_interval">
          <el-input v-model="record.session_expiry_interval" class="settings-input"></el-input>
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
    return {
    }
  },

  watch: {
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
