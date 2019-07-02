<template>
  <div class="websocket">
    <div class="websocket-header">
      <el-badge
        v-for="(item, i) in sessions"
        :key="i"
        is-dot
        class="session-item"
        :hidden="item.clear"
      >
        <el-button
          :type="activeIndex === i ? 'primary' : 'dashed'"
          :icon="stateIcon[item.state]"
          size="small"
          @click="sessionChange(i)">
        </el-button>
      </el-badge>

      <el-tooltip effect="dark" content="新建会话" placement="top" :visible-arrow="false">
        <el-button class="session-btn" circle size="small" icon="el-icon-plus"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>


<script>
export default {
  name: 'WebSocket',

  components: {},

  props: {},

  data() {
    return {
      stateIcon: {
        0: 'el-icon-message',
        1: 'el-icon-loading',
        3: 'el-icon-warning',
      },
      activeIndex: 0,
      sessions: [
        {
          clear: false,
          connection: false,
          state: 1,
        },
        {
          clear: false,
          state: 1,
        },
        {
          clear: false,
          state: 0,
        },
        {
          clear: true,
          state: 3,
        },
      ],
    }
  },

  methods: {
    sessionChange(i) {},
  },

  created() {},
}
</script>


<style lang="scss">
.websocket {
  .websocket-header {
    background-color: #fff;
    padding: 10px;
  }

  .session-item {
    margin-right: 12px;
  }

  .session-btn {
    float: right;
  }
}
</style>
