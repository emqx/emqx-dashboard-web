<template>
  <div class="schemas-details details-page">
    <page-header
      :back-title="$t('Schemas.schema')"
      :oper="accessTitle"
      back-path="/schemas"
    >
      <template v-if="disabled">
        <div class="page-header-title-view">
          <div class="title">
            {{ detailsID }}
          </div>
        </div>
        <div class="page-header-top-start">
          <el-button type="danger" size="small" @click="deleteData">
            {{ $t('Base.delete') }}
          </el-button>
        </div>
      </template>
    </page-header>

    <div class="emq-list-body schemas-wrapper app-wrapper">
      <a-card class="emq-list-card">

        <el-row :gutter="20">
          <el-form
            ref="record"
            :class="[disabled ? 'details-form__view' : '']"
            :model="record"
            :rules="disabled ? {} : rules"
            :label-position="disabled ? 'left' : 'top'"
            :label-suffix="disabled ? ':' : ''"
            :label-width="disabled ? '140px' : ''"
            size="small"
          >
            <el-col :span="14">
              <el-form-item :label="$t('Schemas.name')" prop="name">
                <el-input v-model="record.name" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            </el-col>

            <el-col :span="14">
              <el-form-item :label="$t('Schemas.parser_type')" prop="parser_type">
                <emq-select
                  v-model="record.parser_type"
                  :disabled="disabled"
                  :field="{ list: ['avro', 'protobuf', '3rd-party'] }"
                >
                </emq-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            </el-col>

            <!-- 3rd-party -->
            <template v-if="record.parser_type === THIRD_PARTY">
              <el-col :span="14">
                <el-form-item :label="$t('Schemas.third_party_type')" prop="third_party_type">
                  <emq-select
                    v-model="record.third_party_type"
                    :disabled="disabled"
                    :field="{ list: ['HTTP', 'TCP', 'Resources'] }"
                    @change="handle3rdTypeChange"
                  >
                  </emq-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
              </el-col>

              <!-- HTTP type -->
              <template v-if="record.third_party_type === HTTP">
                <el-col :span="14">
                  <el-form-item label="URL" prop="parser_addr.url">
                    <el-input v-model="record.parser_addr.url" :disabled="disabled" placeholder="http://127.0.0.1:8000/parser">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                </el-col>
              </template>

              <!-- TCP type -->
              <template v-if="record.third_party_type === TCP">
                <el-col :span="14">
                  <el-form-item :label="$t('Schemas.server')" prop="parser_addr.server">
                    <el-input v-model="record.parser_addr.server" :disabled="disabled" placeholder="127.0.0.1:8081">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                </el-col>
              </template>

              <!-- Resources type -->
              <template v-if="record.third_party_type === RESOURCES">
                <el-col :span="14">
                  <el-form-item :label="$t('Schemas.resource')" prop="parser_addr.resource_id">
                    <emq-select
                      v-model="record.parser_addr.resource_id"
                      :field="{ options: availableResources }"
                      :field-name="{ label: 'id', value: 'id'}"
                      :disabled="disabled"
                    >
                      <div slot="option" slot-scope="{ item }" class="custom-option">
                        <span class="label">{{ item.id }}</span>
                        <span class="value">{{ item.config.title }}</span>
                      </div>
                    </emq-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                </el-col>
              </template>

              <el-col :span="14">
                <el-form-item :label="$t('Schemas.3rd_party_opts')" prop="parser_opts.3rd_party_opts">
                  <el-input v-model="record.parser_opts['3rd_party_opts']" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
              </el-col>
              <el-col :span="14">
                <el-form-item :label="$t('Schemas.connect_timeout')" prop="parser_opts.connect_timeout">
                  <el-input v-model="record.parser_opts.connect_timeout" :disabled="disabled" placeholder="3"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
              </el-col>
              <el-col :span="14">
                <el-form-item :label="$t('Schemas.parse_timeout')" prop="parser_opts.parse_timeout">
                  <el-input v-model="record.parser_opts.parse_timeout" :disabled="disabled" placeholder="5"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
              </el-col>
            </template>

            <!-- View -->
            <template v-if="accessType === 'view'">
              <el-col :span="14">
                <el-form-item :label="$t('Schemas.description')">
                  <el-input v-model="record.descr" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
              </el-col>
              <el-col :span="14">
                <el-form-item :label="$t('Schemas.version')">
                  <el-input v-model="record.version" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
              </el-col>
            </template>

            <el-col v-else :span="14">
              <el-form-item :label="$t('Schemas.description')">
                <el-input v-model="record.description" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            </el-col>

            <!-- Schema code -->
            <el-col v-if="record.parser_type !== THIRD_PARTY" :span="14">
              <el-form-item class="code-editor__item" label="Schema" prop="schema">
                <code-editor
                  v-model="record.schema"
                  lang="application/json"
                  height="320px"
                  :disabled="disabled"
                  :lint="false"
                ></code-editor>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            </el-col>

          </el-form>
        </el-row>

        <div v-if="!disabled" class="button-group">
          <el-button :loading="saveLoading" type="primary" size="medium" @click="save">
            {{ $t('Base.create') }}
          </el-button>
          <el-button type="default" size="medium" @click="$router.push({ path: '/schemas' })">
            {{ $t('Base.cancel') }}
          </el-button>
        </div>

      </a-card>

    </div>
  </div>
</template>


<script>
import { loadResource } from '@/api/rules'
import { createSchema, viewSchema, deleteSchema } from '@/api/schemas'
import detailsPage from '@/mixins/detailsPage'
import CodeEditor from '@/components/CodeEditor'
import { setTimeout } from 'timers'

export default {
  name: 'SchemasDetails',

  components: {
    CodeEditor,
  },

  mixins: [detailsPage],

  data() {
    return {
      THIRD_PARTY: '3rd-party',
      HTTP: 'HTTP',
      TCP: 'TCP',
      RESOURCES: 'Resources',
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
        parser_type: { required: true, message: this.$t('Schemas.parserTypeRequired') },
        schema: { required: true, message: this.$t('Schemas.schemaRequired') },
        third_party_type: { required: true, message: this.$t('Schemas.third_party_type_required') },
        parser_addr: {
          url: { required: true, message: this.$t('Schemas.url_required') },
          server: { required: true, message: this.$t('Schemas.server_required') },
          resource_id: { required: true, message: this.$t('Schemas.resource_required') },
        },
      },
      availableResources: [],
    }
  },

  methods: {
    routeToSchemas() {
      setTimeout(() => {
        this.$router.push({ path: '/schemas' })
      }, 500)
    },

    async save() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      this.saveLoading = true
      const res = await createSchema(this.record)
      if (res) {
        this.$message.success(this.$t('Base.createSuccess'))
        this.routeToSchemas()
      }
      this.saveLoading = false
    },

    async viewDetails(id) {
      const res = await viewSchema(id)
      if (res) {
        this.record = res
      }
    },

    deleteData() {
      this.$confirm(this.$t('Schemas.confirmDelete'), {
        type: 'warning',
      }).then(async () => {
        const res = await deleteSchema(this.detailsID)
        if (res) {
          this.$message.success(this.$t('Base.deleteSuccess'))
          this.routeToSchemas()
        }
      }).catch(() => {})
    },

    async handle3rdTypeChange(val) {
      if (val === this.RESOURCES) {
        const res = await loadResource()
        if (res) {
          const types = ['parser_tcp', 'parser_http']
          this.availableResources = res.filter($ => types.includes($.type))
        }
      }
    },
  },
}
</script>
