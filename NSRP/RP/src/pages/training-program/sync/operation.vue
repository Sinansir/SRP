<template>
  <div class="sync-operation">
    <t-card title="同步操作" :bordered="false">
      <t-space direction="vertical" size="large" style="width: 100%">
        <!-- 同步状态信息 -->
        <t-alert theme="info" :icon="true">
          <template #message>
            <t-space>
              <span>上次同步时间: {{ lastSyncTime ? formatDate(lastSyncTime) : '暂无记录' }}</span>
              <t-divider layout="vertical" />
              <span>同步状态: {{ syncStatus }}</span>
            </t-space>
          </template>
        </t-alert>

        <!-- 同步选项 -->
        <t-form ref="form" :data="formData" :colon="true" :label-width="100">
          <t-form-item label="同步方向" name="direction">
            <t-radio-group v-model="formData.direction">
              <t-radio value="push">推送到教务系统</t-radio>
              <t-radio value="pull">从教务系统获取</t-radio>
              <t-radio value="both">双向同步</t-radio>
            </t-radio-group>
          </t-form-item>

          <t-form-item label="同步内容" name="content">
            <t-checkbox-group v-model="formData.content">
              <t-checkbox value="program">培养方案</t-checkbox>
              <t-checkbox value="course">课程</t-checkbox>
              <t-checkbox value="teacher">教师</t-checkbox>
              <t-checkbox value="student">学生</t-checkbox>
            </t-checkbox-group>
          </t-form-item>

          <t-form-item label="同步范围" name="scope">
            <t-radio-group v-model="formData.scope">
              <t-radio value="all">全部</t-radio>
              <t-radio value="increment">增量</t-radio>
              <t-radio value="custom">自定义</t-radio>
            </t-radio-group>
          </t-form-item>

          <t-form-item label="同步策略" name="strategy">
            <t-radio-group v-model="formData.strategy">
              <t-radio value="overwrite">覆盖现有数据</t-radio>
              <t-radio value="merge">合并现有数据</t-radio>
              <t-radio value="skip">跳过冲突</t-radio>
            </t-radio-group>
          </t-form-item>

          <t-form-item v-if="formData.scope === 'custom'" label="自定义条件" name="customCondition">
            <t-textarea v-model="formData.customCondition" placeholder="请输入自定义同步条件" />
          </t-form-item>

          <t-form-item>
            <t-space>
              <t-button theme="primary" @click="startSync" :loading="syncing">
                开始同步
              </t-button>
              <t-button theme="default" @click="resetForm">
                重置
              </t-button>
            </t-space>
          </t-form-item>
        </t-form>

        <!-- 同步进度 -->
        <t-progress
          v-if="syncing"
          :percentage="syncProgress"
          :label="syncProgressLabel"
          :status="syncProgressStatus"
        />

        <!-- 同步结果摘要 -->
        <t-alert v-if="showSyncResult" :theme="syncResultTheme" :icon="true">
          <template #message>
            {{ syncResultMessage }}
          </template>
          <template #description>
            <div>
              <t-space direction="vertical">
                <span>同步完成时间: {{ formatDate(syncEndTime) }}</span>
                <span>同步耗时: {{ syncDuration }}秒</span>
                <span>处理记录数: {{ totalItems }}</span>
                <span>成功: {{ successItems }}，失败: {{ failedItems }}，跳过: {{ skippedItems }}</span>
              </t-space>
            </div>
          </template>
        </t-alert>
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

// 表单数据
const formData = reactive({
  direction: 'pull',
  content: ['program', 'course'],
  scope: 'increment',
  strategy: 'merge',
  customCondition: ''
});

const form = ref(null);
const syncing = ref(false);
const syncProgress = ref(0);
const showSyncResult = ref(false);
const lastSyncTime = ref<Date | null>(null);
const syncEndTime = ref<Date | null>(new Date());
const syncDuration = ref(0);
const totalItems = ref(0);
const successItems = ref(0);
const failedItems = ref(0);
const skippedItems = ref(0);
const syncResultTheme = ref<'success' | 'warning' | 'error' | 'info'>('success');

// 同步状态计算属性
const syncStatus = computed(() => {
  if (syncing.value) {
    return '正在同步中';
  }
  return lastSyncTime.value ? '就绪' : '未同步';
});

// 进度状态计算属性
const syncProgressStatus = computed(() => {
  if (syncProgress.value === 100) {
    return 'success';
  }
  return 'active';
});

// 进度标签计算属性
const syncProgressLabel = computed(() => {
  return `${syncProgress.value}%`;
});

// 结果信息计算属性
const syncResultMessage = computed(() => {
  if (syncResultTheme.value === 'success') {
    return '同步完成';
  } else if (syncResultTheme.value === 'warning') {
    return '同步完成，但有部分数据同步失败';
  } else if (syncResultTheme.value === 'error') {
    return '同步失败';
  }
  return '';
});

// 格式化日期
const formatDate = (date: Date | null) => {
  if (!date) return '';
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// 开始同步
const startSync = () => {
  if (!formData.content.length) {
    MessagePlugin.warning('请至少选择一项同步内容');
    return;
  }

  syncing.value = true;
  syncProgress.value = 0;
  showSyncResult.value = false;
  
  // 模拟同步进度
  const timer = setInterval(() => {
    syncProgress.value += 10;
    if (syncProgress.value >= 100) {
      clearInterval(timer);
      finishSync();
    }
  }, 1000);
  
  // 实际应用中，这里应该调用后端API进行同步
  // const params = {...formData};
  // api.startSync(params).then(response => {
  //   updateSyncResult(response);
  //   finishSync();
  // }).catch(error => {
  //   handleSyncError(error);
  //   finishSync();
  // });
};

// 完成同步
const finishSync = () => {
  syncing.value = false;
  showSyncResult.value = true;
  lastSyncTime.value = new Date();
  syncEndTime.value = new Date();
  
  // 模拟同步结果数据
  syncDuration.value = Math.floor(Math.random() * 60) + 30;
  totalItems.value = Math.floor(Math.random() * 1000) + 100;
  successItems.value = Math.floor(totalItems.value * 0.9);
  failedItems.value = Math.floor(totalItems.value * 0.05);
  skippedItems.value = totalItems.value - successItems.value - failedItems.value;
  
  if (failedItems.value > 0) {
    syncResultTheme.value = failedItems.value > totalItems.value * 0.2 ? 'error' : 'warning';
  } else {
    syncResultTheme.value = 'success';
  }
  
  // 实际应用中，这里应该处理后端返回的同步结果数据
};

// 重置表单
const resetForm = () => {
  formData.direction = 'pull';
  formData.content = ['program', 'course'];
  formData.scope = 'increment';
  formData.strategy = 'merge';
  formData.customCondition = '';
  showSyncResult.value = false;
};
</script>

<style lang="less" scoped>
.sync-operation {
  padding: 20px 0;
}
</style> 