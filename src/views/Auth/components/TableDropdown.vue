<template>
  <el-dropdown class="table-dropdown" @command="handleCommand(rowData, $event)">
    <el-button class="dropdown-btn" size="mini">
      <i class="el-icon-more"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <!-- <el-dropdown-item command="setting">
        <i class="el-icon-setting"></i>
        {{ $t('Auth.setting') }}
      </el-dropdown-item> -->
      <!-- <el-dropdown-item :disabled="tableDataLen === 1" command="moveUp">
        <i class="el-icon-top"></i>
        {{ $t('Auth.moveUp') }}
      </el-dropdown-item>
      <el-dropdown-item :disabled="tableDataLen === 1" command="moveDown">
        <i class="el-icon-bottom"></i>
        {{ $t('Auth.moveDown') }}
      </el-dropdown-item> -->
      <el-dropdown-item v-if="rowData.enable" class="danger" command="disable">
        <i class="el-icon-switch-button"></i>
        {{ $t('Auth.disable') }}
      </el-dropdown-item>
      <el-dropdown-item v-else command="enable">
        <i class="el-icon-video-play"></i>
        {{ $t('Auth.enable') }}
      </el-dropdown-item>
      <el-dropdown-item command="delete">
        <i class="el-icon-delete"></i>
        {{ $t('Base.delete') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TableDropdown',
  props: {
    tableDataLen: {
      required: true,
      type: Number,
    },
    rowData: {
      required: true,
      type: Object,
    },
  },
  setup() {
    const handleCommand = function (row, command) {
      switch (command) {
        case 'disable':
          row.enable = false
          this.$emit('update', row)
          break
        case 'enable':
          row.enable = true
          this.$emit('update', row)
          break
        case 'delete':
          this.$emit('delete', row.id)
        default:
          break
      }
    }
    return {
      handleCommand,
    }
  },
})
</script>

<style scoped>
.dropdown-btn {
  padding: 1px 6px;
}
.el-dropdown-menu__item.danger {
  color: #e34242;
}
</style>
