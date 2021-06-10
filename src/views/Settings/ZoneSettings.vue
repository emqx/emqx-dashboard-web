<template>
  <el-card shadow="never" class="zone-settings emq-list-card">
    <el-tabs v-model="settingType" :before-leave="handleBeforeLeave">
      <el-tab-pane v-for="(item, index) in zoneList" :key="index" label="" :name="item.name">
        <div slot="label" size="mini" class="label-box">
          {{ item.name }}
          <span
            :class="item.name === settingType ? 'delete-icon' : 'hide-delete'"
            @click="deleteZone(item.name)"
          >
            <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
          </span>
        </div>
        <config-detail
          v-if="settingType === item.name && item.configs"
          :ref="item.name"
          oper="edit"
          :editConfig="item.configs"
          :btn-loading="saveLoading"
          from="zone"
          v-model="disabled"
          @update="handleUpdate(...arguments)"
        >
        </config-detail>
      </el-tab-pane>
      <el-tab-pane label="" name="addZone">
        <span slot="label" size="mini">
          <el-button type="success" icon="el-icon-plus" circle size="mini"></el-button>
        </span>
        <config-detail
          v-if="settingType === 'addZone'"
          oper="add"
          ref="addZone"
          v-model="disabled"
          from="zone"
          :btn-loading="saveLoading"
          @update="handleUpdate(...arguments)"
        ></config-detail>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { loadZoneConfigs, updateOneConfig, addOneConfig, deleteOneZone } from '../../api/settings'
import ConfigDetail from './components/ConfigDetail'

export default {
  name: 'ZoneSettings',

  components: {
    ConfigDetail,
  },

  data() {
    return {
      saveLoading: false,
      settingType: 'external',
      disabled: false,
      zoneList: [],
      canChangeTab: false,
    }
  },

  computed: {
    lang() {
      return this.$store.state.lang
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    async handleBeforeLeave(activeName, oldName) {
      if (!this.canChangeTab && activeName !== oldName) {
        if (!this.disabled) {
          const status = await this.$confirm(
            this.$t('Settings.noSaveConfirm'),
            this.$t('Base.warning'),
            {
              type: 'warning',
              cancelButtonText: this.$t('Settings.no'),
            },
          )
          if (status === 'confirm') {
            const child = this.$refs[oldName].length ? this.$refs[oldName][0] : this.$refs[oldName]
            child.cancel(false)
            return true
          }
          return false
        }
      }
      return true
    },
    async loadData(oper) {
      const zoneResList = await loadZoneConfigs()
      this.zoneList = zoneResList
      if (oper !== 'edit') {
        this.settingType = this.zoneList[0].name
        this.canChangeTab = true
        setTimeout(() => {
          this.canChangeTab = false
        }, 2)
      }
    },
    async handleUpdate(name, record) {
      this.saveLoading = true
      let res
      if (this.settingType !== 'addZone') {
        res = await updateOneConfig('zones', this.settingType, record)
      } else {
        res = await addOneConfig('zones', { name, configs: record })
      }
      if (res) {
        const oper = !name ? 'edit' : 'add'
        this.disabled = true
        this.loadData(oper)
        this.settingType = name || this.settingType
        this.updataSuccessTip(name)
      }
      this.saveLoading = false
    },
    updataSuccessTip(name) {
      if (!name) {
        this.$message.success(this.$t('Base.applySuccess'))
      } else {
        this.$message.success(this.$t('Base.createSuccess'))
      }
    },
    async deleteZone(name) {
      this.$confirm(this.$t('Settings.isDeleteZone'), this.$t('Base.warning'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          const res = await deleteOneZone(name)
          if (res) {
            this.$message.success(this.$t('Base.deleteSuccess'))
            this.loadData()
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss">
.zone-settings {
  .el-tabs__item {
    padding-right: 30px;
    padding-left: 5px;
    &.is-active {
      .delete-icon {
        visibility: hidden;
      }
      &:hover {
        .delete-icon {
          visibility: visible;
        }
      }
    }
  }
  .label-box {
    position: relative;
    .delete-icon {
      position: absolute;
      cursor: pointer;
      right: -20px;
      top: 0px;
      color: #aaa;
      &:hover {
        color: #23bd78;
      }
    }
    .hide-delete {
      display: none;
    }
    .delete-icon {
      right: -26px;
    }
  }
}
</style>
