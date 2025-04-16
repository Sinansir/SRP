<template>
  <div class="role-management-container">
    <t-card title="角色管理" bordered>
      <div class="content">
        <t-empty description="暂无角色数据" />
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
// 后续实现角色管理功能
</script>

<style lang="less" scoped>
.role-management-container {
  padding: 20px;
  
  .content {
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style> 