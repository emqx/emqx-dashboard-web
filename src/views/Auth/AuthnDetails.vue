<template>
  <div class="auth authn-details app-wrapper">
    <back-button back-url="/authentication">
      {{ $t('Auth.backAuthnList') }}
    </back-button>
    <div class="section-header" v-loading.lock="authnDetailLock">
      <div>
        <span>{{ titleMap[currBackend] }}</span>
      </div>
    </div>
    <el-card shadow="never" v-loading.lock="authnDetailLock">
      <template v-if="!authnDetailLock">
        <database-config
          v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(currBackend)"
          :database="currBackend"
          v-model="configData"
        ></database-config>
        <http-config v-if="currBackend === 'http-server'" v-model="configData"></http-config>
      </template>
      <el-button type="primary" @click="handleUpdate">
        {{ $t('Base.update') }}
      </el-button>
      <!-- <el-button @click="handleTest">
        {{ $t('Base.test') }}
      </el-button> -->
      <el-button @click="$router.push('/authentication')">
        {{ $t('Base.cancel') }}
      </el-button>
    </el-card>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'
import { loadAuthn } from '@/api/auth'
import BackButton from '@/components/BackButton.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import { updateAuthn } from '@/api/auth'
import useAuthnCreate from '@/hooks/useAuthnCreate'

export default defineComponent({
  name: 'AuthnDetails',
  components: {
    DatabaseConfig,
    BackButton,
    HttpConfig,
  },
  setup() {
    const authnDetailLock = ref(false)
    const id = computed(function () {
      return this.$route.params.id
    })
    let configData = ref({
      ssl: { enable: false },
    })
    const currBackend = ref('')
    const loadData = async function () {
      authnDetailLock.value = true
      const res = await loadAuthn(id.value).catch(() => {
        authnDetailLock.value = false
      })
      authnDetailLock.value = false
      if (res) {
        currBackend.value = res.backend
        configData.value = res
      }
    }
    const titleMap = {
      mysql: 'MySQL',
      'http-server': 'HTTP Server',
    }
    loadData()
    const handleUpdate = async function () {
      const { id } = configData.value
      if (currBackend.value === 'http-server') {
        const { processHttpConfig } = useAuthnCreate()
        configData.value = processHttpConfig({}, { ...configData.value })
      }
      await updateAuthn(id, configData.value)
      this.$message.success(this.$t('Base.updateSuccess'))
      this.$router.push({ name: 'authentication' })
    }
    return {
      currBackend,
      titleMap,
      configData,
      authnDetailLock,
      handleUpdate,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
