<template>
  <div class="major-report-container">
    <t-card title="专业分析报告" bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary">生成报告</t-button>
          <t-button>导出</t-button>
        </t-space>
      </template>
      <div class="content-placeholder">
        <t-empty description="暂无专业分析报告数据" />
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 后续开发将使用此变量，暂时未使用
const isLoading = ref(false);
</script>

<style lang="less" scoped>
.major-report-container {
  padding: 20px;
  
  .content-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }
}
</style> 