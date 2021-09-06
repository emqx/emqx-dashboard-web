<template>
  <div class="authn-create app-wrapper">
    <back-button back-url="/authentication">
      {{ $t('Auth.backAuthList') }}
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
          <el-button @click="handleCancel">
            {{ $t('Base.cancel') }}
          </el-button>
        </div>
      </div>
      <!-- Data Source -->
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
        <database-config v-show="['mysql', 'postgresql'].includes(backend)"></database-config>
        <!-- Result -->
        <div :class="['create-form', 'result-block', isWork ? 'success' : 'error']">
          <div class="result-title">
            {{ isWork ? $t('Auth.testSuccess') : $t('Auth.testFaild') }}
          </div>
        </div>
        <div class="step-btn">
          <el-button type="primary" @click="handleNext">
            {{ $t('Base.create') }}
          </el-button>
          <el-button @click="handleTest">
            {{ $t('Base.test') }}
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
import BackButton from '@/components/BackButton.vue'
import GuideBar from '@/components/GuideBar.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'

export default defineComponent({
  name: 'AuthnCreate',
  components: {
    BackButton,
    GuideBar,
    DatabaseConfig,
  },
  setup() {
    const activeGuidesIndex = ref([0])
    const mechanism = ref('password-based')
    const step = ref(0)
    const backend = ref('')
    const databases = ref([])
    const others = ref([])
    const isWork = ref(false)
    const supportBackendMap = {
      'password-based': {
        mysql: 'MySQL',
        redis: 'Redis',
        postgresql: 'PostgreSQL',
        mongodb: 'MongoDB',
        'built-in-database': 'Built-in database',
        'http-server': 'HTTP',
      },
      jwt: {},
      scram: {
        'built-in-database': 'Built-in database',
      },
    }
    const getGuideList = function () {
      return [this.$t('Auth.mechanism'), this.$t('Auth.dataSource'), this.$t('Auth.config')]
    }
    const handleCancel = function () {
      this.$router.push('/authentication')
    }
    const getSupportBackend = function () {
      const supportData = supportBackendMap[mechanism.value]
      Object.keys(supportData).forEach((key) => {
        const res = {
          label: supportData[key],
          value: key,
          img: require(`../../assets/img/${key}.png`),
        }
        const otherKeys = ['http-server']
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
    const handleNext = function () {
      if (step.value === 0) {
        databases.value = []
        others.value = []
        getSupportBackend()
      }
      step.value += 1
      activeGuidesIndex.value.push(step.value)
    }
    const handleBack = function () {
      step.value -= 1
      activeGuidesIndex.value.pop()
    }
    const handleTest = function () {
      isWork.value = true
    }
    return {
      activeGuidesIndex,
      mechanism,
      step,
      backend,
      databases,
      others,
      isWork,
      getGuideList,
      handleCancel,
      handleNext,
      handleBack,
      handleTest,
    }
  },
})
</script>

<style lang="scss">
.authn-create {
  .create-form-title {
    font-size: 16px;
    color: #1d1d1d;
    font-weight: 600;
  }
  .item-description {
    color: #5b5b5b;
    font-size: 12px;
    margin-bottom: 32px;
  }
  .create-form {
    width: 80%;
    .el-form-item {
      border: 1px solid #e4e4e4;
      .el-form-item__label {
        padding-top: 12px;
        padding-left: 15px;
        line-height: inherit;
        font-size: 12px;
        color: #4d4d4d;
      }
    }
    .el-input .el-input__inner,
    .el-textarea__inner,
    .el-select__inner {
      border: none;
    }
    .el-radio.is-bordered {
      text-align: center;
      &.mechanism {
        width: 240px;
      }
      &.backend {
        width: 160px;
      }
    }
    .select-database {
      margin-bottom: 32px;
    }
  }
  .step-btn {
    margin-top: 32px;
  }
  .result-block {
    .result-title {
      font-size: 16px;
      color: #fff;
      padding: 24px;
    }
    &.error {
      background: #e34242;
    }
    &.success {
      background: #00b299;
    }
  }
}
</style>
