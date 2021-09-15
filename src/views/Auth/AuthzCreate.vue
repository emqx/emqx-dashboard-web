<template>
  <div class="auth authz-create app-wrapper">
    <back-button back-url="/authorization">
      {{ $t('Auth.backAuthzList') }}
    </back-button>
    <div class="page-header-title">
      {{ $t('Auth.createAuthz') }}
    </div>
    <el-card shadow="never" class="app-card">
      <guide-bar
        :guide-list="getGuideList()"
        :active-guide-index-list="activeGuidesIndex"
      ></guide-bar>
      <div v-if="step === 0" class="create-form">
        <div class="create-form-title">
          {{ $t('Auth.selectDataSource') }}
        </div>
        <el-radio-group v-model="type" class="select-type">
          <el-radio
            v-for="item in typeList"
            :key="item.value"
            :label="item.value"
            class="backend"
            border
          >
            <img height="32" width="32" :src="item.img" :alt="item.label" />
            <span>{{ item.label }}</span>
          </el-radio>
        </el-radio-group>
        <div class="step-btn">
          <el-button type="primary" @click="handleNext">
            {{ $t('Base.nextStep') }}
          </el-button>
          <el-button @click="$router.push('/authorization')">
            {{ $t('Base.cancel') }}
          </el-button>
        </div>
      </div>
      <div v-if="step === 1" class="create-form">
        <file-config v-if="type === 'file'" v-model="fileConfig"></file-config>
        <database-config
          v-if="['mysql'].includes(type)"
          v-model="databaseConfig"
          :database="type"
          auth-type="authz"
        ></database-config>
        <div class="step-btn">
          <el-button type="primary" @click="handleCreate">
            {{ $t('Base.create') }}
          </el-button>
          <el-button @click="handleBack">
            {{ $t('Base.backStep') }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from '@vue/composition-api'
import FileConfig from './components/FileConfig.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import BackButton from './components/BackButton.vue'
import GuideBar from '@/components/GuideBar.vue'
import useGuide from '@/hooks/useGuide'
import { createAuthz } from '@/api/auth'

export default defineComponent({
  name: 'AuthzCreate',
  components: {
    BackButton,
    GuideBar,
    FileConfig,
    DatabaseConfig,
  },
  setup() {
    const getGuideList = function () {
      return [this.$t('Auth.dataSource'), this.$t('Auth.config')]
    }
    const type = ref('file')
    const fileConfig = reactive({
      rules: `{allow, {username, "dashboard"}, subscribe, ["$SYS/#"]}.
{allow, {ipaddr, "127.0.0.1"}, all, ["$SYS/#", "#"]}.
{deny, all, subscribe, ["$SYS/#", {eq, "#"}]}.`,
    })
    const databaseConfig = reactive({
      server: '',
      username: 'root',
      password: '',
      database: '',
      pool_size: 8,
      auto_reconnect: true,
      ssl: {
        enable: false,
      },
      query: '',
    })
    const typeList = ref([
      { label: 'File', value: 'file', img: require('@/assets/img/file.png') },
      { label: 'MySQL', value: 'mysql', img: require('@/assets/img/mysql.png') },
    ])
    const { step, activeGuidesIndex, handleNext, handleBack } = useGuide()
    const handleCreate = async function () {
      let data = {}
      if (type.value === 'file') {
        data = fileConfig
      } else if (type.value === 'mysql') {
        data = databaseConfig
      }
      data.type = type.value
      await createAuthz(data)
      this.$message.success(this.$t('Base.createSuccess'))
      this.$router.push({ name: 'authorization' })
    }
    return {
      step,
      type,
      typeList,
      fileConfig,
      databaseConfig,
      activeGuidesIndex,
      handleNext,
      handleBack,
      handleCreate,
      getGuideList,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
