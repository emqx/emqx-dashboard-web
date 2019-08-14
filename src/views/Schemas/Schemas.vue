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
              {{ $t('Schemas.schema') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

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
