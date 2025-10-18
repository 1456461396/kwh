<script setup>
defineProps({
  title: {
    require: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <!-- 定制标题 -->
        <span>{{ title }}</span>
        <div class="btn">
          <!-- 具名插槽 定制 按钮 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 默认插槽 传数据 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
