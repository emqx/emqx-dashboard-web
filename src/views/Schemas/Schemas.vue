<template>
  <div class="rules">

    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              {{ $t('Base.homePage') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('RuleEngine.ruleEngine') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-content-view">
          <div class="content">
            <p class="description">
              {{ $t('RuleEngine.definingRuleConditionsAndDataProcessing') }}
            </p>
            <div class="page-header-link">
              <a :href="docs.tutorial" target="_blank" class="link-item">
                <i class="icon el-icon-position"></i>
                {{ $t('RuleEngine.quickStart') }}
              </a>

              <a :href="docs.tutorial" target="_blank" class="link-item">
                <i class="icon el-icon-document"></i>
                {{ $t('RuleEngine.productDocumentation') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Rules',

  props: {},
}
</script>
