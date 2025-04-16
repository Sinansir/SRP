<template>
  <div class="dashboard-recent-container">
    <t-card title="最近活动" bordered>
      <div class="content">
        <t-empty description="暂无最近活动数据" />
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
// 后续实现
</script>

<style lang="less" scoped>
.dashboard-recent-container {
  padding: 20px;
  
  .content {
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style> 