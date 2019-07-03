<template>
  <div class="plugins">


    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              首页
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              插件
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">插件</div>
        </div>

      </div>
    </div>

    <div class="app-wrapper">


      <a-card class="count-list">
        <div class="count-left">
          <div class="count-title">插件数量</div>
          <div class="count-result">{{ state.count }}个插件</div>
        </div>
        <div class="count-center">
          <div class="count-title">运行中</div>
          <div class="count-result">{{ state.running }}个</div>
        </div>
        <div class="count-right">
          <div class="count-title">已停止</div>
          <div class="count-result">{{ state.stop }}个</div>
        </div>
      </a-card>

      <a-card class="emq-list-card">



        <div class="emq-table-header">
          <div>
            <!--<emq-select-->
              <!--v-model="nodeName"-->
              <!--:field="{ api: loadNodes }"-->
              <!--:field-name="{ label: 'name', value: 'name' }"-->
              <!--size="mini"-->
              <!--@change="loadData"-->
            <!--&gt;-->
            <!--</emq-select>-->

            <div class="emq-title">
              插件列表
            </div>
            <!--<span class="btn btn-default" style="margin-left: 12px">节点选择</span>-->
          </div>

          <div class="search-wrapper">
            <emq-select
              v-model="nodeName"
              :field="{ api: loadNodes }"
              :field-name="{ label: 'name', value: 'name' }"
              size="mini"
              @change="loadData"
            >
            </emq-select>

            <el-radio-group v-model="status" size="mini" border @change="loadData">
              <el-radio-button label="wivwiv">全部</el-radio-button>
              <el-radio-button label="1">运行中</el-radio-button>
              <el-radio-button label="0">已停止</el-radio-button>
            </el-radio-group>

            <el-radio-group v-model="category" size="mini" border @change="loadData">
              <el-radio-button label="wivwiv">全部</el-radio-button>
              <el-radio-button
                v-for="item in typeFilterOption"
                :key="item.value"
                :label="item.value">
                {{ item.text }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>


        <div class="plugin-wrapper">
          <div v-for="(item, i) in listTableData" :key="i" :gutter="20" class="plugin-item">

            <div class="logo">
              <img src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" alt="plugin-logo">
            </div>

            <div class="header">
              <div class="name">{{ item.name }}</div>
              <div class="description">{{ item.description }}</div>
            </div>

            <div class="content">
              <div class="type">{{ item.type | typeText }}</div>
              <div class="version">{{ item.version }}</div>
            </div>

            <div class="state">
              <a-badge
                :status="item.active ? 'success' : 'error'"
                :text="item.active ? '运行中' : '已停止'"
                dot
              >
              </a-badge>
            </div>

            <div class="oper">
              <el-button :type="item.active ? 'danger' : 'dashed'" size="mini" @click="togglePlugin(item)">
                {{ item.active ? '停 止' : '启 动' }}
              </el-button>
              <el-button size="mini" type="dashed">配 置</el-button>
            </div>
          </div>
        </div>


        <el-table v-if="false" :data="listTableData" :default-sort="{ prop: 'active', order: 'descending' }"
                  class="data-list">
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
                {{ row.active ? '停 止' : '启 动' }}
              </el-button>
              <el-button size="mini" type="dashed">配 置</el-button>
            </template>
          </el-table-column>

        </el-table>

      </a-card>
    </div>

  </div>
</template>


<script>
import {
  loadPlugins, loadNodes, startPlugin, stopPlugin,
} from '@/api/common'

export default {
  name: 'Plugins',

  props: {},

  data() {
    return {
      loadNodes,
      category: 'wivwiv',
      status: 'wivwiv',
      tableData: [],
      listTableData: [],
      nodes: [],
      nodeName: '',
      pluginTypes: {
        feature: '最新',
        auth: '认证',
        backend: '持久化',
        bridge: '桥接',
        protocol: '协议',
      },
      typeFilterOption: [],
    }
  },

  created() {
    this.loadData()
    this.typeFilterOption = Object.entries(this.pluginTypes).map(([value, text]) => ({ text, value }))
  },

  computed: {
    state() {
      const tableData = this.tableData || []
      return {
        count: tableData.length,
        running: tableData.filter($ => !!$.active).length,
        stop: tableData.filter($ => !$.active).length,
      }
    },
  },

  filters: {
    typeText(type) {
      const pluginTypes = {
        feature: '最新',
        auth: '认证',
        backend: '持久化',
        bridge: '桥接',
        protocol: '协议',
      }
      return pluginTypes[type] || '其他'
    },
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
      this.nodeName = this.nodeName || (this.nodes[0] || {}).name
      this.tableData = await loadPlugins(this.nodeName)
      this.handleFilter()
    },
    handleFilter() {
      let list = this.tableData
      if (this.category !== 'wivwiv') {
        list = list.filter($ => $.type === this.category)
      }
      if (this.status !== 'wivwiv') {
        const active = this.status === '1'
        list = list.filter($ => $.active === active)
      }
      console.log(list, 'x')
      this.listTableData = list
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
  .plugin-wrapper {
    .plugin-item {
      padding: 16px 0;
      border-bottom: 1px solid #f1f1f1;
      display: flex;
      align-items: center;
      position: relative;

      .logo {
        position: absolute;
        top: 24px;
        left: 0;

        img {
          width: 48px;
          height: 48px;
        }
      }

      .header {
        flex: 1.2;
        padding-left: 70px;

        .name {
          margin-bottom: 4px;
          color: rgba(0, 0, 0, .65);
          font-size: 14px;
          line-height: 22px;
        }

        .description {
          color: rgba(0, 0, 0, .45);
          font-size: 14px;
          line-height: 22px;
          max-width: 300px;
        }
      }

      .content {
        margin-left: 40px;
        flex: 1;

        .type {
          color: rgba(0, 0, 0, .45);
          margin-top: 4px;
          margin-bottom: 0;
          line-height: 22px;
        }

        .version {
          color: rgba(0, 0, 0, .45);
          margin-top: 4px;
          margin-bottom: 0;
          line-height: 22px;
        }
      }

      .state {
        height: 18px;
        flex: 1;
      }

      .oper {
        flex: .5;
      }
    }
  }

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


  .search-wrapper {
    .el-radio-group {
      margin-left: 20px;
    }
  }
  .emq-table-header {
    margin-bottom: 30px;
  }
}
</style>
