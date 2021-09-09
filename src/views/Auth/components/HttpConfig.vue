<template>
  <div class="http-config config">
    <div class="create-form-title">HTTP</div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col :span="12">
          <el-form-item :label="$t('Auth.method')">
            <el-select v-model="httpConfig.method">
              <el-option value="get" label="GET"></el-option>
              <el-option value="post" label="POST"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="URL">
            <el-input v-model="httpConfig.url"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Headers">
            <key-and-value-editor v-model="httpConfig.headers"></key-and-value-editor>
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
            <el-input v-model.number="httpConfig.poolsize"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Auth.connectTimeout')">
            <el-input v-model="httpConfig.connect_timeout">
              <template slot="append">
                <el-select v-model="httpConfig.connect_timeout_unit">
                  <el-option value="ms"></el-option>
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Auth.enablePipelining')">
            <el-select v-model="httpConfig.enable_pipelining">
              <el-option :value="true" label="True"></el-option>
              <el-option :value="false" label="False"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- TLS -->
    <TLS-config v-model="httpConfig.ssl"></TLS-config>
    <div class="create-form-title">
      {{ $t('Auth.authConfig') }}
      <el-button class="help-btn" size="mini" @click="needHelp = !needHelp">
        {{ $t('Base.help') }}
      </el-button>
    </div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col :span="24">
          <el-form-item label="Body">
            <el-input v-model="httpConfig.body" type="textarea" :rows="6"></el-input>
            <el-button class="bottom-btn" size="mini" @click="setDefaultContent">
              {{ $t('Auth.setDefault') }}
            </el-button>
          </el-form-item>
        </el-col>
        <el-collapse-transition>
          <el-col v-if="needHelp" :span="24">
            <div class="help-block">
              <div class="create-form-title">
                {{ $t('Auth.exampleDataCmd') }}
              </div>
              <code-view lang="javascript" :code="helpContent"></code-view>
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
        <el-col :span="12">
          <el-form-item :label="$t('Auth.requestTimeout')">
            <el-input v-model="httpConfig.request_timeout">
              <template slot="append">
                <el-select v-model="httpConfig.request_timeout_unit">
                  <el-option value="ms"></el-option>
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from '@vue/composition-api'
import CodeView from '@/components/CodeView'
import TLSConfig from './TLSConfig.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import useCopy from '@/hooks/useCopy'

export default defineComponent({
  name: 'HttpConfig',
  components: { KeyAndValueEditor, CodeView, TLSConfig },
  setup() {
    const defaultContent = JSON.stringify(
      {
        username: '${username}',
        password: '${password}',
      },
      null,
      2,
    )
    const httpConfig = reactive({
      method: 'post',
      url: 'http://localhost:8080',
      headers: {
        'content-type': 'application/json',
      },
      poolsize: 8,
      connect_timeout: 5000,
      connect_timeout_unit: 'ms',
      request_timeout: 5000,
      request_timeout_unit: 'ms',
      enable_pipelining: true,
      ssl: {
        enable: false,
        verify: false,
        certfile: '',
        keyfile: '',
        cacertfile: '',
      },
      body: defaultContent,
    })
    const needHelp = ref(false)
    const helpContent = `
      const express = require('express')
      const app = express()
      app.use(express.json())

      app.post('/login', (req, res) {
        let data = {
          // @enum = success, failed, ignore
          result: 'failed',
          // enable and set superuser
          // is_superuser: true,
        }
        const { username, password } = req.body
        if (['admin', 'guest'].includes(username) && password === 'public') {
          data.result = 'success'
          if (username === 'admin') {
            data.is_superuser = true
          }
        } else if (username === '') {
          data.result = 'ignored'
        } else {
          data.result = 'failed'
        }
        // response with JSON
        res.json(data)
      })
    `
    const { copySuccess } = useCopy(() => {
      needHelp.value = false
    })
    const setDefaultContent = () => {
      httpConfig.body = defaultContent
    }
    return {
      helpContent,
      httpConfig,
      needHelp,
      copySuccess,
      setDefaultContent,
    }
  },
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
</style>
