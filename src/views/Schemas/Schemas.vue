<template>
  <div class="schemas">

    <page-header
      :back-title="$t('Schemas.schema')"
    >
    </page-header>

    <div class="app-wrapper">
      <a-card
        class="emq-list-card"
      >
        <div class="emq-table-header">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="$router.push('/schemas/create')"
          >
            {{ $t('Base.create') }}
          </el-button>
        </div>
      </a-card>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Schemas',
}
</script>
