<template>
  <div class="dashboard-notice-container">
    <t-card title="通知中心" bordered>
      <div class="content">
        <t-empty description="暂无通知数据" />
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
// 待实现
</script>

<style lang="less" scoped>
.dashboard-notice-container {
  padding: 20px;
  
  .content {
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style> 