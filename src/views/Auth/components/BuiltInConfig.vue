<template>
  <div class="built-in-config">
    <div class="create-form-title">Build-in-Database</div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col :span="12">
          <el-form-item :label="$t('Auth.userIdType')">
            <el-select v-model="builtConfig.user_id_type">
              <el-option value="username"></el-option>
              <el-option value="clientid"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Auth.passwordHash')">
            <el-select v-model="builtConfig.password_hash_algorithm">
              <el-option v-for="item in HashOptions" :key="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, reactive } from '@vue/composition-api'
import usePassword from '@/hooks/usePassword'

export default defineComponent({
  name: 'BuiltInConfig',
  setup() {
    const builtConfig = reactive({
      user_id_type: 'username',
      password_hash_algorithm: 'sha256',
    })
    const { HashOptions } = usePassword()
    return {
      HashOptions,
      builtConfig,
    }
  },
})
</script>

<style lang="scss" scoped>
.create-form-title {
  margin-bottom: 16px;
}
</style>
