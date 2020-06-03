<template>
  <div class="auth-mnesia-table">
    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <div class="auth">
          <h3>{{ $t('Plugins.auth') }}</h3>
          <div class="emq-table-header">
            <el-row class="add-form" :gutter="20">
              <el-col :span="8">
                <el-input v-model="authRecord.login" size="small" :placeholder="$t('Plugins.usernameOrClientid')"></el-input>
                <el-popover
                  trigger="hover"
                  placement="top"
                  :content="$t('Plugins.mnesiaTip')"
                >
                  <a
                    slot="reference"
                    class="tutorial"
                    :href="mnesiaDoc"
                    target="_blank"
                    rel="noopener"
                  >
                    <i class="iconfont icon-bangzhu"></i>
                  </a>
                </el-popover>
              </el-col>
              <el-col :span="8">
                <el-input
                  v-model="authRecord.password"
                  size="small"
                  type="password"
                  :placeholder="$t('Base.password')"
                >
                </el-input>
              </el-col>
              <div class="col-oper">
                <el-button type="primary" icon="el-icon-plus" size="small" @click="AuthSave">
                  {{ $t('Base.add') }}
                </el-button>
              </div>
            </el-row>
          </div>
          <el-table :data="authTableData" class="data-list">
            <el-table-column prop="login" :label="$t('Plugins.usernameOrClientid')">
            </el-table-column>
            <el-table-column prop="oper" width="120px">
              <template slot-scope="{ row }">
                <el-button
                  type="dashed"
                  size="mini"
                  @click="showAuthEdit(row)"
                >
                  {{ $t('Base.edit') }}
                </el-button>
                <el-button
                  type="dashed danger"
                  size="mini"
                  @click="handleAuthDelete(row)"
                >
                  {{ $t('Base.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="emq-table-footer">
            <el-pagination
              v-if="authCount > 10"
              background
              layout="total, sizes, prev, pager, next"
              :page-sizes="[10, 50, 100, 500]" :page-size.sync="authParams._limit"
              :current-page.sync="authParams._page" :total="authCount" @size-change="handleAuthSizeChange"
              @current-change="handleAuthCurrentPageChange"
            >
            </el-pagination>
          </div>
        </div>

        <div class="acl">
          <h3>ACL</h3>
          <div class="emq-table-header">
            <el-row class="add-form" :gutter="20">
              <el-col :span="6">
                <el-autocomplete
                  v-model="aclRecord.login"
                  size="small"
                  value-key="label"
                  :fetch-suggestions="queryACLSearch"
                  :placeholder="$t('Plugins.usernameOrClientid')"
                  @select="handleACLSelect"
                ></el-autocomplete>
                <el-popover
                  trigger="hover"
                  placement="top"
                  :content="$t('Plugins.mnesiaTip')"
                >
                  <a
                    slot="reference"
                    class="tutorial"
                    :href="mnesiaDoc"
                    target="_blank"
                    rel="noopener"
                  >
                    <i class="iconfont icon-bangzhu"></i>
                  </a>
                </el-popover>
              </el-col>
              <el-col :span="6">
                <el-input
                  v-model="aclRecord.topic"
                  size="small"
                  :placeholder="$t('Topics.topic')"
                >
                </el-input>
              </el-col>
              <el-col :span="4">
                <emq-select
                  v-model="aclRecord.allow"
                  size="small"
                  :field="{ options: allowOptions }"
                >
                </emq-select>
              </el-col>
              <el-col :span="4">
                <emq-select
                  v-model="aclRecord.action"
                  size="small"
                  :field="{ options: actionOptions }"
                >
                </emq-select>
              </el-col>
              <div class="col-oper">
                <el-button type="primary" icon="el-icon-plus" size="small" @click="ACLSave">
                  {{ $t('Base.add') }}
                </el-button>
              </div>
            </el-row>
          </div>
          <el-table :data="aclTableData" class="data-list">
            <el-table-column prop="login" :label="$t('Plugins.usernameOrClientid')">
            </el-table-column>
            <el-table-column prop="topic" :label="$t('Topics.topic')">
            </el-table-column>
            <el-table-column prop="action" :label="$t('Plugins.action')">
            </el-table-column>
            <el-table-column prop="allow" :label="$t('Plugins.isAllow')">
              <template slot-scope="{ row }">
                {{ row.allow ? $t('Plugins.allow') : $t('Plugins.disallow') }}
              </template>
            </el-table-column>
            <el-table-column prop="oper" width="120px">
              <template slot-scope="{ row }">
                <el-button
                  type="dashed danger"
                  size="mini"
                  @click="handleACLDelete(row)"
                >
                  {{ $t('Base.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="emq-table-footer">
            <el-pagination
              v-if="aclCount > 10"
              background
              layout="total, sizes, prev, pager, next"
              :page-sizes="[10, 50, 100, 500]" :page-size.sync="aclParams._limit"
              :current-page.sync="aclParams._page" :total="aclCount" @size-change="handleACLSizeChange"
              @current-change="handleACLCurrentPageChange"
            >
            </el-pagination>
          </div>
        </div>
      </a-card>
    </div>

    <el-dialog
      :visible.sync="editVisible"
      width="400px"
      :title="$t('Base.edit')"
      @keyup.enter.native="handleAuthEdit"
    >
      <el-form
        ref="editRecord"
        class="el-form--public app-info"
        size="medium"
        :rules="rules"
        :model="editRecord"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="login" :label="$t('Plugins.usernameOrClientid')">
              <el-input v-model="editRecord.login" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="password" label="Password">
              <el-input v-model="editRecord.password" type="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button
          type="text"
          class="cache-btn"
          @click="editVisible = false"
        >
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleAuthEdit"
        >
          {{ $t('Base.add') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  listMnesia, addAuthMnesia, deleteAuthMnesia, loadAuthMnesia, updateAuthMnesia,
  listMnesiaACL, addAuthMnesiaACL, deleteAuthMnesiaACL,
} from '@/api/plugins'

export default {
  name: 'AuthMnesiaTable',

  data() {
    return {
      editVisible: false,
      listLoading: true,
      authRecord: {
        is_superuser: false,
      },
      aclRecord: {
        action: 'pubsub',
        allow: true,
      },
      authTableData: [],
      aclTableData: [],
      editRecord: {},
      rules: {
        login: { required: true, message: this.$t('Plugins.pleaseEnter') },
        password: { required: true, message: this.$t('Plugins.pleaseEnter') },
      },
      authParams: {
        _page: 1,
        _limit: 10,
      },
      authCount: 0,
      aclParams: {
        _page: 1,
        _limit: 10,
      },
      aclCount: 0,
      allowOptions: [
        { label: this.$t('Plugins.allow'), value: true },
        { label: this.$t('Plugins.disallow'), value: false },
      ],
      actionOptions: [
        { label: 'pub', value: 'pub' },
        { label: 'sub', value: 'sub' },
        { label: 'pubsub', value: 'pubsub' },
      ],
    }
  },

  computed: {
    mnesiaDoc() {
      return this.$store.state.lang === 'en'
        ? 'https://docs.emqx.io/broker/latest/en/advanced/auth-mnesia.html'
        : 'https://docs.emqx.io/broker/latest/cn/advanced/auth-mnesia.html'
    },
  },

  created() {
    this.loadMnesia()
    this.loadACL()
  },

  methods: {
    async loadMnesia(reload) {
      if (reload) {
        this.authParams._page = 1
      }
      const data = await listMnesia({ ...this.authParams })
      const { items = [], meta: { count = 0 } } = data
      this.authTableData = items
      this.authCount = count
      this.listLoading = false
    },
    async AuthSave() {
      if (!this.authRecord.login || !this.authRecord.password) {
        this.$message.warning(this.$t('Plugins.authMnesiaRequired'))
        return
      }
      const data = { ...this.authRecord }
      const res = await addAuthMnesia(data)
      if (res) {
        this.loadMnesia()
        this.authRecord = {
          is_superuser: false,
        }
      }
    },
    handleAuthDelete({ login }) {
      this.$confirm(this.$t('Plugins.confirmDelete'), this.$t('Base.warning'), {
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cache-btn el-button--text',
        type: 'warning',
      }).then(async () => {
        const res = await deleteAuthMnesia(login)
        if (res) {
          this.loadMnesia(true)
        }
      }).catch(() => {})
    },
    async showAuthEdit({ login }) {
      this.editVisible = true
      const res = await loadAuthMnesia(login)
      this.editRecord = res
    },
    handleAuthEdit() {
      this.$refs.editRecord.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { login, password } = this.editRecord
        const data = {
          password,
          is_superuser: false,
        }
        await updateAuthMnesia(login, data)
        this.loadMnesia()
        this.$message.success(this.$t('Base.editSuccess'))
        this.editRecord = {}
        this.editVisible = false
        this.$refs.editRecord.resetFields()
      })
    },
    handleAuthSizeChange() {
      this.loadMnesia(true)
    },
    handleAuthCurrentPageChange() {
      this.loadMnesia()
    },

    async loadACL(reload) {
      if (reload) {
        this.aclParams._page = 1
      }
      const data = await listMnesiaACL({ ...this.aclParams })
      const { items = [], meta: { count = 0 } } = data
      this.aclTableData = items
      this.aclCount = count
      this.listLoading = false
    },
    async ACLSave() {
      if (!this.aclRecord.login || !this.aclRecord.topic) {
        this.$message.warning(this.$t('Plugins.aclMnesiaRequired'))
        return
      }
      const data = { ...this.aclRecord }
      data.allow = this.aclRecord.allow !== 'false'
      const res = await addAuthMnesiaACL(data)
      if (res) {
        this.loadACL()
        this.aclRecord = {
          action: 'pubsub',
          allow: true,
        }
      }
    },
    handleACLDelete({ login, topic }) {
      this.$confirm(this.$t('Plugins.confirmDelete'), this.$t('Base.warning'), {
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cache-btn el-button--text',
        type: 'warning',
      }).then(async () => {
        const res = await deleteAuthMnesiaACL(login, topic)
        if (res) {
          this.loadACL(true)
        }
      }).catch(() => {})
    },
    queryACLSearch(queryString, cb) {
      const results = [
        { value: '$all', label: this.$t('Plugins.allUsers') },
      ]
      cb(results)
    },
    handleACLSelect(row) {
      this.aclRecord.login = row.value
    },
    handleACLSizeChange() {
      this.loadACL(true)
    },
    handleACLCurrentPageChange() {
      this.loadACL()
    },
  },
}
</script>


<style lang="scss">
.auth-mnesia-table {
  .data-list {
    clear: both;
  }
  .app-wrapper {
    .emq-table-header {
      padding: 5px 0 0 0;
    }
    .acl {
      margin-top: 40px;
    }
    .add-form {
      display: block;
      width: 100%;
      .tutorial {
        position: absolute;
        right: 20px;
        top: 4px;
      }
      .el-select,
      .el-autocomplete {
        width: 100%;
      }
      .col-oper {
        .el-button {
          margin-left: 12px;
        }
      }
      .el-col {
        position: relative;
        margin-bottom: 20px;
      }
    }
  }
}
</style>