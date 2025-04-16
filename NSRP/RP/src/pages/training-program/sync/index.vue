<template>
  <div class="program-sync">
    <t-card :bordered="false">
      <template #title>
        <t-tabs v-model="activeTab">
          <t-tab-panel value="sync" label="同步操作">
            <template #panel>
              <sync-operation />
            </template>
          </t-tab-panel>
          <t-tab-panel value="log" label="同步记录">
            <template #panel>
              <sync-log />
            </template>
          </t-tab-panel>
          <t-tab-panel value="config" label="同步配置">
            <template #panel>
              <sync-config />
            </template>
          </t-tab-panel>
        </t-tabs>
      </template>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import syncOperation from './operation.vue';
import syncLog from './log.vue';
import syncConfig from './config.vue';

const activeTab = ref('sync');
</script>

<style lang="less" scoped>
.program-sync {
  padding: 20px;
}
</style> 