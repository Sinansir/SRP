<template>
  <div class="syllabus-audit-container">
    <t-card title="教学大纲审核" bordered>
      <div class="content">
        <t-empty description="暂无审核数据" />
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
// 后续实现
</script>

<style lang="less" scoped>
.syllabus-audit-container {
  padding: 20px;
  
  .content {
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style> 