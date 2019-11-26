<template>
  <div class="plugins">
    <page-header
      :back-title="$t('Plugins.plugin')"
    >
    </page-header>

    <div class="app-wrapper">

      <a-card class="count-list">
        <div class="count-left">
          <div class="count-title">{{ $t('Plugins.numberOfPlugIns') }}</div>
          <div class="count-result">{{ state.count }}</div>
        </div>
        <div class="count-center">
          <div class="count-title">
            {{ $t('Plugins.running') }}
          </div>
          <div class="count-result">{{ state.running }}</div>
        </div>
        <div class="count-right">
          <div class="count-title">
            {{ $t('Plugins.stopped') }}
          </div>
          <div class="count-result">{{ state.stop }}</div>
        </div>
      </a-card>

      <a-card class="emq-list-card">

        <div class="emq-table-header">
          <div>
            <div class="emq-title">
              {{ $t('Plugins.pluginsList') }}
            </div>
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
              <el-radio-button label="1">
                {{ $t('Plugins.running') }}
              </el-radio-button>
              <el-radio-button label="0">
                {{ $t('Plugins.stopped') }}
              </el-radio-button>
              <el-radio-button label="all">
                {{ $t('Plugins.all') }}
              </el-radio-button>
            </el-radio-group>

            <el-radio-group v-model="category" size="mini" border @change="loadData">
              <el-radio-button
                v-for="item in typeFilterOption"
                :key="item.value"
                :label="item.value"
              >
                {{ item.text }}
              </el-radio-button>
              <el-radio-button label="all">
                {{ $t('Plugins.all') }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="plugin-wrapper">
          <template v-if="listTableData.length > 0">
            <div v-for="(item, i) in listTableData" :key="i" :gutter="20" class="plugin-item">

              <div class="logo">
                <img
                  :src="iconMap[item.name]"
                  alt="plugin-logo"
                >
              </div>

              <div class="header">
                <div class="name">{{ item.name }}</div>
                <div class="description">{{ item.description }}</div>
              </div>

              <div class="content">
                <div class="type">{{ typeText(item.type) }}</div>
                <div class="version">{{ item.version }}</div>
              </div>

              <div class="state">
                <a-badge
                  :status="item.active ? 'success' : 'error'"
                  :text="item.active ? $t('Plugins.running') : $t('Plugins.stopped')"
                  dot
                >
                </a-badge>
              </div>

              <div class="oper">
                <el-button
                  v-if="!primaryList.includes(item.name)"
                  :type="item.active ? 'danger' : 'dashed'"
                  size="mini"
                  @click="togglePlugin(item)"
                >
                  {{ item.active ? $t('Plugins.stop') : $t('Plugins.startRunning') }}
                </el-button>
                <span v-else>--</span>
                <template v-if="!primaryList.includes(item.name)">
                  <el-button
                    v-if="getLinks(item.name)"
                    size="mini"
                    type="dashed"
                    @click="openTutorialLink(item.name)"
                  >
                    {{ $t('Plugins.tutorial') }}
                  </el-button>
                </template>
                <!-- TODO: 暂时隐藏 进去后的插件配置暂时没用 -->
                <!-- <el-button
                  v-if="!primaryList.includes(item.name)"
                  size="mini"
                  type="dashed"
                  @click="toConfig(item)"
                >
                  {{ $t('Plugins.config') }}
                </el-button> -->
              </div>
            </div>
          </template>
          <div v-else class="null-plugins">
            <p>{{ $t('Plugins.listNull') }}</p>
          </div>
        </div>

      </a-card>
    </div>

  </div>
</template>


<script>
import {
  loadPlugins, startPlugin, stopPlugin,
} from '@/api/plugins'
import { loadNodes } from '@/api/common'
import { getPluginsLink } from '@/common/utils'

export default {
  name: 'Plugins',

  props: {},

  data() {
    return {
      loadNodes,
      category: 'all',
      status: '1',
      tableData: [],
      listTableData: [],
      nodes: [],
      primaryList: ['emqx_dashboard', 'emqx_management', 'emqx_conf'],
      nodeName: '',
      pluginTypes: {
        auth: this.$t('Plugins.authentication'),
        backend: this.$t('Plugins.backend'),
        bridge: this.$t('Plugins.bridge'),
        protocol: this.$t('Plugins.protocol'),
        feature: this.$t('Plugins.feature'),
      },
      typeFilterOption: [],
      iconMap: {},
    }
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

  created() {
    this.loadData()
    this.typeFilterOption = Object.entries(this.pluginTypes).map(([value, text]) => ({ text, value }))
  },

  methods: {
    typeText(type) {
      const pluginTypes = {
        auth: this.$t('Plugins.authentication'),
        backend: this.$t('Plugins.backend'),
        bridge: this.$t('Plugins.bridge'),
        protocol: this.$t('Plugins.protocol'),
        feature: this.$t('Plugins.feature'),
      }
      return pluginTypes[type] || this.$t('Plugins.feature')
    },
    loadIcon() {
      const iconMap = {}
      this.tableData.forEach((item) => {
        const { name } = item
        try {
          // eslint-disable-next-line
          iconMap[name] = require(`../../assets/plugin_icon/${name}.png`)
        } catch (e) {
          console.log(e)
        }
      })
      return iconMap
    },
    toConfig(item = {}) {
      const { name } = item
      const node = this.nodeName
      this.$router.push({
        path: `/plugins/${name}`,
        query: {
          node,
        },
      })
    },
    typeFilterHandler(value, row) {
      return value === row.type
    },
    typeFormatter({ type }) {
      return this.pluginTypes[type] || this.$t('Plugins.feature')
    },
    async loadData() {
      this.nodes = await loadNodes()
      this.nodeName = this.nodeName || (this.nodes[0] || {}).name
      this.tableData = await loadPlugins(this.nodeName)
      this.handleFilter()
      this.iconMap = this.loadIcon()
    },
    handleFilter() {
      let list = this.tableData
      if (this.category !== 'all') {
        list = list.filter($ => $.type === this.category)
      }
      if (this.status !== 'all') {
        const active = this.status === '1'
        list = list.filter($ => $.active === active)
      }
      this.listTableData = list
    },
    async togglePlugin(row) {
      if (!row.active) {
        await startPlugin(row.name)
        row.active = true
        this.$message.success(this.$t('Plugins.runSuccess'))
        return
      }
      this.$msgbox.confirm(this.$t('Plugins.thisActionWillStopThePlugIn'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(async () => {
        await stopPlugin(row.name)
        this.$message.success(this.$t('Plugins.stopSuccess'))
        row.active = false
      }).catch(() => {})
    },
    getLinks(name) {
      return getPluginsLink(name)
    },
    openTutorialLink(name) {
      const url = this.getLinks(name)
      const windowUrl = window.open(url)
      windowUrl.opener = null
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
        border-radius: 4px;
        overflow: hidden;

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
        flex: .6;
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

  .null-plugins {
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
html:lang(en) {
  .plugins .oper .el-button{
    width: 64px;
  }
}
</style>
