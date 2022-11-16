<template>
  <div class="array-editor">
    <el-form :rules="form.rules" :model="form" ref="form">
      <el-table
        class="array-editor"
        :data="form.tableData"
        size="mini"
        :header-cell-class-name="addHeaderCellClassName"
      >
        <el-table-column :label="item" v-for="(item, index) in headers" :key="index">
          <template slot="header">
            <span class="my-header">
              {{ item }}
              <el-popover v-if="descriptionDic[item]" width="220" trigger="hover" placement="top">
                <div class="emq-popover-content" v-html="descriptionDic[item]"></div>
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </span>
          </template>
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="`tableData.${$index}.${row[item].formItemAttributes.prop}`"
              :rules="form.rules[row[item].formItemAttributes.prop]"
              ref="formItems"
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
        <el-table-column width="52px">
          <span slot="header" class="btn" @click="addColumn">
            {{ $t('Base.add') }}
          </span>
          <template slot-scope="{ row }">
            <span class="btn" @click="deleteItem(row)">
              {{ $t('Base.delete') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { isFunction } from 'lodash'

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
      descriptionDic: {},
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
        this.descriptionDic[labelName] = v.formItemAttributes.description
        this.oneRow[labelName] = v
        const { key, value } = v
        this.oneRow[key] = value
        this.defaultConfig[key] = value
        this.allColumnRule[labelName] = rules[key]
      })
      Object.assign(this.form.rules, rules)
      this.assignValue()
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
    clearValidates() {
      const formItemComArr = this.$refs.formItems
      formItemComArr.forEach((item) => {
        try {
          if (item.clearValidate && isFunction(item.clearValidate)) {
            item.clearValidate()
          }
        } catch (error) {
          console.error(error)
        }
      })
    },
    addColumn() {
      const row = { ...this.oneRow }
      row.key = Math.random().toString(16).slice(3)
      this.form.tableData.push(row)
      setTimeout(() => {
        this.atInputChange()
        this.clearValidates()
      }, 50)
    },
    // eslint-disable-next-line no-unused-vars
    addHeaderCellClassName({ row, column, rowIndex, columnIndex }) {
      const columnRule = this.allColumnRule[column.label]
      if (columnRule) {
        const res = columnRule.find(($) => $.required === true)
        return res ? 'requiredclass' : ''
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

  .my-header {
    color: #333;
  }

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
    margin-right: 2px;
  }

  th .cell {
    word-break: break-all;
  }

  .my-header {
    position: relative;

    .el-icon-question {
      position: absolute;
      right: -15px;
      top: 1px;
      font-size: 11px;
    }
  }

  .el-form-item__content {
    padding-bottom: 16px;
    padding-top: 8px;
    .el-form-item__error {
      top: auto;
      bottom: 0;
    }
  }
}
</style>
