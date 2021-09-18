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
        <file-config v-if="type === 'file'" v-model="configData"></file-config>
        <database-config
          v-if="['mysql', 'postgresql'].includes(type)"
          v-model="configData"
          :database="type"
          auth-type="authz"
        ></database-config>
        <http-config v-else-if="type === 'http'" v-model="configData"></http-config>
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
import { defineComponent, ref } from '@vue/composition-api'
import FileConfig from './components/FileConfig.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import BackButton from './components/BackButton.vue'
import GuideBar from '@/components/GuideBar.vue'
import useGuide from '@/hooks/useGuide'
import { createAuthz } from '@/api/auth'
import useAuthzCreate from '@/hooks/useAuthzCreate'

export default defineComponent({
  name: 'AuthzCreate',
  components: {
    BackButton,
    GuideBar,
    FileConfig,
    DatabaseConfig,
    HttpConfig,
  },
  setup() {
    const getGuideList = function () {
      return [this.$t('Auth.dataSource'), this.$t('Auth.config')]
    }
    const type = ref('file')
    const configData = ref({})
    const { factory, create } = useAuthzCreate()
    const typeList = ref([
      { label: 'File', value: 'file', img: require('@/assets/img/file.png') },
      { label: 'MySQL', value: 'mysql', img: require('@/assets/img/mysql.png') },
      { label: 'PostgreSQL', value: 'postgresql', img: require('@/assets/img/postgresql.png') },
      { label: 'HTTP Server', value: 'http', img: require('@/assets/img/http.png') },
      { label: 'MongoDB', value: 'mongodb', img: require('@/assets/img/mongodb.png') },
    ])
    const { step, activeGuidesIndex, handleNext, handleBack } = useGuide(() => {
      if (step.value === 0) {
        const data = factory(type.value)
        configData.value = data
      }
    })
    const handleCreate = async function () {
      const data = create(configData.value, type.value)
      await createAuthz(data)
      this.$message.success(this.$t('Base.createSuccess'))
      this.$router.push({ name: 'authorization' })
    }
    return {
      configData,
      step,
      type,
      typeList,
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
