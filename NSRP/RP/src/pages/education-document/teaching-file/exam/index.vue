<template>
  <div class="exam-upload-container">
    <t-card title="大作业/试卷上传" bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleUpload">上传文件</t-button>
          <t-button theme="default" @click="handleReset">重置</t-button>
        </t-space>
      </template>
      <t-space direction="vertical" size="large" style="width: 100%">
        <t-form ref="form" :data="formData" :rules="rules" label-width="120px">
          <t-form-item label="文件类型" name="fileType">
            <t-radio-group v-model="formData.fileType">
              <t-radio value="assignment">大作业</t-radio>
              <t-radio value="exam">试卷</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item label="课程名称" name="courseName">
            <t-select v-model="formData.courseName" placeholder="请选择课程" clearable :options="courseOptions" />
          </t-form-item>
          <t-form-item label="学期" name="semester">
            <t-select v-model="formData.semester" placeholder="请选择学期" clearable :options="semesterOptions" />
          </t-form-item>
          <t-form-item label="文件标题" name="title">
            <t-input v-model="formData.title" placeholder="请输入文件标题" />
          </t-form-item>
          <template v-if="formData.fileType === 'exam'">
            <t-form-item label="考试类型" name="examType">
              <t-select v-model="formData.examType" placeholder="请选择考试类型" clearable :options="examTypeOptions" />
            </t-form-item>
          </template>
          <template v-else>
            <t-form-item label="作业类型" name="assignmentType">
              <t-select v-model="formData.assignmentType" placeholder="请选择作业类型" clearable :options="assignmentTypeOptions" />
            </t-form-item>
          </template>
          <t-form-item label="文件描述" name="description">
            <t-textarea
              v-model="formData.description"
              placeholder="请输入文件描述"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
          <t-form-item label="上传文件" name="files">
            <t-upload
              v-model="formData.files"
              theme="file"
              action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              :headers="{ token: 'mock-token' }"
              :max-size="20 * 1024 * 1024"
              :format-response="formatResponse"
              :accept="'.pdf,.doc,.docx,.zip,.rar'"
              @success="handleSuccess"
              @validate="handleValidate"
            >
              <t-button theme="default">
                <template #icon>
                  <t-icon name="upload" />
                </template>
                选择文件
              </t-button>
              <span class="upload-tips">
                支持PDF、Word、压缩包等格式，单个文件不超过20MB
              </span>
            </t-upload>
          </t-form-item>
        </t-form>

        <t-divider />

        <div class="filter-container">
          <t-space>
            <t-select v-model="filter.fileType" placeholder="文件类型" clearable :options="fileTypeOptions" />
            <t-select v-model="filter.courseName" placeholder="课程名称" clearable :options="courseOptions" />
            <t-button theme="primary" @click="handleFilter">筛选</t-button>
            <t-button theme="default" @click="resetFilter">重置</t-button>
          </t-space>
        </div>

        <h3>已上传文件列表</h3>
        <t-table
          :data="fileList"
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
import { ref, reactive, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

const formData = reactive({
  fileType: 'assignment',
  courseName: '',
  semester: '',
  title: '',
  description: '',
  examType: '',
  assignmentType: '',
  files: [],
});

const rules = {
  fileType: [{ required: true, message: '请选择文件类型', type: 'error' }],
  courseName: [{ required: true, message: '请选择课程', type: 'error' }],
  semester: [{ required: true, message: '请选择学期', type: 'error' }],
  title: [{ required: true, message: '请输入文件标题', type: 'error' }],
  examType: [{
    required: true,
    message: '请选择考试类型',
    type: 'error',
    validator: (_val, context) => {
      return context.form.fileType !== 'exam' || !!context.form.examType;
    },
  }],
  assignmentType: [{
    required: true,
    message: '请选择作业类型',
    type: 'error',
    validator: (_val, context) => {
      return context.form.fileType !== 'assignment' || !!context.form.assignmentType;
    },
  }],
  files: [{ required: true, message: '请上传文件', type: 'error' }],
};

// 文件类型选项
const fileTypeOptions = [
  { label: '全部类型', value: '' },
  { label: '大作业', value: 'assignment' },
  { label: '试卷', value: 'exam' },
];

// 考试类型选项
const examTypeOptions = [
  { label: '期中考试', value: '期中考试' },
  { label: '期末考试', value: '期末考试' },
  { label: '补考', value: '补考' },
  { label: '模拟考试', value: '模拟考试' },
];

// 作业类型选项
const assignmentTypeOptions = [
  { label: '课程大作业', value: '课程大作业' },
  { label: '课程设计', value: '课程设计' },
  { label: '专题作业', value: '专题作业' },
  { label: '实验报告', value: '实验报告' },
];

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

// 筛选条件
const filter = reactive({
  fileType: '',
  courseName: '',
});

// 文件列表
const originalFileList = ref([
  {
    id: '1',
    fileType: 'exam',
    fileTypeName: '试卷',
    title: '计算机网络期中考试试卷',
    courseName: '计算机网络',
    semester: '2023-2024-1',
    typeDetail: '期中考试',
    fileName: '计算机网络期中考试.pdf',
    fileSize: '1.2MB',
    uploadTime: '2023-10-15 09:30:45',
  },
  {
    id: '2',
    fileType: 'exam',
    fileTypeName: '试卷',
    title: '数据结构期末考试试卷',
    courseName: '数据结构',
    semester: '2023-2024-1',
    typeDetail: '期末考试',
    fileName: '数据结构期末考试.pdf',
    fileSize: '1.5MB',
    uploadTime: '2024-01-08 14:22:10',
  },
  {
    id: '3',
    fileType: 'assignment',
    fileTypeName: '大作业',
    title: '软件工程课程设计',
    courseName: '软件工程',
    semester: '2023-2024-2',
    typeDetail: '课程设计',
    fileName: '软件工程课程设计要求.docx',
    fileSize: '0.8MB',
    uploadTime: '2023-09-15 09:40:22',
  },
]);

// 根据筛选条件过滤文件列表
const fileList = computed(() => {
  return originalFileList.value.filter((item) => {
    if (filter.fileType && item.fileType !== filter.fileType) {
      return false;
    }
    if (filter.courseName && item.courseName !== filter.courseName) {
      return false;
    }
    return true;
  });
});

const columns = [
  { colKey: 'fileTypeName', title: '文件类型', width: '100' },
  { colKey: 'title', title: '文件标题', width: '180' },
  { colKey: 'courseName', title: '课程名称', width: '120' },
  { colKey: 'semester', title: '学期', width: '150' },
  { colKey: 'typeDetail', title: '详细类型', width: '100' },
  { colKey: 'fileName', title: '文件名', width: '180' },
  { colKey: 'fileSize', title: '文件大小', width: '80' },
  { colKey: 'uploadTime', title: '上传时间', width: '150' },
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
  total: 3,
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
    MessagePlugin.warning('文件大小超过限制');
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
      MessagePlugin.success('文件上传成功');

      // 添加到列表
      const fileTypeName = formData.fileType === 'assignment' ? '大作业' : '试卷';
      const typeDetail = formData.fileType === 'assignment' 
        ? formData.assignmentType 
        : formData.examType;
      
      originalFileList.value.unshift({
        id: String(originalFileList.value.length + 1),
        fileType: formData.fileType,
        fileTypeName,
        title: formData.title,
        courseName: formData.courseName,
        semester: formData.semester,
        typeDetail,
        fileName: formData.files[0]?.name || 'unknown.pdf',
        fileSize: '1.0MB',
        uploadTime: new Date().toLocaleString(),
      });

      // 重置表单
      form.value?.reset();
      formData.fileType = 'assignment';
      formData.examType = '';
      formData.assignmentType = '';
      formData.files = [];
    }
  });
};

// 重置表单
const handleReset = () => {
  form.value?.reset();
  formData.fileType = 'assignment';
  formData.examType = '';
  formData.assignmentType = '';
  formData.files = [];
};

// 筛选
const handleFilter = () => {
  pagination.current = 1;
  // 实际应用中，这里需要调用API获取筛选后的数据
};

// 重置筛选
const resetFilter = () => {
  filter.fileType = '';
  filter.courseName = '';
  pagination.current = 1;
  // 实际应用中，这里需要调用API获取重置后的数据
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
.exam-upload-container {
  margin: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.upload-tips {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.5);
}
</style> 