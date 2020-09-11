<template>
  <div class="array-editor">
    <el-form :rules="form.rules" :model="form" ref="form">
      <el-table
        class="array-editor"
        :data="form.tableData"
        :render-header="labelHeads"
        size="mini"
        :header-cell-class-name="addHeaderCellClassName"
      >
        <el-table-column :label="item" v-for="(item, index) in headers" :key="index">
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="`tableData.${$index}.${row[item].formItemAttributes.prop}`"
              :rules="form.rules[row[item].formItemAttributes.prop]"
            >
              <!-- input -->
              <template v-if="row[item].elType !== 'select'">
                <el-input
                  v-if="row[item].type === 'number'"
                  v-model.number="row[row[item].key]"
                  v-bind="row[item].bindAttributes"
                  @input="atInputChange"
                  size="small"
                >
                </el-input>
                <el-input
                  v-else
                  v-model="row[row[item].key]"
                  v-bind="row[item].bindAttributes"
                  @input="atInputChange"
                  size="small"
                >
                </el-input>
              </template>
              <!-- select -->
              <template v-else>
                <emq-select
                  v-if="row[item].type === 'number'"
                  v-model.number="row[row[item].key]"
                  v-bind="row[item].bindAttributes"
                  class="reset-width"
                  @change="atInputChange"
                  size="small"
                >
                </emq-select>
                <emq-select
                  v-else
                  v-model="row[row[item].key]"
                  v-bind="row[item].bindAttributes"
                  class="reset-width"
                  @change="atInputChange"
                  size="small"
                >
                </emq-select>
              </template>
            </el-form-item>
            <!-- </el-form> -->
          </template>
        </el-table-column>
        <el-table-column width="60px">
          <span slot="header" class="btn" @click="addColumn">
            {{ $t('components.add') }}
          </span>
          <template slot-scope="{ row }">
            <span class="btn" @click="deleteItem(row)">
              {{ $t('components.delete') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'MulObjectEditor',

  components: {},

  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    value: {
      type: Array,
      required: true,
    },
    notNull: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      required: true,
    },
    isDadRequired: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      headers: [],
      oneRow: {},
      defaultConfig: {},
      allColumnRule: {},
      form: {
        tableData: [],
        rules: {},
      },
      innerValid: true,
    }
  },

  computed: {},

  created() {
    this.initData()
  },

  methods: {
    assignValue() {
      if (this.value.length) {
        for (let i = 0; i < this.value.length; i += 1) {
          this.addColumn()
        }
        this.value.forEach((item) => {
          const index = this.value.indexOf(item)
          Object.assign(this.form.tableData[index], item)
        })
      }
    },
    initData() {
      const { form, rules } = this.data
      // eslint-disable-next-line no-unused-vars
      Object.entries(form).forEach(([k, v]) => {
        const labelName = v.formItemAttributes.label
        this.headers.push(labelName)
        this.oneRow[labelName] = v
        const { key, value } = v
        this.oneRow[key] = value
        this.defaultConfig[key] = value
        this.allColumnRule[labelName] = rules[key]
      })
      Object.assign(this.form.rules, rules)
      this.assignValue()
    },
    labelHeads(h, { column }) {
      return h('span', { class: 'table-head', style: { width: '100%' } }, [column.label])
    },
    atInputChange() {
      this.validateForm()
      const data = []
      this.form.tableData.forEach((item) => {
        const tempConfig = {}
        Object.keys(this.defaultConfig).forEach((key) => {
          tempConfig[key] = item[key]
        })
        data.push(tempConfig)
      })
      this.$emit('update', data)
      if (this.isDadRequired) {
        this.$emit('updateValidate')
      }
    },
    deleteItem(row) {
      this.form.tableData = this.form.tableData.filter(($) => $.key !== row.key)
      setTimeout(() => {
        this.atInputChange()
      }, 50)
    },
    addColumn() {
      const row = { ...this.oneRow }
      row.key = Math.random().toString(16).slice(3)
      this.form.tableData.push(row)
      setTimeout(() => {
        this.atInputChange()
      }, 50)
    },
    // eslint-disable-next-line no-unused-vars
    addHeaderCellClassName({ row, column, rowIndex, columnIndex }) {
      const columnRule = this.allColumnRule[column.label]
      if (columnRule && columnRule.length) {
        return 'requiredclass'
      }
      return true
    },
    validateForm() {
      this.$refs.form.validate((valid) => {
        this.innerValid = valid
      })
    },
  },
}
</script>

<style lang="scss">
.array-editor {
  font-size: 12px !important;

  .el-input {
    width: 100% !important;

    &.key-input {
      width: 120px !important;
    }
  }

  .el-table__empty-block {
    min-height: 40px;
  }

  .requiredclass > div.cell::before {
    content: '*';
    color: #f5222d;
    margin-right: 4px;
  }
}
</style>
