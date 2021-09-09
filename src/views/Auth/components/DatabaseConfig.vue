<template>
  <div class="database-config">
    <!-- Connect -->
    <div class="create-form-title">
      {{ $t('Auth.connect') }}
    </div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col v-if="isRedis" :span="12">
          <el-form-item :label="$t('Auth.redisType')">
            <el-select v-model="databaseConfig.redis_type">
              <el-option value="single" :label="$t('Auth.single')"></el-option>
              <el-option value="sentinel" label="Sentinel"></el-option>
              <el-option value="cluster" label="Cluster"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.mongoType')">
            <el-select v-model="databaseConfig.mongo_type">
              <el-option value="single" :label="$t('Auth.single')"></el-option>
              <el-option value="sentinel" label="Sentinel"></el-option>
              <el-option value="cluster" label="Cluster"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="
            (isMongoDB && databaseConfig.mongo_type !== 'single') ||
            (isRedis && databaseConfig.redis_type !== 'single')
          "
          :span="12"
        >
          <el-form-item :label="$t('Auth.servers')">
            <el-input v-model="databaseConfig.servers"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item :label="$t('Auth.server')">
            <el-input v-model="databaseConfig.server"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB && databaseConfig.mongo_type !== 'single'" :span="12">
          <el-form-item label="Replica Set Name">
            <el-input v-model="databaseConfig.replica_set_name"></el-input>
          </el-form-item>
        </el-col>
        <!-- Redis -->
        <el-col v-if="isRedis && databaseConfig.redis_type !== 'single'" :span="12">
          <el-form-item :label="$t('Auth.sentinel')">
            <el-input v-model="databaseConfig.sentinel"></el-input>
          </el-form-item>
        </el-col>
        <!-- Basic -->
        <el-col :span="12">
          <el-form-item :label="$t('Auth.database')">
            <el-input v-model="databaseConfig.database"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="!isRedis" :span="12">
          <el-form-item :label="$t('Base.userName')">
            <el-input v-model="databaseConfig.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Base.password')">
            <el-input v-model="databaseConfig.password" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- TLS -->
    <div class="create-form-title">TLS</div>
    <el-checkbox
      v-model="databaseConfig.ssl.enable"
      :label="$t('Auth.enableTLS')"
      border
    ></el-checkbox>
    <el-checkbox
      v-model="databaseConfig.ssl.verify"
      :label="$t('Auth.tlsVerify')"
      border
    ></el-checkbox>
    <el-collapse-transition>
      <div v-if="databaseConfig.ssl.enable">
        <div class="create-form-title">
          {{ $t('Auth.TLSCerts') }}
        </div>
        <el-row :gutter="20">
          <el-form class="create-form">
            <el-col :span="24">
              <el-form-item label="TLS Cert">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="databaseConfig.ssl.certfile"
                  placeholder="Begins with -----BEGIN CERTIFICATE-----"
                ></el-input>
                <el-upload class="bottom-btn" ref="upload" action="" :auto-upload="false">
                  <el-button slot="trigger" size="mini">
                    {{ $t('Base.selectFile') }}
                  </el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="TLS Key">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="databaseConfig.ssl.keyfile"
                  placeholder="Begins with -----BEGIN RSA PRIVATE KEY-----"
                ></el-input>
                <el-upload class="bottom-btn" ref="upload" action="" :auto-upload="false">
                  <el-button slot="trigger" size="mini">
                    {{ $t('Base.selectFile') }}
                  </el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CA Cert">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="databaseConfig.ssl.cacertfile"
                  placeholder="Begins with -----BEGIN RSA PRIVATE KEY-----"
                ></el-input>
                <el-upload class="bottom-btn" ref="upload" action="" :auto-upload="false">
                  <el-button slot="trigger" size="mini">
                    {{ $t('Base.selectFile') }}
                  </el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </el-collapse-transition>
    <div class="create-form-title">
      {{ $t('Auth.connectConfig') }}
    </div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col :span="12">
          <el-form-item label="Pool size">
            <el-input v-model.number="databaseConfig.poolsize"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Auth.reconnect')">
            <el-select v-model="databaseConfig.auto_reconnect">
              <el-option :value="true" label="True"></el-option>
              <el-option :value="false" label="False"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.topologyTimeout')">
            <el-input v-model.number="databaseConfig.topology.connect_timeout_ms"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="create-form-title">
      {{ $t('Auth.authConfig') }}
      <el-button class="help-btn" size="mini" @click="needHelp = !needHelp">
        {{ $t('Base.help') }}
      </el-button>
    </div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <!-- MySQL & PgSQL -->
        <template v-if="isMySQL || isPgSQL || isRedis">
          <el-col :span="24">
            <el-form-item label="SQL">
              <el-input v-model="databaseConfig.query" type="textarea" :rows="6"></el-input>
              <el-button class="bottom-btn" size="mini" @click="setDefaultContent('query')">
                {{ $t('Auth.setDefault') }}
              </el-button>
            </el-form-item>
          </el-col>
        </template>
        <!-- Mongodb -->
        <template v-if="isMongoDB">
          <el-col :span="24">
            <el-form-item label="Collection">
              <el-input v-model="databaseConfig.collection"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('Auth.selector')">
              <el-input v-model="databaseConfig.selector" type="textarea" :rows="6"></el-input>
              <el-button class="bottom-btn" size="mini" @click="setDefaultContent('selector')">
                {{ $t('Auth.setDefault') }}
              </el-button>
            </el-form-item>
          </el-col>
        </template>
        <el-collapse-transition>
          <el-col v-if="needHelp" :span="24">
            <div class="help-block">
              <div class="create-form-title">
                {{
                  isMongoDB
                    ? $t('Auth.exampleDataStructures')
                    : isRedis
                    ? $t('Auth.exampleDataCmd')
                    : $t('Auth.sqlHelpContent')
                }}
              </div>
              <code-view
                :lang="isMongoDB ? 'javascript' : isRedis ? 'bash' : 'sql'"
                :code="helpContent"
              ></code-view>
              <el-button
                size="small"
                v-clipboard:copy="helpContent"
                v-clipboard:success="copySuccess"
              >
                {{ $t('Base.copy') }}
              </el-button>
            </div>
          </el-col>
        </el-collapse-transition>
        <el-col v-if="isMySQL || isPgSQL" :span="12">
          <el-form-item :label="$t('Auth.queryTimeout')">
            <el-input v-model="databaseConfig.query_timeout">
              <template slot="append">
                <el-select v-model="databaseConfig.query_timeout_unit">
                  <el-option value="ms"></el-option>
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.passwordHashField')">
            <el-input
              v-model="databaseConfig.password_hash_field"
              placeholder="password_hash"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Auth.passwordHash')">
            <el-select v-model="databaseConfig.password_hash_algorithm">
              <el-option v-for="item in HashOptions" :key="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.saltField')">
            <el-input v-model="databaseConfig.salt_field" placeholder="salt"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Auth.saltPosition')">
            <el-select v-model="databaseConfig.salt_position">
              <el-option value="prefix"></el-option>
              <el-option value="suffix"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.superuserField')">
            <el-input
              v-model="databaseConfig.is_superuser_field"
              placeholder="is_superuser"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { computed, defineComponent, onBeforeUnmount, ref } from '@vue/composition-api'
