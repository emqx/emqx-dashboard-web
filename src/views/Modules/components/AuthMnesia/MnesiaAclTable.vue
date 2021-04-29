<template>
  <div class="mnesia-acl-table">
    <el-card shadow="never">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('Clients.clientid')" name="clientid">
          <acl-table-page
            v-if="activeName === 'clientid'"
            type="clientid"
          ></acl-table-page>
        </el-tab-pane>
        <el-tab-pane :label="$t('Clients.username')" name="username">
          <acl-table-page
            v-if="activeName === 'username'"
            type="username"
          ></acl-table-page>
        </el-tab-pane>
        <el-tab-pane :label="$t('Clients.$all')" name="$all">
          <acl-table-page
            v-if="activeName === '$all'"
            type="$all"
          ></acl-table-page>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import AclTablePage from './AclTablePage'

export default {
  name: 'MnesiaAclTable',

  components: {
    AclTablePage,
  },

  data() {
    return {
      activeName: 'clientid',
    }
  },
}
</script>
