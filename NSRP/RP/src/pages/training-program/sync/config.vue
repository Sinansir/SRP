<template>
  <div class="program-sync-config">
    <t-card title="教务同步配置" :bordered="false">
      <t-space direction="vertical" style="width: 100%">
        <!-- 配置表单 -->
        <t-form ref="form" :data="formData" :rules="rules" label-width="120px">
          <t-divider>基本配置</t-divider>
          
          <t-form-item label="同步服务地址" name="serviceUrl">
            <t-input
              v-model="formData.serviceUrl"
              placeholder="请输入教务系统同步服务地址"
              :style="{ width: '500px' }"
            />
          </t-form-item>
          
          <t-form-item label="API密钥" name="apiKey">
            <t-input
              v-model="formData.apiKey"
              type="password"
              placeholder="请输入API密钥"
              :style="{ width: '500px' }"
            />
          </t-form-item>
          
          <t-form-item label="连接超时时间" name="connectTimeout">
            <t-input-number
              v-model="formData.connectTimeout"
              placeholder="请输入连接超时时间"
              :style="{ width: '200px' }"
              :min="1"
              :max="60"
              unit="秒"
            />
          </t-form-item>

          <t-divider>同步设置</t-divider>
          
          <t-form-item label="同步频率" name="syncFrequency">
            <t-radio-group v-model="formData.syncFrequency">
              <t-radio value="manual">手动同步</t-radio>
              <t-radio value="daily">每日同步</t-radio>
              <t-radio value="weekly">每周同步</t-radio>
              <t-radio value="monthly">每月同步</t-radio>
            </t-radio-group>
          </t-form-item>
          
          <t-form-item 
            v-if="formData.syncFrequency !== 'manual'" 
            label="同步时间" 
            name="syncTime"
          >
            <t-time-picker
              v-model="formData.syncTime"
              format="HH:mm"
              placeholder="请选择同步时间"
              :style="{ width: '200px' }"
              allow-input
            />
          </t-form-item>
          
          <t-form-item 
            v-if="formData.syncFrequency === 'weekly'" 
            label="同步日期" 
            name="syncDay"
          >
            <t-select
              v-model="formData.syncDay"
              :options="weekdayOptions"
              placeholder="请选择星期几同步"
              :style="{ width: '200px' }"
              clearable
            />
          </t-form-item>
          
          <t-form-item 
            v-if="formData.syncFrequency === 'monthly'" 
            label="同步日期" 
            name="syncDate"
          >
            <t-select
              v-model="formData.syncDate"
              :options="dateOptions"
              placeholder="请选择每月几号同步"
              :style="{ width: '200px' }"
              clearable
            />
          </t-form-item>

          <t-divider>数据配置</t-divider>
          
          <t-form-item label="同步内容" name="syncContent">
            <t-checkbox-group v-model="formData.syncContent">
              <t-checkbox value="program">培养方案</t-checkbox>
              <t-checkbox value="course">课程信息</t-checkbox>
              <t-checkbox value="teacher">教师信息</t-checkbox>
              <t-checkbox value="student">学生信息</t-checkbox>
              <t-checkbox value="class">班级信息</t-checkbox>
            </t-checkbox-group>
          </t-form-item>
          
          <t-form-item label="数据冲突处理" name="conflictStrategy">
            <t-radio-group v-model="formData.conflictStrategy">
              <t-radio value="override">覆盖本地数据</t-radio>
              <t-radio value="keep">保留本地数据</t-radio>
              <t-radio value="merge">智能合并</t-radio>
              <t-radio value="manual">手动确认</t-radio>
            </t-radio-group>
          </t-form-item>
          
          <t-form-item label="同步日志级别" name="logLevel">
            <t-select
              v-model="formData.logLevel"
              :options="logLevelOptions"
              placeholder="请选择日志级别"
              :style="{ width: '200px' }"
              clearable
            />
          </t-form-item>

          <t-divider>通知设置</t-divider>
          
          <t-form-item label="同步通知" name="enableNotification">
            <t-switch v-model="formData.enableNotification" />
          </t-form-item>
          
          <t-form-item 
            v-if="formData.enableNotification" 
            label="通知接收邮箱" 
            name="notificationEmail"
          >
            <t-input
              v-model="formData.notificationEmail"
              placeholder="请输入通知接收邮箱"
              :style="{ width: '300px' }"
            />
          </t-form-item>
          
          <t-form-item 
            v-if="formData.enableNotification" 
            label="通知事件" 
            name="notificationEvents"
          >
            <t-checkbox-group v-model="formData.notificationEvents">
              <t-checkbox value="success">同步成功</t-checkbox>
              <t-checkbox value="error">同步失败</t-checkbox>
              <t-checkbox value="conflict">数据冲突</t-checkbox>
              <t-checkbox value="warning">警告信息</t-checkbox>
            </t-checkbox-group>
          </t-form-item>
          
          <t-form-item>
            <t-space>
              <t-button theme="primary" type="submit" @click="onSubmit">保存配置</t-button>
              <t-button theme="default" variant="base" @click="onReset">重置</t-button>
              <t-button theme="success" @click="testConnection">测试连接</t-button>
            </t-space>
          </t-form-item>
        </t-form>

        <!-- 测试连接对话框 -->
        <t-dialog
          v-model:visible="testDialogVisible"
          header="测试连接"
          :footer="false"
          width="500px"
        >
          <t-loading :loading="testLoading" :fullscreen="false" :indicator="true">
            <div class="test-connection-result">
              <template v-if="testStatus === 'loading'">
                <p>正在测试连接，请稍候...</p>
              </template>
              <template v-else-if="testStatus === 'success'">
                <div class="success-icon">
                  <t-icon name="check-circle-filled" style="font-size: 48px; color: var(--td-success-color)" />
                </div>
                <p class="success-message">连接成功！</p>
                <p class="detail-message">成功连接到教务系统，可以正常同步数据。</p>
                <t-button theme="primary" @click="testDialogVisible = false">确定</t-button>
              </template>
              <template v-else-if="testStatus === 'error'">
                <div class="error-icon">
                  <t-icon name="close-circle-filled" style="font-size: 48px; color: var(--td-error-color)" />
                </div>
                <p class="error-message">连接失败！</p>
                <p class="detail-message">无法连接到教务系统，请检查服务地址和API密钥是否正确。</p>
                <t-button theme="primary" @click="testDialogVisible = false">关闭</t-button>
              </template>
            </div>
          </t-loading>
        </t-dialog>
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

