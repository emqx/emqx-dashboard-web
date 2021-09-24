<template>
  <div>
    <el-table :data="topicList">
      <el-table-column :label="'Topic ID'">
        <template #default="{ row }">
          <el-input v-model="row.id" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="'Topic'">
        <template #default="{ row }">
          <el-input v-model="row.topic" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="80">
        <template slot="header" slot-scope="scope">
          <el-button size="mini" @click="addTopic()" :disabled="disableAdd(scope)">
            {{ $t('Base.add') }}
          </el-button>
        </template>
        <template #default="{ row }">
          <el-button size="mini" @click="delTopic(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'TopicEditList',
  props: {
    list: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  setup(props, context) {
    let topicList = ref(props.list)
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    const findUniqueOverflow = (nums, max) => {
      let num
      for (let i = 1, y = max; i < max; i++) {
        if (!Array.prototype.includes.call(nums, i)) {
          num = i
          break
        }
      }
      return num
    }

    const addTopic = () => {
      let ids = [0]
      Array.prototype.forEach.call(topicList.value, (v) => {
        ids.push(+v.id || 0)
      })
      let maxCandidate = Math.max(...ids) + 1
      let maxNum = 65535
      if (maxCandidate > maxNum) {
        maxCandidate = findUniqueOverflow(ids, maxNum)
      }
      topicList.value.push({
        id: maxCandidate,
        topic: '',
      })
    }

    const disableAdd = () => {
      return topicList.value.length >= 10
    }

    const delTopic = (row) => {
      topicList.value = topicList.value.filter((v) => v !== row)
    }

    watch(
      () => [...topicList.value],
      (v) => {
        context.emit('update:list', v)
      },
    )

    return {
      tl,
      topicList,
      addTopic,
      disableAdd,
      delTopic,
    }
  },
})
</script>

<style lang="scss" scoped></style>
