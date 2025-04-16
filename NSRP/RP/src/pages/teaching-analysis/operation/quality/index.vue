<template>
  <div class="quality-monitoring-container">
    <t-card title="质量监控" bordered>
      <div class="content">
        <t-empty description="暂无质量监控数据" />
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
// 后续实现质量监控功能
</script>

<style lang="less" scoped>
.quality-monitoring-container {
  padding: 20px;
  
  .content {
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style> 