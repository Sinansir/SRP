<template>
  <div class="program-change-apply">
    <t-card title="方案变更申请" :bordered="false">
      <t-space direction="vertical" size="large" style="width: 100%">
        <t-form ref="form" :data="formData" :rules="rules" label-width="120px">
          <t-form-item label="方案名称" name="programName">
            <t-input v-model="formData.programName" placeholder="请输入方案名称" />
          </t-form-item>
          <t-form-item label="专业" name="major">
            <t-select v-model="formData.major" placeholder="请选择专业" clearable>
              <t-option v-for="item in majorOptions" :key="item.value" :label="item.label" :value="item.value" />
            </t-select>
          </t-form-item>
          <t-form-item label="变更类型" name="changeType">
            <t-select v-model="formData.changeType" placeholder="请选择变更类型" clearable>
              <t-option v-for="item in changeTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </t-select>
          </t-form-item>
          <t-form-item label="变更原因" name="reason">
            <t-textarea v-model="formData.reason" placeholder="请输入变更原因" :autosize="{ minRows: 3, maxRows: 5 }" />
          </t-form-item>
          <t-form-item label="变更内容" name="content">
            <t-textarea 
              v-model="formData.content"
              placeholder="请输入变更内容"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
          <t-form-item label="附件" name="attachments">
            <t-upload
              v-model="formData.attachments"
              :action="uploadAction"
              theme="file-flow"
              :headers="uploadHeaders"
              :max="5"
              :size-limit="{ size: 10, unit: 'MB' }"
              :format-response="formatResponse"
              @success="handleSuccess"
              @fail="handleFail"
            />
          </t-form-item>
          <t-form-item>
            <t-space>
              <t-button theme="primary" type="submit" @click="onSubmit">提交申请</t-button>
              <t-button theme="default" variant="base" @click="onReset">重置</t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { ref, reactive } from 'vue';

// 表单数据
const formData = reactive({
  programName: '',
  major: '',
  changeType: '',
  reason: '',
  content: '',
  attachments: [],
});

// 表单验证规则
const rules = {
  programName: [{ required: true, message: '请输入方案名称', type: 'error' }],
  major: [{ required: true, message: '请选择专业', type: 'error' }],
  changeType: [{ required: true, message: '请选择变更类型', type: 'error' }],
  reason: [{ required: true, message: '请输入变更原因', type: 'error' }],
  content: [{ required: true, message: '请输入变更内容', type: 'error' }],
};

// 专业选项
const majorOptions = ref([
  { label: '计算机科学与技术', value: '1' },
  { label: '软件工程', value: '2' },
  { label: '网络工程', value: '3' },
  { label: '信息安全', value: '4' },
  { label: '物联网工程', value: '5' },
]);

// 变更类型选项
const changeTypeOptions = ref([
  { label: '培养目标变更', value: '1' },
  { label: '核心课程变更', value: '2' },
  { label: '课程体系调整', value: '3' },
  { label: '毕业要求调整', value: '4' },
  { label: '课程内容调整', value: '5' },
]);

// 上传配置
const uploadAction = '/api/program/change/upload';
const uploadHeaders = {};

// 格式化上传响应
const formatResponse = (res: any) => {
  return {
    url: res.data?.url || '',
    name: res.data?.name || '',
    size: res.data?.size || 0,
  };
};

// 上传成功回调
const handleSuccess = (_response: any) => {
  MessagePlugin.success('上传成功');
};

// 上传失败回调
const handleFail = (_response: any) => {
  MessagePlugin.error('上传失败');
};

// 提交表单
const onSubmit = async (e: Event) => {
  e.preventDefault();
  try {
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1000));
    MessagePlugin.success('提交成功');
  } catch (error) {
    MessagePlugin.error('提交失败');
  }
};

// 重置表单
const onReset = () => {
  Object.keys(formData).forEach((key) => {
    if (key === 'attachments') {
      formData[key] = [];
    } else {
      formData[key] = '';
    }
  });
};
</script>

<style lang="less" scoped>
.program-change-apply {
  padding: 20px;
}
</style> 