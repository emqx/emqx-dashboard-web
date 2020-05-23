<template>
  <div class="plugins">
    <div class="app-wrapper">

      <a-card class="search-wrapper">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-radio-group v-model="status" size="small" border @change="loadData">
              <el-radio-button label="all">
                {{ $t('Plugins.all') }}({{ state.count }})
              </el-radio-button>
              <el-radio-button label="running">
                {{ $t('Plugins.running') }}({{ state.running }})
              </el-radio-button>
              <el-radio-button label="stop">
                {{ $t('Plugins.stopped') }}({{ state.stop }})
              </el-radio-button>
            </el-radio-group>
          </el-col>

          <el-col :span="4">
            <el-radio-group v-model="displayType" size="small" border>
              <el-radio-button label="cards">
                <icon-font type="icon-qiapianmoshi_kuai"></icon-font>
              </el-radio-button>
              <el-radio-button label="list">
                <icon-font type="icon-liebiaomoshi_kuai"></icon-font>
              </el-radio-button>
            </el-radio-group>
          </el-col>

          <el-col :span="5">
            <emq-select
              v-model="nodeName"
              :field="{ options: nodes }"
              :field-name="{ label: 'name', value: 'node' }"
              size="small"
              @change="loadData"
            >
            </emq-select>
          </el-col>

          <el-col :span="7">
            <el-input
              v-model="searchVal"
              type="text"
              class="search-input"
              size="small"
              clearable
              :placeholder="$t('Plugins.searchByName')"
              @input="searchPlugin"
            >
              <i v-if="!searchLoading" slot="prefix" class="el-icon-search"></i>
              <i v-else slot="prefix" class="el-icon-loading"></i>
            </el-input>
          </el-col>
        </el-row>
      </a-card>

      <el-row
        v-if="displayType === 'cards' && listTableData.length > 0"
        class="emq-list-card plugin-cards-wrapper"
        :gutter="20"
      >
        <el-col v-for="(item, i) in listTableData" :key="i" :span="12">
          <div class="plugin-item">
            <img
              class="logo"
              :src="iconMap[item.name]"
              alt="plugin-logo"
              width="90"
              height="90"
            >

            <div class="header">
              <div class="name">
                <a-badge
                  :status="item.active ? 'success' : 'error'"
                  :text="item.name"
                  dot
                >
                </a-badge>
                <el-tooltip
                  effect="dark"
                  :content="$t('Plugins.tutorial')"
                  :open-delay="500"
                  placement="top"
                >
                  <a
                    v-if="!primaryList.includes(item.name) && getLinks(item.name)"
                    class="tutorial"
                    href="javascript:;" @click="openTutorialLink(item.name)"
                  >
                    <i class="iconfont icon-bangzhu"></i>
                  </a>
                </el-tooltip>
              </div>
              <div class="description">{{ item.description }}</div>
              <div class="type-version">{{ item.version }} / {{ typeText(item.type) }}</div>
            </div>

            <div class="oper">
              <el-button
                v-if="!primaryList.includes(item.name)"
                :type="item.active ? 'danger' : 'dashed'"
                size="small"
                @click="togglePlugin(item)"
              >
                {{ item.active ? $t('Plugins.stop') : $t('Plugins.startRunning') }}
              </el-button>
              <span v-else>--</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <div
        v-if="displayType === 'list' && listTableData.length > 0"
        class="emq-list-card plugin-list-wrapper"
      >
        <div v-for="(item, i) in listTableData" :key="i" :gutter="20" class="plugin-item">

          <img
            class="logo"
            :src="iconMap[item.name]"
            alt="plugin-logo"
            width="60"
            height="60"
          >

          <div class="header">
            <div class="name">
              {{ item.name }}
              <el-tooltip
                effect="dark"
                :content="$t('Plugins.tutorial')"
                :open-delay="500"
                placement="top"
              >
                <a
                  v-if="!primaryList.includes(item.name) && getLinks(item.name)"
                  class="tutorial"
                  href="javascript:;" @click="openTutorialLink(item.name)"
                >
                  <i class="iconfont icon-bangzhu"></i>
                </a>
              </el-tooltip>
            </div>
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
              size="small"
              @click="togglePlugin(item)"
            >
              {{ item.active ? $t('Plugins.stop') : $t('Plugins.startRunning') }}
            </el-button>
            <span v-else>--</span>
          </div>
        </div>
      </div>

      <a-card v-if="listTableData.length === 0" class="null-plugins">
        <p>{{ $t('Plugins.listNull') }}</p>
      </a-card>
    </div>

  </div>
