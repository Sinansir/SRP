<template>
  <div class="warning-monitoring-container">
    <t-card title="预警监控" bordered>
      <div class="content">
        <t-empty description="暂无预警数据" />
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
// 待实现
</script>

<style lang="less" scoped>
.warning-monitoring-container {
  padding: 20px;
  
  .content {
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style> 