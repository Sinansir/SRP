<template>
  <div class="container">
    <router-view v-if="route.path !== '/ai-analysis/report'" />
    <t-card v-else class="general-card" title="智能分析报告">
      <t-space direction="vertical" size="medium" style="width: 100%">
        <t-row :gutter="[16, 16]">
          <t-col :span="8">
            <t-card hoverable @click="router.push('/ai-analysis/report/college')">
              <template #cover>
                <div class="card-cover">
                  <t-icon name="chart-bar" size="56px" />
                </div>
              </template>
              <h3 style="text-align: center; margin: 12px 0">
                学院分析报告
              </h3>
              <p style="text-align: center; color: rgba(0,0,0,.6)">
                查看学院教学数据分析
              </p>
            </t-card>
          </t-col>
          <t-col :span="8">
            <t-card hoverable @click="router.push('/ai-analysis/report/major')">
              <template #cover>
                <div class="card-cover">
                  <t-icon name="chart-bubble" size="56px" />
                </div>
              </template>
              <h3 style="text-align: center; margin: 12px 0">
                专业分析报告
              </h3>
              <p style="text-align: center; color: rgba(0,0,0,.6)">
                查看专业教学数据分析
              </p>
            </t-card>
          </t-col>
          <t-col :span="8">
            <t-card hoverable @click="router.push('/ai-analysis/report/custom')">
              <template #cover>
                <div class="card-cover">
                  <t-icon name="edit" size="56px" />
                </div>
              </template>
              <h3 style="text-align: center; margin: 12px 0">
                自定义报告
              </h3>
              <p style="text-align: center; color: rgba(0,0,0,.6)">
                创建自定义分析报告
              </p>
            </t-card>
          </t-col>
        </t-row>
      </t-space>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
</script>

<style scoped lang="less">
.container {
  padding: 20px;
  
  .card-cover {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    background-color: var(--td-brand-color-light);
    color: var(--td-brand-color);
  }
}
</style> 