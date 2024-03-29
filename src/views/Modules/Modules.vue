<template>
  <div class="modules">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          <div class="content-left">
            {{ $t('Modules.modules') }}
            <span v-cloak class="modules-num">{{ moduleCount }}</span>
            <el-button class="confirm-btn" type="primary" size="small" @click="$router.push('/modules/select')">
              {{ $t('Modules.moduleAdd') }}
            </el-button>
          </div>
          <el-col :span="6">
            <el-input
              v-model="searchVal"
              type="text"
              class="search-input"
              size="small"
              clearable
              :placeholder="$t('Modules.searchTip')"
              @input="searchModule"
            >
              <i v-if="!searchLoading" slot="prefix" class="el-icon-search"></i>
              <i v-else slot="prefix" class="el-icon-loading"></i>
            </el-input>
          </el-col>
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <el-row v-if="showList.length" :gutter="20" class="emq-list-card plugin-cards-wrapper">
        <el-col v-for="item in showList" :key="item.id" :span="24" class="module-list-item">
          <div class="item-box">
            <div class="module-item" @click="toEditModule(item)">
              <div class="left-box">
                <img :src="item.img" alt="module-logo" class="item-img" />
                <div class="item-content">
                  <div class="item-title">{{ item.title[lang] }}</div>
                  <div class="item-des">
                    {{ item.description[lang] }}
                  </div>
                </div>
              </div>
              <div class="item-handle">
                <div class="handle-oper">
                  <el-button type="danger" size="small" v-if="item.enabled" @click.stop="updataModule(item, false)">{{
                    $t('Modules.stop')
                  }}</el-button>
                  <el-button type="primary" size="small" v-else @click.stop="updataModule(item, true)">{{
                    $t('Modules.start')
                  }}</el-button>
                  <el-button class="know-more" size="small" @click.stop="toEditModule(item)">{{
                    $t('Modules.moduleEdit')
                  }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <a-card v-else class="null-modules">
        <p v-if="list.length">{{ $t('Modules.listNull') }}</p>
        <p v-else>{{ $t('Modules.noData') }}</p>
      </a-card>
    </div>
  </div>
</template>

<script>
import { loadCreatedModules, updateModule, destroyModule } from '@/api/modules'
import { matchSearch } from '@/common/utils'

export default {
  name: 'Modules',

  data() {
    return {
      searchLoading: false,
      searchVal: '',
      list: [],
      showList: [],
      moduleCount: 0,
      selectedModule: {},
      canManageModuleTypes: [
        'mnesia_authentication',
        'jwt_authentication',
        'auth_sasl',
        'lwm2m_protocol',
        'topic_metrics',
      ],
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
    manageModule(item) {
      if (this.canManageModuleTypes.indexOf(item.type) === -1) {
        return
      }
      this.$router.push(`/modules/manage?type=${item.type}`)
    },
    deleteModule(item) {
      this.$msgbox
        .confirm(this.$t('Modules.thisActionWillDeleteTheModule'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          await destroyModule(item.id)
          this.$message.success(this.$t('Base.deleteSuccess'))
          const addedModules = JSON.parse(localStorage.getItem('addedModules')) || {}
          delete addedModules[item.type]
          localStorage.setItem('addedModules', JSON.stringify(addedModules))
          this.loadData()
        })
        .catch(() => {})
    },
    async updataModule(item, val) {
      if (!val) {
        this.$msgbox
          .confirm(this.$t('Modules.thisActionWillStopTheModule'), {
            confirmButtonText: this.$t('Base.confirm'),
            cancelButtonText: this.$t('Base.cancel'),
            type: 'warning',
          })
          .then(async () => {
            await updateModule(item.id, { enabled: val })
            this.$message.success(this.$t('Modules.stopSuccess'))
            item.enabled = val
          })
          .catch(() => {})
      } else {
        await updateModule(item.id, { enabled: val })
        this.$message.success(this.$t('Modules.startSuccess'))
        item.enabled = val
      }
    },
    searchModule() {
      this.searchLoading = true
      if (this.searchVal === '') {
        this.showList = this.list
        this.searchLoading = false
        return
      }
      setTimeout(async () => {
        const res = await matchSearch(this.list, 'localTitle', this.searchVal)
        if (res) {
          this.showList = res
          this.searchLoading = false
        } else {
          this.searchLoading = false
        }
      }, 500)
    },
    toEditModule(item) {
      this.selectedModule = item
      this.selectedModule.from = 'modules'
      this.selectedModule.oper = 'edit'
      this.$store.dispatch('UPDATE_MODULE', this.selectedModule)
      this.$router.push('/modules/detail')
    },
    async loadData() {
      this.searchVal = ''
      const addedModules = {}
      this.list = []
      this.list = await loadCreatedModules()
      this.moduleCount = this.list.length
      if (this.moduleCount) {
        this.list.forEach((item) => {
          item.localTitle = item.title[this.lang]
          try {
            // eslint-disable-next-line
            item.img = require(`../../assets/module_icon/${item.type}.png`)
          } catch (e) {
            console.log(e)
          }
          addedModules[item.type] = item.id
        })
        localStorage.setItem('addedModules', JSON.stringify(addedModules))
      } else {
        localStorage.removeItem('addedModules')
      }
      this.showList = this.list
    },
  },
}
</script>

<style lang="scss" scoped>
@import './style/module.scss';

.modules {
  .stop-btn {
    width: 52px;
    color: #ff0000;
    border: 1px solid #ff0000;
    font-size: 14px;
    background-color: #fbf2f2;
  }

  .content {
    justify-content: space-between;
  }

  .modules-num {
    margin-left: 7px !important;
  }

  .item-handle {
    cursor: default;
    i {
      cursor: pointer;
    }
  }
}
</style>
