<template>
  <div class="auth auth-details app-wrapper">
    <back-button back-url="/authorization">
      {{ $t('Auth.backAuthzList') }}
    </back-button>
    <div class="section-header" v-loading.lock="authzDetailLock">
      <div class="section-header__block">
        <div>
          <img :src="currImg" width="56px" />
        </div>
        <div class="section-header__title">
          {{ titleMap[type] }}
        </div>
      </div>
      <div>
        <el-button type="danger" plain size="small" @click="handleDelete">
          {{ $t('Base.delete') }}
        </el-button>
        <el-button size="small" plain @click="handleUpdate(configData)">
          {{ configData.enable ? $t('Auth.disable') : $t('Auth.enable') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-if="!authzDetailLock">
      <el-tab-pane :label="$t('Auth.config')" :lazy="true">
        <el-card shadow="never">
          <database-config
            v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(type)"
            :database="type"
            v-model="configData"
            auth-type="authz"
          ></database-config>
          <file-config v-else-if="type === 'file'" v-model="configData"></file-config>
          <el-button type="primary" @click="handleUpdate">
            {{ $t('Base.update') }}
          </el-button>
          <!-- <el-button @click="handleTest">
          {{ $t('Base.test') }}
        </el-button> -->
          <el-button @click="$router.push('/authorization')">
            {{ $t('Base.cancel') }}
          </el-button>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'
import BackButton from '@/components/BackButton.vue'
import { loadAuthz, deleteAuthz, updateAuthz } from '@/api/auth'
import FileConfig from './components/FileConfig.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'

export default defineComponent({
  name: 'AuthzDetails',
  components: {
    BackButton,
    FileConfig,
    DatabaseConfig,
  },
  setup() {
    const authzDetailLock = ref(false)
    const titleMap = {
      mysql: 'MySQL',
      file: 'File',
    }
    const configData = ref({
      ssl: { enable: false },
    })
    const type = computed(function () {
      return this.$route.params.type
    })
    const currImg = computed(() => {
      if (type.value) {
        return require(`@/assets/img/${type.value}.png`)
      }
      return ''
    })
    const loadData = async function () {
      authzDetailLock.value = true
      const res = await loadAuthz(type.value).catch(() => {
        authzDetailLock.value = false
      })
      authzDetailLock.value = false
      if (res) {
        configData.value = res
      }
    }
    const handleUpdate = async function ({ enable }) {
      if (enable !== undefined) {
        configData.value.enable = !enable
      }
      await updateAuthz(type.value, configData.value)
      this.$message.success(this.$t('Base.updateSuccess'))
      this.$router.push({ name: 'authorization' })
    }
    const handleDelete = async function () {
      this.$confirm(this.$t('General.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          await deleteAuthz(type.value)
          this.$t('Base.deleteSuccess')
          this.$router.push({ name: 'authorization' })
        })
        .catch(() => {})
    }
    loadData()
    return {
      type,
      currImg,
      titleMap,
      authzDetailLock,
      configData,
      handleDelete,
      handleUpdate,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
