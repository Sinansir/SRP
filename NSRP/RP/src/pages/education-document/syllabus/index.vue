<template>
  <div class="container">
    <router-view v-if="route.path !== '/education-document/syllabus'" />
    <a-card v-else class="general-card" title="教学大纲">
      <a-space direction="vertical" size="medium" fill>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-card hoverable @click="router.push('/education-document/syllabus/search')">
              <template #cover>
                <div class="card-cover">
                  <icon-search :size="56" />
                </div>
              </template>
              <a-typography-title :heading="6" style="text-align: center">
                大纲查询
              </a-typography-title>
              <a-typography-paragraph style="text-align: center">
                查询已有教学大纲
              </a-typography-paragraph>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card hoverable @click="router.push('/education-document/syllabus/create')">
              <template #cover>
                <div class="card-cover">
                  <icon-plus-circle :size="56" />
                </div>
              </template>
              <a-typography-title :heading="6" style="text-align: center">
                新建大纲
              </a-typography-title>
              <a-typography-paragraph style="text-align: center">
                创建新的教学大纲
              </a-typography-paragraph>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card hoverable @click="router.push('/education-document/syllabus/audit')">
              <template #cover>
                <div class="card-cover">
                  <icon-check-circle :size="56" />
                </div>
              </template>
              <a-typography-title :heading="6" style="text-align: center">
                大纲审核
              </a-typography-title>
              <a-typography-paragraph style="text-align: center">
                审核教学大纲
              </a-typography-paragraph>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card hoverable @click="router.push('/education-document/syllabus/detail/1')">
              <template #cover>
                <div class="card-cover">
                  <icon-file :size="56" />
                </div>
              </template>
              <a-typography-title :heading="6" style="text-align: center">
                示例大纲
              </a-typography-title>
              <a-typography-paragraph style="text-align: center">
                查看示例教学大纲
              </a-typography-paragraph>
            </a-card>
          </a-col>
        </a-row>
      </a-space>
    </a-card>
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
    background-color: rgb(var(--primary-1));
    color: rgb(var(--primary-6));
  }
}
</style> 