import CodeView from '@/components/CodeView'
import usePassword from '@/hooks/usePassword'
import useDatabaseConfig from '@/hooks/useDatabaseConfig'

export default defineComponent({
  name: 'DatabaseConfig',
  components: { CodeView },
  props: {
    database: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const { databaseConfig, defaultContent, helpContent } = useDatabaseConfig(props.database)
    const needHelp = ref(false)
    const setDefaultContent = (dataKey) => {
      databaseConfig[dataKey] = defaultContent.value
    }
    const isMongoDB = computed(() => props.database === 'mongodb')
    const isRedis = computed(() => props.database === 'redis')
    const isMySQL = computed(() => props.database === 'mysql')
    const isPgSQL = computed(() => props.database === 'postgresql')
    let copyShowTimeout = null
    const copySuccess = function () {
      this.$message.success(this.$t('Base.copied'))
      clearTimeout(copyShowTimeout)
      copyShowTimeout = setTimeout(() => {
        needHelp.value = false
      }, 500)
    }
    onBeforeUnmount(() => {
      clearTimeout(copyShowTimeout)
    })
    const { HashOptions } = usePassword()
    return {
      isMongoDB,
      isRedis,
      isMySQL,
      isPgSQL,
      needHelp,
      helpContent,
      databaseConfig,
      setDefaultContent,
      copySuccess,
      HashOptions,
    }
  },
})
</script>

<style lang="scss">
.database-config {
  .create-form {
    margin-top: 16px;
    .el-form-item {
      position: relative;
    }
    .bottom-btn {
      position: absolute;
      bottom: 8px;
      right: 10px;
      line-height: 1;
    }
    .el-upload-list {
      display: none;
    }
  }
  .help-btn {
    margin-left: 10px;
  }
  .help-block {
    padding: 24px;
    background: #f1f3f7;
    margin-bottom: 22px;
    .help-bock__code {
      background: #1c2a28;
      color: #fff;
      padding: 24px;
      margin: 16px 0;
    }
  }
  .el-radio.is-bordered {
    width: 120px;
    margin-bottom: 32px;
  }
}
</style>
