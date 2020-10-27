<template>
  <div class="lw-client-details">
    <a-card class="emq-list-card">
      <div class="detail-header">
        <a href="javascript:;" @click="backListPage">
          <i class="el-icon-arrow-left">
            {{ $t('components.clients') }}
          </i>
        </a>
        <span class="endpoint">{{ $route.query.endpoint }}</span>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'LwClientDetails',

  data() {
    return {}
  },

  methods: {
    backListPage() {
      this.$router.push({
        path: '/modules/manage',
        query: {
          type: 'lwm2m_protocol',
        },
      })
    },
  },
}
</script>

<style lang="scss">
.lw-client-details {
  .detail-header {
    .endpoint {
      display: inline-block;
      margin-left: 20px;
    }
  }
}
</style>
