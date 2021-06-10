<template>
  <div class="jwt-authentication">
    <el-card shadow="never" class="emq-list-card">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form ref="record" :model="record" :rules="rules">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="alg">
                  <emq-select
                    v-model="record.alg"
                    size="small"
                    class="el-select--public"
                    popper-class="el-select--public"
                    :field="{ list: algsOptions }"
                    :placeholder="$t('Plugins.algorithm')"
                  >
                  </emq-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="secret">
                  <el-input
                    v-model="record.secret"
                    :placeholder="$t('Plugins.secret')"
                    size="small"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-checkbox v-model="payloadVisible" size="small">Payload</el-checkbox>
            </el-form-item>

            <template v-if="payloadVisible">
              <p class="jwt-payload-desc">
                {{ $t('Plugins.payloadDesc') }}
                <a :href="jwtDoc" target="_blank" rel="noopener">{{ $t('Plugins.jwtDoc') }}</a>
              </p>
              <el-form-item prop="payload">
                <div class="monaco-container" style="height: 200px">
                  <monaco id="jwt-payload" v-model="record.payload" lang="json"> </monaco>
                </div>
              </el-form-item>
              <p class="jwt-payload-desc">
                {{ $t('Plugins.dataDesc') }}
              </p>
              <el-form-item prop="data">
                <div class="monaco-container" style="height: 200px">
                  <monaco id="jwt-data" v-model="record.data" lang="plaintext"> </monaco>
                </div>
              </el-form-item>
            </template>

            <el-form-item prop="expired">
              <el-date-picker
                v-model="record.expired"
                :picker-options="pickerOptions"
                :placeholder="$t('General.neverExpire')"
                value-format="timestamp"
                size="small"
              >
              </el-date-picker>
            </el-form-item>

            <el-button type="primary" class="add" size="small" @click="save">
              {{ $t('Base.generate') }}
            </el-button>
          </el-form>
        </el-col>
      </el-row>

      <el-table :data="records">
        <el-table-column prop="username" label="Username"></el-table-column>
        <el-table-column prop="clientid" label="Client ID"></el-table-column>
        <el-table-column
          min-width="160px"
          prop="token"
          label="token"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column width="120px">
          <template slot-scope="{ row }">
            <el-button
              v-clipboard:cpoy="row.token"
              v-clipboard:success="copySuccessed"
              type="dashed"
              size="mini"
              icon="el-icon-document-copy"
            >
              {{ $t('Base.copy') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import jwt from 'jsonwebtoken'
import Monaco from '@/components/Monaco'
import { getLink } from '@/common/utils'

export default {
  name: 'JwtAuthentication',

  components: {
    Monaco,
  },

  data() {
    return {
      record: {
        alg: 'HS256',
        payload: JSON.stringify(
          {
            username: '%u',
            clientid: '%c',
          },
          null,
          2,
        ),
        data: '',
      },
      rules: {
        secret: { required: true, message: this.$t('Plugins.secretRequired') },
        payload: {
          required: true,
          message: this.$t('Plugins.payloadRequired'),
        },
        data: { required: true, message: this.$t('Plugins.dataRequired') },
      },
      algsOptions: [
        'HS256',
        'HS384',
        'HS512',
        'RS256',
        'RS384',
        'RS512',
        'ES256',
        'ES384',
        'ES512',
      ],
      payloadVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
        shortcuts: [
          {
            text: `180 ${this.$tc('Base.day', 180)}`,
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', date)
            },
          },
          {
            text: `1 ${this.$tc('Base.year', 1)}`,
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            },
          },
          {
            text: `3 ${this.$tc('Base.year', 3)}`,
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 1095)
              picker.$emit('pick', date)
            },
          },
        ],
      },
      records: [],
    }
  },

  computed: {
    jwtDoc() {
      return getLink('authJWT')
    },
  },

  methods: {
    save() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        if (this.payloadVisible) {
          this.records = this.getPayloadJWTData(this.record.payload, this.record.data)
        } else {
          this.records = this.getPrivateKeyJWTData()
        }
      })
    },
    getPayloadJWTData(template, data) {
      let payloadStr = JSON.stringify(template)
      return data.split('\n').map((item) => {
        const [username = '', clientid = ''] = item.split(',')
        payloadStr = template.replace(/%u/g, username).replace(/%c/g, clientid)
        const payload = JSON.parse(payloadStr)
        const options = {
          algorithm: this.record.alg,
        }
        if (this.record.expired) {
          payload.exp = this.record.expired / 1000
        }
        const token = jwt.sign(payload, this.record.secret, options)
        return {
          username,
          clientid,
          token,
        }
      })
    },
    getPrivateKeyJWTData() {
      const payload = {}
      if (this.record.expired) {
        payload.exp = this.record.expired / 1000
      }
      const token = jwt.sign(payload, this.record.secret, {
        algorithm: this.record.alg,
      })
      return [
        {
          clientid: '',
          username: '',
          token,
        },
      ]
    },
    copySuccessed() {
      this.$message.success(this.$t('Base.copied'))
    },
  },
}
</script>

<style lang="scss">
.jwt-authentication {
  .monaco-container {
    height: 200px;
  }
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-table {
    margin-top: 40px;
  }
  .jwt-payload-desc {
    font-size: 14px;
    padding: 12px;
    border-radius: 4px;
    line-height: 1.4;
    margin: 16px 0;
    background: #f6f7fb;
  }
}
</style>
