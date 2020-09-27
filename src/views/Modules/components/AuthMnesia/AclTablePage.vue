<template>
  <div class="acl-table-page">
    <div class="emq-table-header">
      <el-row class="add-form" :gutter="20">
        <el-form :model="record" ref="record" :rules="rules">
          <el-col v-if="type !== '$all'" :span="6">
            <el-form-item :prop="type">
              <el-input v-model="record[type]" size="small" :placeholder="$t(`Clients.${type}`)"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="topic">
              <el-input v-model="record.topic" size="small" :placeholder="$t('Topics.topic')"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="access">
              <emq-select v-model="record.access" size="small" :field="{ options: accessOptions }"> </emq-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="action">
              <emq-select v-model="record.action" size="small" :field="{ options: actionOptions }"> </emq-select>
            </el-form-item>
          </el-col>
        </el-form>
        <div class="col-oper">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="save">
            {{ $t('Base.add') }}
          </el-button>
        </div>
      </el-row>
    </div>
    <el-table :data="tableData" class="data-list" v-loading="listLoading">
      <el-table-column v-if="type !== '$all'" :prop="type" :label="$t(`Clients.${type}`)"> </el-table-column>
      <el-table-column prop="topic" :label="$t('Topics.topic')"> </el-table-column>
      <el-table-column prop="action" :label="$t('Modules.action')"> </el-table-column>
      <el-table-column prop="access" :label="$t('Modules.isAllow')">
        <template slot-scope="{ row }">
          {{ row.access === 'allow' ? $t('Modules.allow') : $t('Modules.deny') }}
        </template>
      </el-table-column>
      <el-table-column prop="oper" width="120px">
        <template slot-scope="{ row }">
          <el-button type="dashed danger" size="mini" @click="handleDelete(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <el-pagination
        v-if="count > 10"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[10, 50, 100, 500]"
        :page-size.sync="aclParams._limit"
        :current-page.sync="aclParams._page"
        :total="count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { loadAcl, addAcl, deleteAcl, delete$allAcl } from '@/api/modules'

export default {
  name: 'AclTablePage',

  props: {
    type: {
      type: String,
      default: 'username',
    },
  },

  data() {
    return {
      tableData: [],
      listLoading: false,
      addLoading: false,
      record: {
        action: 'pubsub',
        access: 'allow',
      },
      rules: {
        topic: { required: true, message: this.$t('Clients.pleaseEnter') },
        access: { required: true, message: this.$t('Clients.pleaseEnter') },
        action: { required: true, message: this.$t('Clients.pleaseEnter') },
        username: { required: true, message: this.$t('Clients.pleaseEnter') },
        clientid: { required: true, message: this.$t('Clients.pleaseEnter') },
      },
      aclParams: {
        _limit: 10,
        _page: 1,
      },
      count: 0,
      accessOptions: [
        { label: this.$t('Modules.allow'), value: 'allow' },
        { label: this.$t('Modules.deny'), value: 'deny' },
      ],
      actionOptions: [
        { label: 'pub', value: 'pub' },
        { label: 'sub', value: 'sub' },
        { label: 'pubsub', value: 'pubsub' },
      ],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.listLoading = true
      const data = await loadAcl(this.type, { ...this.aclParams })
      const {
        items = [],
        meta: { count = 0 },
      } = data
      this.tableData = items
      this.count = count
      this.listLoading = false
    },
    async save() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        this.addLoading = true
        const { ...data } = this.record
        const res = await addAcl(data)
        if (res[0].result === 'ok') {
          this.$message.success(this.$t('Base.createSuccess'))
          this.loadData()
          this.$refs.record.resetFields()
        }
        this.addLoading = false
      })
    },
    handleSizeChange() {
      this.loadData()
    },
    handleCurrentPageChange() {
      this.loadData()
    },
    async handleDelete(row) {
      this.$confirm(this.$t('Modules.confirmDelete'), this.$t('Base.warning'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          let res
          if (this.type !== '$all') {
            res = await deleteAcl(this.type, row[this.type], row.topic)
          } else {
            res = await delete$allAcl(row.topic)
          }
          if (res) {
            this.loadData()
            this.$message.success(this.$t('Base.deleteSuccess'))
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss">
.acl-table-page {
  .emq-table-header {
    padding-bottom: 3px;
  }
  .add-form {
    display: block;
    width: 100%;
    .el-select {
      width: 100%;
    }
    .col-oper {
      .el-button {
        margin-left: 12px;
      }
    }
  }
  .data-list {
    clear: both;
  }
  .col-oper {
    margin-top: 13px;
  }
  .el-col-6,
  .el-col-4 {
    margin-top: 9px;
  }
}
</style>