</template>


<script>
import {
  loadPlugins, startPlugin, stopPlugin,
} from '@/api/plugins'
import { loadNodes } from '@/api/common'
import { getPluginsLink, matchSearch } from '@/common/utils'

export default {
  name: 'Plugins',

  props: {},

  data() {
    return {
      searchLoading: false,
      status: 'running',
      displayType: 'cards',
      allCount: 0,
      runningCount: 0,
      stopCount: 0,
      searchVal: '',
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
      this.nodeName = this.nodeName || (this.nodes[0] || {}).node
      this.tableData = await loadPlugins(this.nodeName)
      this.handleFilter()
      this.iconMap = this.loadIcon()
      this.searchVal = ''
    },
    handleFilter() {
      let list = this.tableData
      if (this.status !== 'all') {
        const active = this.status === 'running'
        list = list.filter($ => $.active === active)
      }
      this.listTableData = list
    },
    async togglePlugin(row) {
      if (!row.active) {
        const res = await startPlugin(row.name)
        if (res === null) {
          this.$message.error(this.$t('Plugins.runFailed'))
          return
        }
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
    searchPlugin() {
      this.searchLoading = true
      if (this.searchVal === '') {
        this.handleFilter()
        this.searchLoading = false
        return
      }
      setTimeout(async () => {
        const res = await matchSearch(this.tableData, 'name', this.searchVal)
        if (res) {
          this.listTableData = res
          this.searchLoading = false
        } else {
          this.searchLoading = false
        }
      }, 500)
    },
  },
}
</script>


<style lang="scss">
.plugins {
  .plugin-item {
    position: relative;
    margin: 0;
    font-size: 14px;
    margin: 0;
    padding: 24px 32px;
    background: #fff;
    display: flex;
    .logo {
      border-radius: 4px;
      overflow: hidden;
    }
    .name {
      color: #101010;
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 12px;
    }
    .el-tooltip.tutorial {
      position: relative;
      top: 1px;
    }
    .description {
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      line-height: 22px;
      max-width: 300px;
    }
  }

  .plugin-cards-wrapper {
    .plugin-item {
      height: 140px;
      margin-bottom: 20px;
      .ant-badge-status-text {
        color: #101010;
        font-size: 16px;
      }
      .header {
        flex: 1;
        padding-left: 20px;
        .type-version {
          margin-top: 12px;
          font-style: italic;
        }
        .el-tooltip.tutorial {
          left: 5px;
        }
      }
    }
  }

  .plugin-list-wrapper {
    .plugin-item {
      height: 110px;
      border-bottom: 1px solid #f1f1f1;
      align-items: center;
      .header {
        flex: 1.5;
        padding-left: 50px;
        .el-tooltip.tutorial {
          left: 2px;
        }
      }
      .content {
        margin-left: 40px;
        flex: 1;

        .type, .version {
          color: rgba(0, 0, 0, .55);
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

  .search-wrapper {
    margin-bottom: 30px;
    .el-radio-button--small .el-radio-button__inner {
      font-size: 13px;
    }
    .search-input {
      .el-icon-search, .el-icon-loading {
        position: relative;
        left: 4px;
        top: 7px;
      }
    }
  }

  .null-plugins {
    min-height: 130px;
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
