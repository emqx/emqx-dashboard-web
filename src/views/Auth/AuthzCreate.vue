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
        <div class="step-btn">
          <el-button type="primary" @click="handleNext">
            {{ $t('Base.nextStep') }}
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
import { defineComponent } from '@vue/composition-api'
import BackButton from '@/components/BackButton.vue'
import GuideBar from '@/components/GuideBar.vue'
import useGuide from '@/hooks/useGuide'

export default defineComponent({
  name: 'AuthzCreate',
  components: {
    BackButton,
    GuideBar,
  },
  setup() {
    const getGuideList = function () {
      return [this.$t('Auth.dataSource'), this.$t('Auth.config')]
    }
    const { step, activeGuidesIndex, handleNext, handleBack } = useGuide()
    return {
      step,
      activeGuidesIndex,
      handleNext,
      handleBack,
      getGuideList,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