// 表单引用
const form = ref(null);

// 表单数据
const formData = reactive({
  serviceUrl: 'https://edu-api.example.edu/sync',
  apiKey: '',
  connectTimeout: 30,
  syncFrequency: 'manual',
  syncTime: '03:00',
  syncDay: '1',
  syncDate: '1',
  syncContent: ['program', 'course'],
  conflictStrategy: 'merge',
  logLevel: 'info',
  enableNotification: false,
  notificationEmail: '',
  notificationEvents: ['error', 'conflict'],
});

// 表单验证规则
const rules = {
  serviceUrl: [{ required: true, message: '请输入同步服务地址', type: 'error' }],
  apiKey: [{ required: true, message: '请输入API密钥', type: 'error' }],
  connectTimeout: [{ required: true, message: '请输入连接超时时间', type: 'error' }],
  syncContent: [{ required: true, message: '请选择同步内容', type: 'error' }],
  notificationEmail: [
    { required: true, message: '请输入通知接收邮箱', type: 'error', trigger: 'blur' },
    { 
      validator: (val) => {
        if (!formData.enableNotification) return true;
        if (!val) return false;
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
      }, 
      message: '请输入正确的邮箱格式', 
      type: 'error',
      trigger: 'blur'  
    }
  ],
};

// 星期几选项
const weekdayOptions = [
  { label: '星期一', value: '1' },
  { label: '星期二', value: '2' },
  { label: '星期三', value: '3' },
  { label: '星期四', value: '4' },
  { label: '星期五', value: '5' },
  { label: '星期六', value: '6' },
  { label: '星期日', value: '7' },
];

// 日期选项
const dateOptions = Array.from({ length: 28 }, (_, i) => ({
  label: `${i + 1}日`,
  value: `${i + 1}`,
}));

// 日志级别选项
const logLevelOptions = [
  { label: '详细', value: 'verbose' },
  { label: '调试', value: 'debug' },
  { label: '信息', value: 'info' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' },
];

// 测试连接相关
const testDialogVisible = ref(false);
const testLoading = ref(false);
const testStatus = ref('loading');

// 提交表单
const onSubmit = async (e) => {
  e.preventDefault();
  if (form.value) {
    const valid = await form.value.validate();
    if (valid) {
      try {
        // 模拟保存
        await new Promise((resolve) => setTimeout(resolve, 1000));
        MessagePlugin.success('配置保存成功');
      } catch (error) {
        MessagePlugin.error('配置保存失败');
        console.error(error);
      }
    }
  }
};

// 重置表单
const onReset = () => {
  if (form.value) {
    form.value.reset();
  }
};

// 测试连接
const testConnection = async () => {
  if (!formData.serviceUrl || !formData.apiKey) {
    MessagePlugin.warning('请先填写服务地址和API密钥');
    return;
  }

  testDialogVisible.value = true;
  testStatus.value = 'loading';
  testLoading.value = true;

  try {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // 随机模拟成功或失败
    const isSuccess = Math.random() > 0.3;
    
    testStatus.value = isSuccess ? 'success' : 'error';
    testLoading.value = false;
  } catch (error) {
    testStatus.value = 'error';
    testLoading.value = false;
    console.error(error);
  }
};
</script>

<style lang="less" scoped>
.program-sync-config {
  padding: 20px;
  
  .test-connection-result {
    padding: 20px;
    text-align: center;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .success-icon,
    .error-icon {
      margin-bottom: 16px;
    }
    
    .success-message,
    .error-message {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .success-message {
      color: var(--td-success-color);
    }
    
    .error-message {
      color: var(--td-error-color);
    }
    
    .detail-message {
      margin-bottom: 20px;
      color: var(--td-text-color-secondary);
    }
  }
}
</style> 