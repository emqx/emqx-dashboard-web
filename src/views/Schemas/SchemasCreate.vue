<template>
  <div class="schemas-create">
    <page-header
      :back-title="$t('Schemas.schema')"
      :oper="$t('Base.create')"
      back-path="/schemas"
    >
    </page-header>

    <div class="emq-list-body schemas-wrapper app-wrapper">
      <a-card class="emq-list-card">

        <el-row :gutter="20">
          <el-form
            ref="record"
            :model="record"
            :rules="rules"
            label-position="top"
            size="small"
          >
            <el-col :span="14">
              <el-form-item :label="$t('Schemas.name')" prop="name">
                <el-input v-model="record.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            </el-col>

            <el-col :span="14">
              <!-- TODO: 后期加上 json，3rd-party 类型 -->
              <el-form-item :label="$t('Schemas.parser_type')" prop="parser_type">
                <emq-select
                  v-model="record.parser_type"
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

            <el-col :span="14">
              <el-form-item :label="$t('Schemas.description')">
                <el-input v-model="record.description"></el-input>
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
                  :lint="false"
                ></code-editor>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            </el-col>

          </el-form>
        </el-row>

        <div class="button-group">
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
import { createSchema } from '@/api/schemas'
import CodeEditor from '@/components/CodeEditor'

export default {
  name: 'SchemasCreate',

  components: {
    CodeEditor,
  },

  data() {
    return {
      THIRD_PARTY: '3rd-party',
      saveLoading: false,
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
    async save() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      this.saveLoading = true
      const res = await createSchema(this.record)
      if (res) {
        this.$message.success(this.$t('Base.createSuccess'))
        setTimeout(() => {
          this.$router.push({ path: '/schemas' })
        }, 500)
      }
      this.saveLoading = false
    },
  },
}
</script>
