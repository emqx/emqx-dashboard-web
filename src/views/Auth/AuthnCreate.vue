<template>
  <div class="auth authn-create app-wrapper">
    <back-button back-url="/authentication">
      {{ $t('Auth.backAuthnList') }}
    </back-button>
    <div class="page-header-title">
      {{ $t('Auth.createAuth') }}
    </div>
    <el-card shadow="never" class="app-card">
      <guide-bar
        :guide-list="getGuideList()"
        :active-guide-index-list="activeGuidesIndex"
      ></guide-bar>
      <!-- Mechanism -->
      <div v-if="step === 0" class="create-form">
        <div class="create-form-title">
          {{ $t('Auth.selectMechanism') }}
        </div>
        <el-radio-group v-model="mechanism">
          <el-radio class="mechanism" label="password-based" border> Password-Based </el-radio>
          <el-radio class="mechanism" label="jwt" border> JWT </el-radio>
          <el-radio class="mechanism" label="scram" border>
            {{ this.$t('Auth.scram') }}
          </el-radio>
        </el-radio-group>
        <p v-if="mechanism === 'password-based'" class="item-description">
          {{ $t('Auth.passwordBasedDesc') }}
        </p>
        <p v-else-if="mechanism === 'jwt'" class="item-description">
          {{ $t('Auth.jwtDesc') }}
        </p>
        <p v-else-if="mechanism === 'scram'" class="item-description">
          {{ $t('Auth.scramDesc') }}
        </p>
        <div class="step-btn">
          <el-button type="primary" @click="handleNext">
            {{ $t('Base.nextStep') }}
          </el-button>
          <el-button @click="$router.push('/authentication')">
            {{ $t('Base.cancel') }}
          </el-button>
        </div>
      </div>
      <!-- Backend -->
      <div v-if="step === 1" class="create-form">
        <div class="create-form-title">
          {{ $t('Auth.selectDataSource') }}
        </div>
        <template v-if="mechanism !== 'jwt'">
          <p class="item-description">
            {{ $t('Auth.dataSourceDesc') }}
          </p>
          <div class="create-form-title">
            {{ $t('Auth.database') }}
          </div>
          <el-radio-group v-model="backend" class="select-database">
            <el-radio
              v-for="item in databases"
              :key="item.value"
              :label="item.value"
              class="backend"
              border
            >
              <img height="32" width="32" :src="item.img" :alt="item.key" />
              <span>{{ item.label }}</span>
            </el-radio>
          </el-radio-group>
          <template v-if="others.length !== 0">
            <div class="create-form-title">
              {{ $t('Base.other') }}
            </div>
            <el-radio-group v-model="backend">
              <el-radio
                v-for="item in others"
                :key="item.value"
                :label="item.value"
                class="backend"
                border
              >
                <img height="32" width="32" :src="item.img" :alt="item.key" />
                <span>{{ item.label }}</span>
              </el-radio>
            </el-radio-group>
          </template>
        </template>
        <p v-else class="item-description">
          {{ $t('Auth.jwtDataSourceDesc') }}
        </p>
        <div class="step-btn">
          <el-button type="primary" @click="handleNext">
            {{ $t('Base.nextStep') }}
          </el-button>
          <el-button @click="handleBack">
            {{ $t('Base.backStep') }}
          </el-button>
        </div>
      </div>
      <!-- Config -->
      <div v-else-if="step === 2">
        <template v-if="mechanism !== 'jwt'">
          <database-config
            v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(backend)"
            v-model="configData"
            :database="backend"
            auth-type="authn"
          ></database-config>
          <built-in-config
            v-else-if="backend === 'built-in-database'"
            v-model="configData"
            :type="mechanism"
          ></built-in-config>
          <http-config v-else-if="backend === 'http'" v-model="configData"></http-config>
        </template>
        <jwt-config v-else v-model="configData"></jwt-config>
        <!-- Result -->
        <div v-if="testRes" :class="['create-form', 'result-block', isWork ? 'success' : 'error']">
          <div class="result-title">
            {{ isWork ? $t('Auth.testSuccess') : $t('Auth.testFaild') }}
          </div>
        </div>
        <div class="step-btn">
          <el-button type="primary" @click="handleCreate">
            {{ $t('Base.create') }}
          </el-button>
          <!-- <el-button @click="handleTest">
            {{ $t('Base.test') }}
          </el-button> -->
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
import BackButton from './components/BackButton.vue'
import GuideBar from '@/components/GuideBar.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import BuiltInConfig from './components/BuiltInConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import JwtConfig from './components/JwtConfig.vue'
import useGuide from '@/hooks/useGuide'
import { createAuthn } from '@/api/auth'
import useAuthnCreate from '@/hooks/useAuthnCreate'

export default defineComponent({
  name: 'AuthnCreate',
  components: {
    BackButton,
    GuideBar,
    DatabaseConfig,
    BuiltInConfig,
    HttpConfig,
    JwtConfig,
  },
  setup() {
    const mechanism = ref('password-based')
    const backend = ref('')
    const databases = ref([])
    const others = ref([])
    const isWork = ref(false)
    const testRes = ref(null)
    const configData = ref({})
    const { factory, create } = useAuthnCreate()
    const supportBackendMap = {
      'password-based': {
        mysql: 'MySQL',
        redis: 'Redis',
        postgresql: 'PostgreSQL',
        mongodb: 'MongoDB',
        'built-in-database': 'Built-in database',
        http: 'HTTP',
      },
      jwt: {},
      scram: {
        'built-in-database': 'Built-in database',
      },
    }
    const getGuideList = function () {
      return [this.$t('Auth.mechanism'), this.$t('Auth.dataSource'), this.$t('Auth.config')]
    }
    const getSupportBackend = function () {
      const supportData = supportBackendMap[mechanism.value]
      Object.keys(supportData).forEach((key) => {
        const res = {
          label: supportData[key],
          value: key,
          img: require(`@/assets/img/${key}.png`),
        }
        const otherKeys = ['http']
        if (otherKeys.includes(key)) {
          others.value.push(res)
        } else {
          databases.value.push(res)
        }
      })
      if (databases.value.length !== 0) {
        backend.value = databases.value[0].value
      }
    }
    const beforeNext = function () {
      if (step.value === 0) {
        databases.value = []
        others.value = []
        getSupportBackend()
      } else if (step.value === 1) {
        const data = factory(mechanism.value, backend.value)
        configData.value = data
      }
    }
    const { step, activeGuidesIndex, handleNext, handleBack } = useGuide(beforeNext)
    const handleCreate = async function () {
      const data = create(configData.value, backend.value, mechanism.value)
      await createAuthn(data)
      this.$message.success(this.$t('Base.createSuccess'))
      this.$router.push({ name: 'authentication' })
    }
    return {
      activeGuidesIndex,
      mechanism,
      step,
      backend,
      databases,
      others,
      isWork,
      testRes,
      configData,
      getGuideList,
      handleNext,
      handleBack,
      handleCreate,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
