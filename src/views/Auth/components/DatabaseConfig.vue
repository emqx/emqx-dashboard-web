<template>
  <div class="database-config">
    <div class="create-form-title">
      {{ $t('Auth.connect') }}
    </div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col :span="12">
          <el-form-item label="Host">
            <el-input v-model="databaseConfig.host"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Port">
            <el-input v-model="databaseConfig.port"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Username">
            <el-input v-model="databaseConfig.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Password">
            <el-input v-model="databaseConfig.password" type="password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Dashboard">
            <el-input v-model="databaseConfig.dashboard"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="create-form-title">TLS</div>
    <el-radio-group v-model="isTls" class="select-tls">
      <el-radio class="mechanism" label="enable" border>
        {{ $t('Advanced.enable') }}
      </el-radio>
      <el-radio class="mechanism" label="ca" border> CA </el-radio>
      <el-radio class="mechanism" label="tls" border> TLS Verify </el-radio>
    </el-radio-group>
    <div class="create-form-title">
      {{ $t('Auth.TLSCerts') }}
    </div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col :span="24">
          <el-form-item label="TLS Cert">
            <el-input type="textarea" :rows="4" v-model="databaseConfig.cert"></el-input>
            <el-upload class="bottom-btn" ref="upload" action="" :auto-upload="false">
              <el-button slot="trigger" size="mini">
                {{ $t('Base.selectFile') }}
              </el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="TLS Key">
            <el-input type="textarea" :rows="4" v-model="databaseConfig.key"></el-input>
            <el-upload class="bottom-btn" ref="upload" action="" :auto-upload="false">
              <el-button slot="trigger" size="mini">
                {{ $t('Base.selectFile') }}
              </el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
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
            <el-select v-model="databaseConfig.reconnect">
              <el-option :value="true" label="True"></el-option>
              <el-option :value="false" label="False"></el-option>
            </el-select>
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
        <el-col :span="24">
          <el-form-item label="SQL">
            <el-input v-model="databaseConfig.query" type="textarea" :rows="6"></el-input>
            <el-button class="bottom-btn" size="mini" @click="setDefaultSQL">
              {{ $t('Auth.defaultSql') }}
            </el-button>
          </el-form-item>
        </el-col>
        <el-collapse-transition>
          <el-col v-if="needHelp" :span="24">
            <div class="help-block">
              <div class="create-form-title">
                {{ $t('Auth.sqlHelpContent') }}
              </div>
              <code-view lang="sql" :code="helpSqlContent"></code-view>
              <el-button
                size="small"
                v-clipboard:copy="helpSqlContent"
                v-clipboard:success="copySuccess"
              >
                {{ $t('Base.copy') }}
              </el-button>
            </div>
          </el-col>
        </el-collapse-transition>
        <el-col :span="12">
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
          <el-form-item :label="$t('Auth.passwordHash')">
            <el-select v-model="databaseConfig.password_hash_algorithm">
              <el-option v-for="item in HashOptions" :key="item" :value="item"></el-option>
            </el-select>
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
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from '@vue/composition-api'
import CodeView from '@/components/CodeView'
import usePassword from '@/hooks/usePassword'

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
    const defaultSQL = "SELECT password_hash FROM mqtt_user where username = '${username}' LIMIT 1"
    const databaseConfig = reactive({
      host: '127.0.0.1',
      port: 3306,
      username: '',
      password: '',
      dashboard: 'emqx',
      cert: 'Begins with -----BEGIN CERTIFICATE-----',
      key: 'Begins with -----BEGIN RSA PRIVATE KEY-----',
      poolsize: 8,
      reconnect: true,
      query: defaultSQL,
      query_timeout: 5000,
      query_timeout_unit: 'ms',
      password_hash_algorithm: 'sha256',
      salt_position: 'prefix',
    })
    const helpSqlContent = ref(`
      CREATE TABLE IF NOT EXISTS 'mqtt_user' (
        'id' int(11) unsigned NOT NULL AUTO_INCREMENT,
        'username' varchar(100) DEFAULT NULL,
        'password' varchar(100) DEFAULT NULL,
        'salt' varchar(35) DEFAULT NULL,
        'is_superuser' tinyint(1) DEFAULT 0,
        'created' datetime DEFAULT NULL,
        PRIMARY KEY ('id'),
        UNIQUE KEY 'mqtt_username' ('username')
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
    if (props.type === 'postgresql') {
      helpSqlContent.value = `
        CREATE TABLE mqtt_user (
          id SERIAL primary key,
          is_superuser boolean,
          username character varying(100),
          password_hash character varying(100),
          salt character varying(40)
        )
      `
    }
    const needHelp = ref(false)
    const isTls = ref('')
    const setDefaultSQL = () => {
      databaseConfig.query = defaultSQL
    }
    let copyShowTimeout = ref(null)
    const copySuccess = function () {
      this.$message.success(this.$t('Base.copied'))
      clearTimeout(copyShowTimeout)
      copyShowTimeout = setTimeout(() => {
        needHelp.value = false
      }, 500)
    }
    const { HashOptions } = usePassword()
    return {
      needHelp,
      helpSqlContent,
      databaseConfig,
      isTls,
      setDefaultSQL,
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
