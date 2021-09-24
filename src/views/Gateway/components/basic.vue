<template>
  <div>
    <el-card shadow="never">
      <!-- <el-form>
        <div class="part-header">{{ tl('basic') }}</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="tl('maxKeepalive')">
              <el-input size="small">
                <el-select slot="append">
                  <el-option value="m" :label="tl('min')"></el-option>
                  <el-option value="h" :label="tl('hour')"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
          <el-col :span="12"></el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <div class="part-header">{{ tl('mountSetting') }}</div>
        <el-row :gutter="20">
          <el-col :span="12"></el-col>
          <el-col :span="12"></el-col>
          <el-col :span="12"></el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form> -->
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    return {
      tl,
    }
  },
})
</script>

<style lang="scss" scoped></style>
