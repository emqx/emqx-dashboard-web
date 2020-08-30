<template>
  <!-- eslint-disable -->
  <el-table class="mul-object-editor" :data="tableData" :render-header="labelHeads" size="mini">
    <el-table-column :label="item" v-for="(item, index) in headers" :key="index">
      <template slot-scope="{ row }">
        <!-- input -->
        <template v-if="row[item].elType !== 'select'">
          <el-input
            v-if="row[item].type === 'number'"
            v-model.number="row[row[item].key]"
            v-bind="row[item].bindAttributes"
            @input="atInputChange"
          >
          </el-input>
          <el-input v-else v-model="row[row[item].key]" v-bind="row[item].bindAttributes" @input="atInputChange">
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
          >
          </emq-select>
          <emq-select
            v-else
            v-model="row[row[item].key]"
            v-bind="row[item].bindAttributes"
            class="reset-width"
            @change="atInputChange"
          >
          </emq-select>
        </template>
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
  },

  data() {
    return {
      tableData: [],
      headers: [],
      oneRow: {},
      defaultConfig: {},
    }
  },

  computed: {},

  created() {
    this.initData()
  },

  methods: {
    initData() {
      const { form } = this.data
      // eslint-disable-next-line no-unused-vars
      Object.entries(form).forEach(([k, v]) => {
        const labelName = v.formItemAttributes.label
        this.headers.push(labelName)
        this.oneRow[labelName] = v
        const { key, value } = v
        this.oneRow[key] = value
        this.defaultConfig[key] = value
      })
      this.addColumn()
    },
    labelHeads(h, { column }) {
      return h('span', { class: 'table-head', style: { width: '100%' } }, [column.label])
    },
    atInputChange() {
      const data = []
      this.tableData.forEach((item) => {
        const tempConfig = {}
        Object.keys(this.defaultConfig).forEach((key) => {
          tempConfig[key] = item[key]
        })
        data.push(tempConfig)
      })
      this.$emit('update', data)
    },
    deleteItem(row) {
      this.tableData = this.tableData.filter(($) => $.key !== row.key)
      this.atInputChange()
    },
    addColumn() {
      const row = { ...this.oneRow }
      row.key = new Date().getTime()
      this.tableData.push(row)
    },
  },
}
</script>

<style lang="scss">
.key-and-value-editor {
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
}
</style>
