<template>
  <a-card
    class="cluster-settings emq-list-card"
  >
    <div class="emq-title">{{ $t('Settings.clusterInfo') }}</div>
    <el-row :gutter="20">
      <el-form
        ref="record"
        class="cluster-form"
        size="small"
        label-suffix=":"
        label-width="120px"
        label-position="left"
        :model="record"
        :rules="rules"
      >
        <el-col :span="12">
          <el-form-item :label="$t('Settings.clusterType')" prop="type">
            <emq-select
              v-model="record.type"
              :disabled="true"
              :field="{ options: clusterTypes }"
            >
            </emq-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item-desc">
          {{ descriptionDict[record.type] || '' }}
        </el-col>
        <template>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.currentNode')">
              <el-row v-for="(node, index) in currentNodes" :key="index">
                <el-col :class="['join-status', node.joined ? 'is-join' : 'not-join']" :span="10">
                  {{ node.name }}
                </el-col>
                <el-col :span="14">
                  <a
                    v-if="node.joined"
                    href="javascript:;"
                    @click="toDetails(node.name)"
                  >
                    {{ $t('Overview.view') }}
                  </a>
                  <!-- static -->
                  <span
                    v-else-if="!node.joined && record.type === 'static'"
                    class="not-join__desc"
                  >
                    {{ $t('Settings.notJoined') }}
                  </span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>

          <!-- manual -->
          <template v-if="record.type === 'manual'">
            <el-col :span="12">
              <el-form-item prop="config.node">
                <el-input v-model="record.config.node"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="form-item-desc">
              <a href="javascript:;" @click="handleInviteNode">
                {{ $t('Settings.invite') }}
              </a>
            </el-col>
          </template>

        </template>

        <!-- DNS -->
        <template v-if="record.type === 'dns'">
          <el-col :span="12">
            <el-form-item :label="$t('Settings.dnsName')" prop="config.name">
              <el-input v-model="record.config.name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.app')" prop="config.app">
              <el-input v-model="record.config.app" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
            {{ $t('Settings.app_desc') }}
          </el-col>
        </template>

        <!-- mcast -->
        <template v-if="record.type === 'mcast'">
          <el-col :span="12">
            <el-form-item :label="$t('Settings.addr')" prop="config.addr">
              <el-input v-model="record.config.addr" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.ports')" prop="config.ports">
              <el-input v-model="record.config.ports" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.iface')" prop="config.iface">
              <el-input v-model="record.config.iface" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.ttl')" prop="config.ttl">
              <el-input v-model="record.config.ttl" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.loop')" prop="config.loop">
              <el-input v-model="record.config.loop" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
        </template>

        <!-- etcd -->
        <template v-if="record.type === 'etcd'">
          <el-col :span="12">
            <el-form-item :label="$t('Settings.server')" prop="config.server">
              <el-input v-model="record.config.server" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.prefix')" prop="config.prefix">
              <el-input v-model="record.config.prefix" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
            {{ $t('Settings.prefix_desc') }}
          </el-col>
          <el-col :span="12">
            <el-form-item label="TTL" prop="config.node_ttl">
              <el-input v-model="record.config.node_ttl" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
        </template>

        <!-- k8s -->
        <template v-if="record.type === 'k8s'">
          <el-col :span="12">
            <el-form-item :label="$t('Settings.apiserver')" prop="config.apiserver">
              <el-input v-model="record.config.apiserver" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.service_name')" prop="config.service_name">
              <el-input v-model="record.config.service_name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.address_type')" prop="config.address_type">
              <el-input v-model="record.config.address_type" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
            {{ $t('Settings.address_type_desc') }}
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.app_name')" prop="config.app_name">
              <el-input v-model="record.config.app_name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
            {{ $t('Settings.app_name_desc') }}
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.namespace')" prop="config.namespace">
              <el-input v-model="record.config.namespace" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Settings.suffix')" prop="config.suffix">
              <el-input v-model="record.config.suffix" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="form-item-desc">
          </el-col>
        </template>

      </el-form>
    </el-row>
  </a-card>
</template>


<script>
import { loadCluster, loadNodes, inviteNode } from '../../api/cluster'

export default {
  name: 'ClusterSettings',

  data() {
    return {
      record: {
        config: {},
      },
      rules: {
        config: {
          node: { required: true, message: this.$t('Settings.nodeRequired') },
        },
      },
      clusterTypes: [
        { label: this.$t('Settings.manual'), value: 'manual' },
        { label: this.$t('Settings.dns'), value: 'dns' },
        { label: this.$t('Settings.static'), value: 'static' },
        { label: this.$t('Settings.mcast'), value: 'mcast' },
        { label: this.$t('Settings.etcd'), value: 'etcd' },
        { label: this.$t('Settings.k8s'), value: 'k8s' },
      ],
      currentNodes: [], // [{ name: node, joined: true }]
      descriptionDict: {},
    }
  },

  created() {
    this.getCluster()
  },

  methods: {
    async getCluster() {
      const res = await loadCluster()
      this.record = res
      const nodes = await loadNodes()
      const seeds = this.record.config.seeds || []
      this.currentNodes = this.getNodes(nodes, seeds)
    },
    async handleInviteNode() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      const res = await inviteNode(this.record)
      if (res) {
        this.$message.success(this.$t('Settings.inviteSuccess'))
        this.getCluster()
      }
    },
    toDetails(name) {
      this.$router.push({
        path: '/monitor/node',
        query: {
          name,
        },
      })
    },
    // Static 判断节点是否加入
    getNodes(currentNodes, seeds) {
      if (!seeds.length) {
        return currentNodes.map(node => ({ name: node, joined: true }))
      }
      const unique = arr => [...new Set(arr)]
      const allNodes = [...currentNodes, ...seeds]
      const diff = allNodes.filter(item => allNodes.indexOf(item) === allNodes.lastIndexOf(item))
      const uniqueNodes = unique(allNodes)

      return uniqueNodes.map((node) => {
        const data = { name: node, joined: true }
        if (diff.includes(node)) {
          data.joined = false
        }
        return data
      })
    },
  },
}
</script>


<style lang="scss">
.cluster-settings {
  .emq-title {
    margin: 0px;
  }
  .cluster-form {
    .join-status {
      &:not(.not-point)::before {
        content: '';
        display: inline-block;
        height: 8px;
        width: 8px;
        margin-right: 2px;
        border-radius: 4px;
        background-color: transparent;
      }
      &.is-join {
        &::before {
          background-color: #34C388;
        }
      }
      &.not-join {
        &::before {
          background-color: #AFAFAF;
        }
      }
    }
    .not-join__desc {
      color: #AFAFAF;
    }
  }
}
</style>
