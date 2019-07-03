<template>
  <el-table class="key-and-value-editor" :data="tableData" size="mini">
    <el-table-column prop="key" label="键" min-width="80px">
      <template slot-scope="{ row }">
        <el-input v-model="row.key" size="mini" placeholder="对象键" @input="atInputChange"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="value" label="值" min-width="150px">
      <template slot-scope="{ row }">
        <el-input v-model="row.value" size="mini" @input="atInputChange"></el-input>
      </template>
    </el-table-column>
    <el-table-column width="60px">
      <span slot="header" class="btn" @click="addColumn">
        添加
      </span>
      <template slot-scope="{ row }">
        <span class="btn" @click="deleteItem(row)">
          删除
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>


<script>
export default {
  name: 'KeyAndValueEditor',

  components: {},

  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
    notNull: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      row: {
        key: '',
        value: '',
        state: 0, // 0 ok 1 error
      },
      tableData: [],
    }
  },

  computed: {},

  created() {
    const list = []
    const d = this.value
    Object.entries(d).forEach(([key, value]) => {
      list.push({ key, value, state: 0 })
    })
    this.tableData = list
  },

  methods: {
    atInputChange() {
      const data = {}
      this.tableData.forEach((item) => {
        const { key, value } = item
        data[key] = value
      })
      this.$emit('update', data)
    },
    deleteItem(row) {
      this.tableData = this.tableData.filter($ => $.key !== row.key)
      this.atInputChange()
    },
    addColumn() {
      this.tableData.push({
        key: '',
        value: '',
        state: 0,
      })
    },
  },
}
</script>


<style lang="scss">
.key-and-value-editor {
  font-size: 12px !important;

  .el-input {
    width: 100% !important;
  }

  .el-table__empty-block {
    min-height: 40px;
  }
}


</style>
