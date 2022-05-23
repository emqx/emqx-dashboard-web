<template>
  <div class="mnesia-acl-table">
    <a-card>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('Clients.clientid')" name="clientid">
          <auth-table-page v-if="activeName === 'clientid'" type="clientid" />
        </el-tab-pane>
        <el-tab-pane :label="$t('Clients.username')" name="username">
          <auth-table-page v-if="activeName === 'username'" type="username" />
        </el-tab-pane>
      </el-tabs>
    </a-card>
  </div>
</template>

<script>
import AuthTablePage from './AuthTablePage.vue'

export default {
  name: 'MnesiaAuthTable',

  components: {
    AuthTablePage,
  },

  data() {
    return {
      activeName: 'clientid',
    }
  },
}
</script>
