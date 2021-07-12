<template>
  <div class="schemas-wrapper app-wrapper">
    <el-row :gutter="20">
      <el-form ref="record" :model="record" :rules="rules" :label-position="'top'" size="small">
        <el-col :span="14">
          <el-form-item :label="$t('Schemas.name')" prop="name">
            <el-input v-model="record.name"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="14">
          <el-form-item :label="$t('Schemas.parser_type')" prop="parser_type">
            <emq-select
              v-model="record.parser_type"
              :field="{ list: ['avro', 'protobuf', '3rd-party'] }"
            >
            </emq-select>
          </el-form-item>
        </el-col>

        <!-- 3rd-party -->
        <template v-if="record.parser_type === THIRD_PARTY">
          <el-col :span="14">
            <el-form-item :label="$t('Schemas.third_party_type')" prop="third_party_type">
              <emq-select
                v-model="record.third_party_type"
                :field="{ list: ['HTTP', 'TCP', 'Resources'] }"
                @change="handle3rdTypeChange"
              >
              </emq-select>
            </el-form-item>
          </el-col>

          <!-- HTTP type -->
          <template v-if="record.third_party_type === HTTP">
            <el-col :span="14">
              <el-form-item label="URL" prop="parser_addr.url">
                <el-input
                  v-model="record.parser_addr.url"
                  placeholder="http://127.0.0.1:8000/parser"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </template>

          <!-- TCP type -->
          <template v-if="record.third_party_type === TCP">
            <el-col :span="14">
              <el-form-item :label="$t('Schemas.server')" prop="parser_addr.server">
                <el-input v-model="record.parser_addr.server" placeholder="127.0.0.1:8081">
                </el-input>
              </el-form-item>
            </el-col>
          </template>

          <!-- Resources type -->
          <template v-if="record.third_party_type === RESOURCES">
            <el-col :span="14">
              <el-form-item :label="$t('Schemas.resource')" prop="parser_addr.resource_id">
                <emq-select
                  v-model="record.parser_addr.resource_id"
                  :field="{ options: availableResources }"
                  :field-name="{ label: 'id', value: 'id' }"
                >
                  <div slot="option" slot-scope="{ item }" class="custom-option">
                    <span class="label">{{ item.id }}</span>
                    <span class="value">{{ item.config.title }}</span>
                  </div>
                </emq-select>
              </el-form-item>
            </el-col>
          </template>

          <el-col :span="14">
            <el-form-item :label="$t('Schemas.3rd_party_opts')" prop="parser_opts.3rd_party_opts">
              <el-input v-model="record.parser_opts['3rd_party_opts']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="14">
            <el-form-item :label="$t('Schemas.connect_timeout')" prop="parser_opts.connect_timeout">
              <el-input v-model="record.parser_opts.connect_timeout" placeholder="3"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="14">
            <el-form-item :label="$t('Schemas.parse_timeout')" prop="parser_opts.parse_timeout">
              <el-input v-model="record.parser_opts.parse_timeout" placeholder="5"></el-input>
            </el-form-item>
          </el-col>
        </template>

        <el-col v-else :span="14">
          <el-form-item :label="$t('Schemas.description')">
            <el-input v-model="record.description"></el-input>
          </el-form-item>
        </el-col>

        <!-- Schema code -->
        <el-col v-if="record.parser_type !== THIRD_PARTY" :span="14">
          <el-form-item class="code-editor__item" label="Schema" prop="schema">
            <div class="monaco-container monaco-schema">
              <monaco
                id="schema"
                v-model="record.schema"
                class="schema-code"
                warp
                lang="plaintext"
                @qucik-save="save"
                :height="editorHeight"
              ></monaco>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <div class="button-group">
      <el-button :loading="saveLoading" type="primary" size="medium" @click="save">
        {{ $t('Base.create') }}
      </el-button>
      <el-button type="default" size="medium" @click="$router.back()">
        {{ $t('Base.cancel') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { loadResource } from '@/api/rules'
import { createSchema } from '@/api/schemas'
import Monaco from '@/components/Monaco'

export default {
  name: 'SchemasCreate',
  components: {
    Monaco,
  },
  data() {
    return {
      saveLoading: false,
      editorHeight: 260,
      THIRD_PARTY: '3rd-party',
      RESOURCES: 'Resources',
      HTTP: 'HTTP',
      TCP: 'TCP',
      availableResources: [],

      record: {
        parser_type: 'avro',
        schema: '',
        third_party_type: 'HTTP',
        parser_opts: {
          '3rd_party_opts': undefined,
          connect_timeout: undefined,
          parse_timeout: undefined,
        },
        parser_addr: {
          url: undefined,
          server: undefined,
          resource_id: undefined,
        },
      },
      rules: {
        name: { required: true, message: this.$t('Schemas.nameRequired') },
        parser_type: {
          required: true,
          message: this.$t('Schemas.parserTypeRequired'),
        },
        schema: { required: true, message: this.$t('Schemas.schemaRequired') },
        third_party_type: {
          required: true,
          message: this.$t('Schemas.third_party_type_required'),
        },
        parser_addr: {
          url: { required: true, message: this.$t('Schemas.url_required') },
          server: {
            required: true,
            message: this.$t('Schemas.server_required'),
          },
          resource_id: {
            required: true,
            message: this.$t('Schemas.resource_required'),
          },
        },
      },
    }
  },
  methods: {
    async save() {
      try {
        await this.$refs.record.validate()
      } catch (e) {
        return
      }

      this.saveLoading = true

      const res = await createSchema(this.record).catch(() => {})
      if (res) {
        this.$message.success(this.$t('Base.createSuccess'))
        this.routeToSchemas()
      }

      this.saveLoading = false
    },
    async handle3rdTypeChange(val) {
      if (val === this.RESOURCES) {
        const res = await loadResource()
        if (res) {
          const types = ['parser_tcp', 'parser_http']
          this.availableResources = res.filter(($) => types.includes($.type))
        }
      }
    },
  },
}
</script>
