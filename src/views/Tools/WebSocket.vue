<template>
  <div class="websocket">
    <page-header
      back-title="WebSocket"
    >
      <el-tabs
        v-model="activeTab"
        class="page-header-footer"
        addable
        @edit="handleTabEdit"
      >
        <el-tab-pane
          v-for="(item, i) in tabs"
          :key="i"
          :closable="i > 0"
          :name="item.name"
        >
          <span slot="label">
            <el-badge
              class="message-count"
              :hidden="item.messageCount === 0"
              :value="item.messageCount"
              :max="99"
            >
              {{ item.label }}
            </el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
    </page-header>

    <div class="app-wrapper">
      <web-socket-item
        v-for="(item, i) in tabs"
        v-show="item.name === activeTab"
        :ref="item.name"
        :key="i"
        :message-count.sync="item.messageCount"
      ></web-socket-item>
    </div>

  </div>
</template>


<script>
import WebSocketItem from './components/WebSocketItem'

export default {
  name: 'WebSocket',

  components: { WebSocketItem },

  props: {},

  data() {
    return {
      activeTab: '0',
      tabs: [
        {
          name: '0',
          label: this.$t('Tools.defaultConnection'),
          messageCount: 0,
        },
      ],
    }
  },

  watch: {
    activeTab(val, oldVal) {
      const ins = this.tabs.find($ => $.name === val)
      const insOld = this.tabs.find($ => $.name === oldVal)

      if (insOld) {
        insOld.messageCount = 0
      }
      if (!ins) {
        ins.messageCount = 0
      }
    },
  },

  methods: {
    handleTabEdit(targetName, action) {
      if (action === 'add') {
        if (this.tabs.length > 6) {
          this.$message.error(this.$t('Tools.maxSix'))
          return
        }
        const name = this.tabs.length.toString()
        this.tabs.push({
          name,
          label: this.$t('Tools.connectionName'),
          messageCount: 0,
        })
        this.activeTab = name
      } else {
        const ins = this.$refs[targetName] && this.$refs[targetName][0]
        if (!ins) {
          return
        }
        if (ins.client && ins.client.connected) {
          ins.client.end()
        }
        this.tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = this.tabs[index + 1] || this.tabs[index - 1]
            if (nextTab) {
              this.activeTab = nextTab.name
            }
          }
        })
        this.tabs = this.tabs.filter($ => $.name !== targetName)
      }
    },
  },

}
</script>


<style lang="scss">
.websocket {
  position: relative;

  .page-header {
    height: 130px;
  }

  .el-badge__content {
    transform: scale(0.8);
    &.is-fixed {
      top: -3px !important;
      right: -6px !important;
    }
  }

  .page-header-footer {
    position: absolute;
    bottom: -14px;

    .el-tabs__item {
      .el-icon-close {
        position: relative;
        top: 2px;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}
</style>
