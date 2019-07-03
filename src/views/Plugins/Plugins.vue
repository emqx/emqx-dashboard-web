<template>
  <div class="plugins">
    <el-card class="count-list" style="display: none">
      <div class="count-left">
        <div class="count-title">插件数量</div>
        <div class="count-result">24个插件</div>
      </div>
      <div class="count-center">
        <div class="count-title">已启用</div>
        <div class="count-result">10</div>
      </div>
      <div class="count-right">
        <div class="count-title">错误捕获</div>
        <div class="count-result">22次</div>
      </div>
    </el-card>


    <a-card
      class="emq-list-card"
      title="插件列表"
    >

      <div class="emq-table-header" style="display: none">
        <el-radio-group v-model="category" size="mini" @change="changeCategory">
          <el-radio-button label="0">全部</el-radio-button>
          <el-radio-button label="1">安全</el-radio-button>
          <el-radio-button label="2">数据</el-radio-button>
          <el-radio-button label="3">功能</el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="status" size="mini" @change="changeStatus">
          <el-radio-button label="0">全部</el-radio-button>
          <el-radio-button label="1">运行中</el-radio-button>
        </el-radio-group>
      </div>


      <el-table :data="tableData" :default-sort="{ prop: 'active', order: 'descending' }" class="data-list">
        <el-table-column prop="name" min-width="110px" label="插件名称"></el-table-column>
        <el-table-column prop="version" min-width="80px" label="版本"></el-table-column>
        <el-table-column prop="description" min-width="160px" show-overflow-tooltip label="描述"></el-table-column>
        <el-table-column
          prop="type"
          min-width="100px"
          label="类型"
          sortable
          :filters="typeFilterOption"
          :filter-method="typeFilterHandler"
          :formatter="typeFormatter"
        ></el-table-column>
        <el-table-column min-width="70px" prop="active" label="状态" sortable>
          <template slot-scope="{ row }">
            <a-badge
              :status="row.active ? 'success' : 'error'"
              :text="row.active ? '运行中' : '已停止'"
              dot
            >
            </a-badge>
          </template>
        </el-table-column>
        <el-table-column width="140px">
          <template slot-scope="{ row }">
            <el-button :type="row.active ? 'danger' : 'dashed'" size="mini" @click="togglePlugin(row)">
              {{ row.active ? '停止' : '启动' }}
            </el-button>
            <el-button size="mini">配置</el-button>
          </template>
        </el-table-column>

      </el-table>

      <div class="list-wrapper">
        <div v-for="(item, i) in tableData" :key="i" class="plugin-item">
          <div class="plugin-logo">
            <img src="https://www.emqx.io/static/img/logo.png">
          </div>

          <div class="basic-info">
            <div class="name">
              {{ item.name }}
              <!--<el-tag size="mini" color="transparent">{{ item.type }}</el-tag>-->
            </div>
            <p class="description">{{ item.description }}</p>
          </div>


          <div>
            <p>EMQ 官方</p>
            <p>{{ item.version }}</p>
          </div>
          <div>
            <p v-if="item.active" class="status">
              <span class="dot active"></span>已启动
            </p>
            <p v-else class="status">
              <span class="dot"></span>已停止
              <span class="error">错误 1</span>
            </p>
            <p>2019/06/19 11:22:00</p>
          </div>
          <div>
            <el-link v-if="item.active" :underline="false">停止</el-link>
            <el-link v-else type="success" :underline="false">启动</el-link>
            <el-link type="info" :underline="false">配置</el-link>
          </div>
        </div>
      </div>

    </a-card>

  </div>
</template>


<script>
import {
  loadPlugins, loadNodes, startPlugin, stopPlugin,
} from '@/api/common'

export default {
  name: 'Alerts',

  props: {},

  data() {
    return {
      category: 0,
      status: 0,
      tableData: [],
      nodes: [],
      nodeName: 'emqx@127.0.0.1',
      pluginTypes: {
        auth: '认证',
        feature: '基础',
        backend: '持久化',
        bridge: '桥接',
        protocol: '协议拓展',
      },
      typeFilterOption: [],
    }
  },

  created() {
    this.loadData()
    this.typeFilterOption = Object.entries(this.pluginTypes).map(([value, text]) => ({ text, value }))
  },

  methods: {
    typeFilterHandler(value, row) {
      return value === row.type
    },
    typeFormatter({ type }) {
      return this.pluginTypes[type] || '其他'
    },
    async loadData() {
      this.nodes = await loadNodes()
      this.nodeName = (this.nodes[0] || {}).name
      this.tableData = await loadPlugins(this.nodeName)
    },
    changeCategory(newValue) {
      console.log(newValue)
    },
    changeStatus(newValue) {
      console.log(newValue)
    },
    async togglePlugin(row) {
      if (!row.active) {
        await startPlugin(this.nodeName, row.name)
        row.active = true
        return
      }
      this.$msgbox.confirm('此操作将停止该插件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await stopPlugin(this.nodeName, row.name)
        this.$message.success('停止成功')
        row.active = false
      }).catch(() => {})
    },
  },
}
</script>


<style lang="scss">
.plugins {
  .count-list {
    overflow: hidden;
    text-align: center;
    padding: 10px 20px;
    margin-bottom: 30px;

    .count-left {
      width: 140px;
      float: left;
    }

    .count-center {
      width: 140px;
      display: inline-block;
    }

    .count-right {
      width: 140px;
      float: right;
    }

    .count-title {
      color: #808080;
      margin-bottom: 10px;
    }

    .count-result {
      color: #101010;
      font-size: 24px;
      font-weight: 400;
    }
  }


  .plugins {

  }

  .list-wrapper {
    display: none;

    .plugin-item {
    }
  }
}
</style>
