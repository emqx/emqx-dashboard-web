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
      <el-button class="help-btn" size="mini" @click="needHelp = true">
        {{ $t('Base.help') }}
      </el-button>
    </div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col :span="24">
          <el-form-item label="Auth SQL">
            <el-input v-model="databaseConfig.sql" type="textarea" :rows="6"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="needHelp" :span="24">
          <div class="help-block">
            <div class="create-form-title">
              {{ $t('Auth.sqlHelpContent') }}
            </div>
            <code-view lang="sql" :code="helpSqlContent"></code-view>
            <el-button size="small">
              {{ $t('Base.copy') }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Password Hash">
            <el-input v-model="databaseConfig.passwordHash"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Password Salt">
            <el-input v-model="databaseConfig.passwordSalt"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import CodeView from '@/components/CodeView'

export default defineComponent({
  name: 'DatabaseConfig',
  components: { CodeView },
  setup() {
    const databaseConfig = ref({
      host: '127.0.0.1',
      port: 3306,
      username: '',
      password: '',
      dashboard: 'emqx',
      cert: 'Begins with -----BEGIN CERTIFICATE-----',
      key: 'Begins with -----BEGIN RSA PRIVATE KEY-----',
      poolsize: 8,
      reconnect: true,
      sql: 'SELECT username, pssword FROM emqx_user',
      passwordHash: 'sha256',
      passwordSalt: 'none',
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
    const needHelp = ref(false)
    const isTls = ref('')
    return {
      needHelp,
      helpSqlContent,
      databaseConfig,
      isTls,
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
      bottom: 0;
      right: 10px;
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
