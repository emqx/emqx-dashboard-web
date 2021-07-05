<template>
  <div class="schemas-details details-page app-wrapper">
    <page-header v-if="disabled">
      <div class="page-header-title-view">
        <div class="title">
          {{ detailsID }}
        </div>
      </div>
      <div class="page-header-top-start btn">
        <el-button type="danger" size="small" @click="deleteData">
          {{ $t('Base.delete') }}
        </el-button>
      </div>
    </page-header>

    <el-card shadow="never">
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

          <!-- 3rd-party -->
          <template v-if="record.parser_type === THIRD_PARTY">
            <el-col :span="14">
              <el-form-item :label="$t('Schemas.third_party_type')" prop="third_party_type">
                <emq-select
                  v-model="record.third_party_type"
                  :disabled="disabled"
                  :field="{ list: ['HTTP', 'TCP', 'Resources'] }"
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
                    :disabled="disabled"
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
                  <el-input
                    v-model="record.parser_addr.server"
                    :disabled="disabled"
                    placeholder="127.0.0.1:8081"
                  >
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
                    :disabled="disabled"
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
                <el-input
                  v-model="record.parser_opts['3rd_party_opts']"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="14">
              <el-form-item
                :label="$t('Schemas.connect_timeout')"
                prop="parser_opts.connect_timeout"
              >
                <el-input
                  v-model="record.parser_opts.connect_timeout"
                  :disabled="disabled"
                  placeholder="3"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="14">
              <el-form-item :label="$t('Schemas.parse_timeout')" prop="parser_opts.parse_timeout">
                <el-input
                  v-model="record.parser_opts.parse_timeout"
                  :disabled="disabled"
                  placeholder="5"
                ></el-input>
              </el-form-item>
            </el-col>
          </template>

          <!-- View -->
          <template>
            <el-col :span="14">
              <el-form-item :label="$t('Schemas.description')">
                <el-input v-model="record.descr" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { viewSchema, deleteSchema } from '@/api/schemas'

export default {
  name: 'SchemasDetails',

  components: {
    // Monaco,
  },
  computed: {
    disabled() {
      return true
    },
    detailsID() {
      return this.$route.query.id
    },
  },
  data() {
    return {
      editorHeight: 320,
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
      availableResources: [],
    }
  },

  watch: {
    $route(val) {
      const { id } = val.query
      this.viewDetails(id)
    },
  },
  created() {
    this.viewDetails(this.detailsID)
  },

  methods: {
    routeToSchemas() {
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
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
      })
        .then(async () => {
          const res = await deleteSchema(this.detailsID)
          if (res) {
            this.$message.success(this.$t('Base.deleteSuccess'))
            this.routeToSchemas()
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.btn {
  flex-grow: 1;
  text-align: right;
}

.details-page {
  .details-form {
    &__view {
      .el-input.is-disabled {
        .el-input__inner {
          background: transparent;
          border: none;
          cursor: text;
          color: #303133;
        }
      }

      .el-select .el-input .el-select__caret {
        visibility: hidden;
      }

      .el-form-item__label {
        color: #999;
      }
    }
  }
}
</style>
