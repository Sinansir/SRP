<template>
  <div class="syllabus-search-container">
    <t-card title="教学大纲搜索" bordered>
      <div class="content">
        <t-empty description="暂无搜索数据" />
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
// 待实现
</script>

<style lang="less" scoped>
.syllabus-search-container {
  padding: 20px;
  
  .content {
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style> 