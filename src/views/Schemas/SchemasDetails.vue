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
            :label-width="disabled ? '120px' : ''"
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
              <!-- TODO: 后期加上 json，3rd-party 类型 -->
              <el-form-item :label="$t('Schemas.parser_type')" prop="parser_type">
                <emq-select
                  v-model="record.parser_type"
                  :disabled="disabled"
                  :field="{ list: ['avro', 'protobuf'] }"
                >
                </emq-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            </el-col>

            <!-- TODO: 添加 3rd-party 支持的配置 -->
            <!-- <template v-if="record.parser_type === THIRD_PARTY">
              <el-form-item :label="$t('Schemas.parser_addr')">
                <el-input v-model="record.parser_addr"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Schemas.connect_timeout')">
                <el-input v-model="record.connect_timeout" placeholder="15"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Schemas.parser_timeout')">
                <el-input v-model="record.parser_timeout" placeholder="15"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Schemas.3rd_party_opts')">
                <el-input v-model="record['3rd_party_opts']"></el-input>
              </el-form-item>
            </template> -->

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
      record: {
        parser_type: 'avro',
        schema: '',
      },
      rules: {
        name: { required: true, message: this.$t('Schemas.nameRequired') },
        parser_type: { required: true, message: this.$t('Schemas.parserTypeRequired') },
        schema: { required: true, message: this.$t('Schemas.schemaRequired') },
      },
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
  },
}
</script>
