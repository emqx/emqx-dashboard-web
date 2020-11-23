<template>
  <div class="auth-mnesia">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('Modules.auth')" name="auth">
        <mnesia-auth-table v-if="activeName === 'auth'" ref="auth"></mnesia-auth-table>
      </el-tab-pane>
      <el-tab-pane label="ACL" name="acl">
        <mnesia-acl-table v-if="activeName === 'acl'" ref="acl"></mnesia-acl-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MnesiaAuthTable from './MnesiaAuthTable'
import MnesiaAclTable from './MnesiaAclTable'

export default {
  name: 'AuthMnesia',

  components: {
    MnesiaAuthTable,
    MnesiaAclTable,
  },

  data() {
    return {
      activeName: 'auth',
    }
  },
}
</script>
