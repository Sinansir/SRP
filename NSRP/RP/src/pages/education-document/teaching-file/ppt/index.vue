<template>
  <div class="ppt-upload-container">
    <t-card title="PPT上传" bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleUpload">上传PPT</t-button>
          <t-button theme="default" @click="handleReset">重置</t-button>
        </t-space>
      </template>
      <t-space direction="vertical" size="large" style="width: 100%">
        <t-form ref="form" :data="formData" :rules="rules" label-width="120px">
          <t-form-item label="课程名称" name="courseName">
            <t-select
              v-model="formData.courseName"
              placeholder="请选择课程"
              clearable
              :options="courseOptions"
            />
          </t-form-item>
          <t-form-item label="学期" name="semester">
            <t-select
              v-model="formData.semester"
              placeholder="请选择学期"
              clearable
              :options="semesterOptions"
            />
          </t-form-item>
          <t-form-item label="PPT标题" name="title">
            <t-input v-model="formData.title" placeholder="请输入PPT标题" />
          </t-form-item>
          <t-form-item label="PPT描述" name="description">
            <t-textarea
              v-model="formData.description"
              placeholder="请输入PPT描述"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
          <t-form-item label="PPT文件" name="files">
            <t-upload
              v-model="formData.files"
              theme="file"
              action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              :headers="{ token: 'mock-token' }"
              :max-size="10 * 1024 * 1024"
              :format-response="formatResponse"
              :accept="'.ppt,.pptx'"
              @success="handleSuccess"
              @validate="handleValidate"
            >
              <t-button theme="default">
                <template #icon>
                  <t-icon name="upload" />
                </template>
                选择文件
              </t-button>
              <span class="upload-tips">请上传PPT格式文件（.ppt/.pptx），单个文件不超过10MB</span>
            </t-upload>
          </t-form-item>
        </t-form>

        <t-divider />

        <h3>已上传PPT列表</h3>
        <t-table
          :data="pptList"
          :columns="columns"
          :hover="true"
          :stripe="true"
          :pagination="pagination"
          @page-change="onPageChange"
        />
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

const formData = reactive({
  courseName: '',
  semester: '',
  title: '',
  description: '',
  files: [],
});

const rules = {
  courseName: [{ required: true, message: '请选择课程', type: 'error' }],
  semester: [{ required: true, message: '请选择学期', type: 'error' }],
  title: [{ required: true, message: '请输入PPT标题', type: 'error' }],
  files: [{ required: true, message: '请上传PPT文件', type: 'error' }],
};

// 课程选项
const courseOptions = [
  { label: '计算机网络', value: '计算机网络' },
  { label: '操作系统', value: '操作系统' },
  { label: '软件工程', value: '软件工程' },
  { label: '数据结构', value: '数据结构' },
  { label: '数据库系统原理', value: '数据库系统原理' },
];

// 学期选项
const semesterOptions = [
  { label: '2023-2024学年第一学期', value: '2023-2024-1' },
  { label: '2023-2024学年第二学期', value: '2023-2024-2' },
  { label: '2024-2025学年第一学期', value: '2024-2025-1' },
];

const form = ref(null);

// PPT列表
const pptList = ref([
  {
    id: '1',
    title: '计算机网络第一章 - 网络体系结构',
    courseName: '计算机网络',
    semester: '2023-2024-1',
    fileName: '计算机网络第一章.pptx',
    fileSize: '2.5MB',
    uploadTime: '2023-09-01 10:30:45',
  },
  {
    id: '2',
    title: '计算机网络第二章 - 物理层',
    courseName: '计算机网络',
    semester: '2023-2024-1',
    fileName: '计算机网络第二章.pptx',
    fileSize: '3.1MB',
    uploadTime: '2023-09-08 14:22:10',
  },
]);

const columns = [
  { colKey: 'title', title: 'PPT标题', width: '200' },
  { colKey: 'courseName', title: '课程名称', width: '120' },
  { colKey: 'semester', title: '学期', width: '160' },
  { colKey: 'fileName', title: '文件名', width: '180' },
  { colKey: 'fileSize', title: '文件大小', width: '100' },
  { colKey: 'uploadTime', title: '上传时间', width: '160' },
  {
    colKey: 'operation',
    title: '操作',
    width: '160',
    cell: () => (
      <t-space>
        <t-button theme="primary" variant="text" onClick={() => handlePreview()}>
          预览
        </t-button>
        <t-button theme="primary" variant="text" onClick={() => handleDownload()}>
          下载
        </t-button>
        <t-button theme="danger" variant="text" onClick={() => handleDelete()}>
          删除
        </t-button>
      </t-space>
    ),
  },
];

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
  pageSizeOptions: [5, 10, 20],
  showJumper: true,
  showPageSize: true,
  showTotal: true,
});

const onPageChange = (curr, pageInfo) => {
  pagination.current = curr;
  pagination.pageSize = pageInfo.pageSize;
  // 实际应用中，这里需要调用API获取分页数据
};

// 格式化上传响应
const formatResponse = (res) => {
  return { ...res.data, name: res.data.name };
};

// 上传成功回调
const handleSuccess = (file) => {
  MessagePlugin.success(`文件 ${file.name} 上传成功`);
};

// 校验文件大小和格式
const handleValidate = (validateResult) => {
  if (validateResult && validateResult.type === 'OVER_SIZE_LIMIT') {
    MessagePlugin.warning(`文件大小超过限制`);
  }
  if (validateResult && validateResult.type === 'FILE_OVER_SIZE_LIMIT') {
    MessagePlugin.warning(`文件 ${validateResult.files[0].name} 大小超过限制`);
  }
};

// 上传按钮点击
const handleUpload = () => {
  form.value?.validate().then((result) => {
    if (!result) {
      // 校验通过，提交表单
      MessagePlugin.success('PPT上传成功');
      
      // 添加到列表
      pptList.value.unshift({
        id: String(pptList.value.length + 1),
        title: formData.title,
        courseName: formData.courseName,
        semester: formData.semester,
        fileName: formData.files[0]?.name || 'unknown.pptx',
        fileSize: '1.0MB',
        uploadTime: new Date().toLocaleString(),
      });
      
      // 重置表单
      form.value?.reset();
      formData.files = [];
    }
  });
};

// 重置表单
const handleReset = () => {
  form.value?.reset();
  formData.files = [];
};

// 预览文件
const handlePreview = () => {
  MessagePlugin.info('文件预览功能开发中...');
};

// 下载文件
const handleDownload = () => {
  MessagePlugin.info('文件下载中...');
};

// 删除文件
const handleDelete = () => {
  MessagePlugin.success('文件删除成功');
};
</script>

<style scoped>
.ppt-upload-container {
  margin: 20px;
}

.upload-tips {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.5);
}
</style> 