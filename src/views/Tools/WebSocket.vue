<template>
  <div class="websocket">
    <page-header
      back-title="WebSocket"
    >
    </page-header>

    <div class="app-wrapper">

      <el-tabs
        v-model="activeTab"
        type="card"
        :before-leave="handleBeforeLeave"
        @tab-remove="handleTabEdit"
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
        <el-tab-pane
          key="add"
          class="add-btn"
          name="add"
        >
          <span slot="label">
            <i class="el-icon-plus"></i>
          </span>
        </el-tab-pane>
      </el-tabs>

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
    // 活动标签切换时触发
    handleBeforeLeave(currentName) {
      if (currentName === 'add') {
        this.handleTabEdit('add')
        return false
      }
      return true
    },
    handleTabEdit(targetName) {
      if (targetName === 'add') {
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

  .el-tabs--card > .el-tabs__header
  .el-tabs__item .el-icon-close, .el-icon-plus {
    font-weight: 600;
    overflow: visible;
  }

  .el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item:nth-child(2),
  .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2),
  .el-tabs--top .el-tabs--left>.el-tabs__header .el-tabs__item:nth-child(2),
  .el-tabs--top .el-tabs--right>.el-tabs__header .el-tabs__item:nth-child(2) {
    padding: 0 13px;
  }

  #tab-add.el-tabs__item {
    width: 43px;
    padding: 0 13px;
  }

  .el-badge__content {
    background: #f56c6c;
    transform: scale(0.8);
    border: none;
    &.is-fixed {
      right: -14px;
    }
  }
}

/* padding: 0 13px; 解决hover时的字体偏移 */
html:lang(zh) {
  .websocket {
    .el-tabs {
      .el-tabs__item {
        width: 86px;
        padding: 0 13px;
        &.is-active {
          padding: 0 13px;
        }
      }
    }
  }
}
html:lang(en) {
  .websocket {
    .el-tabs {
      .el-tabs__item {
        width: 76px;
        padding: 0 13px;
        &.is-active {
          padding: 0 13px;
        }
      }
    }
  }
}
</style>
