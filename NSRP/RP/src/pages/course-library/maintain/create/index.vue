<template>
  <div class="course-create-container">
    <t-card title="创建课程" header-bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleSubmit">保存</t-button>
          <t-button theme="default" @click="handleCancel">取消</t-button>
          <t-button theme="default" @click="handleSync">
            <template #icon><t-icon name="refresh" /></template>
            教务系统同步
          </t-button>
          <t-button theme="default" @click="handleImport">
            <template #icon><t-icon name="upload" /></template>
            导入
          </t-button>
          <t-button theme="default" @click="handleExport">
            <template #icon><t-icon name="download" /></template>
            导出
          </t-button>
          <t-button theme="default" @click="handleExportList">
            <template #icon><t-icon name="download" /></template>
            导出列表
          </t-button>
          <t-button variant="text" shape="square" @click="toggleFormCollapse">
            <template #icon><t-icon :name="isFormCollapsed ? 'chevron-down' : 'chevron-up'" /></template>
          </t-button>
        </t-space>
      </template>
      
      <t-collapse :value="collapseValue" :default-expand-all="true" :expand-icon="false" :bordered="false">
        <t-collapse-panel value="create-form">
          <template #content>
            <t-form ref="form" :data="formData" :rules="rules" :label-width="100" class="form-container">
              <t-row :gutter="[24, 20]">
                <t-col :span="12">
                  <t-form-item label="课程代码" name="code">
                    <t-input v-model="formData.code" placeholder="请输入课程代码">
                      <template #suffix>
                        <t-button theme="primary" variant="text" @click="handleGenerateCode">
                          <template #icon><t-icon name="refresh" /></template>
                          自动生成
                        </t-button>
                      </template>
                    </t-input>
                  </t-form-item>
                </t-col>
                <t-col :span="12">
                  <t-form-item label="课程名称" name="name">
                    <t-input v-model="formData.name" placeholder="请输入课程名称" />
                  </t-form-item>
                </t-col>
                <t-col :span="12">
                  <t-form-item label="英文名称" name="englishName">
                    <t-input v-model="formData.englishName" placeholder="请输入英文名称" />
                  </t-form-item>
                </t-col>
                <t-col :span="12">
                  <t-form-item label="课程类别" name="category">
                    <t-select v-model="formData.category" placeholder="请选择课程类别" clearable>
                      <t-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </t-select>
                  </t-form-item>
                </t-col>
                <t-col :span="12">
                  <t-form-item label="课程性质" name="nature">
                    <t-select v-model="formData.nature" placeholder="请选择课程性质" clearable>
                      <t-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </t-select>
                  </t-form-item>
                </t-col>
                <t-col :span="12">
                  <t-form-item label="开课院系" name="department">
                    <t-select v-model="formData.department" placeholder="请选择开课院系" clearable>
                      <t-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </t-select>
                  </t-form-item>
                </t-col>
                <t-col :span="8">
                  <t-form-item label="学分" name="credits">
                    <t-input-number v-model="formData.credits" :min="0" :max="30" :step="0.5" />
                  </t-form-item>
                </t-col>
                <t-col :span="8">
                  <t-form-item label="理论学时" name="theoryHours">
                    <t-input-number v-model="formData.theoryHours" :min="0" :max="200" />
                  </t-form-item>
                </t-col>
                <t-col :span="8">
                  <t-form-item label="实践学时" name="practiceHours">
                    <t-input-number v-model="formData.practiceHours" :min="0" :max="200" />
                  </t-form-item>
                </t-col>
                <t-col :span="12">
                  <t-form-item label="考核方式" name="examType">
                    <t-select v-model="formData.examType" placeholder="请选择考核方式">
                      <t-option v-for="item in examOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </t-select>
                  </t-form-item>
                </t-col>
                <t-col :span="12">
                  <t-form-item label="课程状态" name="status">
                    <t-radio-group v-model="formData.status">
                      <t-radio :value="1">正常</t-radio>
                      <t-radio :value="0">禁用</t-radio>
                    </t-radio-group>
                  </t-form-item>
                </t-col>
              </t-row>
            </t-form>
          </template>
        </t-collapse-panel>
      </t-collapse>
    </t-card>

    <!-- 导入课程对话框 -->
    <t-dialog
      v-model:visible="importDialogVisible"
      header="导入课程"
      :body-scroll="false"
      width="600px"
      :confirm-btn="{ content: '开始导入', theme: 'primary' }"
      :cancel-btn="{ content: '取消', theme: 'default' }"
      @confirm="handleImportConfirm"
      @cancel="importDialogVisible = false"
    >
      <template #body>
        <div class="import-dialog-body">
          <t-upload
            ref="uploadRef"
            v-model="uploadFiles"
            theme="file"
            action="#"
            :auto-upload="false"
            :placeholder="'请上传Excel文件'"
            :format-response="formatResponse"
            accept=".xlsx,.xls"
            :max-size="10 * 1024 * 1024"
            :files-exclude="onFileExclude"
          />
          <div class="import-note">
            <p>提示：</p>
            <ol>
              <li>请下载<t-link theme="primary" hover="color" underline @click="downloadTemplate">导入模板</t-link>填写数据</li>
              <li>支持.xlsx或.xls格式文件</li>
              <li>文件大小不超过10MB</li>
              <li>一次最多可导入500条数据</li>
            </ol>
          </div>
        </div>
      </template>
    </t-dialog>

    <!-- 添加课程列表展示 -->
    <t-card title="课程浏览" subtitle="当前课程库中的课程列表" header-bordered class="course-list-card">
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="toggleAdvancedSearch">
            {{ isAdvancedSearchVisible ? '收起高级搜索' : '高级搜索' }}
          </t-button>
          <t-radio-group v-model="tableSize" variant="outline-filled" size="small">
            <t-radio-button value="small">紧凑</t-radio-button>
            <t-radio-button value="medium">常规</t-radio-button>
            <t-radio-button value="large">宽松</t-radio-button>
          </t-radio-group>
        </t-space>
      </template>
      
      <!-- 基础搜索表单 -->
      <t-input
        v-model="quickSearchValue"
        placeholder="请输入课程名称或课程代码进行搜索"
        clearable
        :style="{ marginBottom: '16px', width: '100%' }"
        @change="handleQuickSearch"
      >
        <template #prefix-icon>
          <t-icon name="search" />
        </template>
      </t-input>
      
      <!-- 独立的展开/折叠按钮，仅在高级搜索打开时显示 -->
      <div v-if="isAdvancedSearchVisible" class="advanced-search-toggle">
        <t-button theme="default" size="small" variant="text" @click="toggleAdvancedSearch">
          <template #icon><t-icon name="chevron-up" /></template>
          折叠高级搜索
        </t-button>
      </div>
      
      <!-- 高级搜索表单，添加动画效果 -->
      <transition name="fade">
        <div v-show="isAdvancedSearchVisible" class="advanced-search-form">
          <t-form ref="searchForm" :data="searchFormData" :style="{ marginBottom: '16px' }">
            <t-row :gutter="[16, 16]">
              <t-col :span="8">
                <t-form-item label="课程名称">
                  <t-input v-model="searchFormData.name" placeholder="请输入课程名称" @input="handleRealTimeSearch" clearable />
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="课程代码">
                  <t-input v-model="searchFormData.code" placeholder="请输入课程代码" @input="handleRealTimeSearch" clearable />
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="课程类别">
                  <t-select v-model="searchFormData.category" placeholder="请选择课程类别" clearable @change="handleRealTimeSearch">
                    <t-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="课程性质">
                  <t-select v-model="searchFormData.nature" placeholder="请选择课程性质" clearable @change="handleRealTimeSearch">
                    <t-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="开课院系">
                  <t-select v-model="searchFormData.department" placeholder="请选择开课院系" clearable @change="handleRealTimeSearch">
                    <t-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="学分范围">
                  <t-space>
                    <t-input-number v-model="creditRange[0]" theme="normal" placeholder="最小学分" @change="handleRealTimeSearch" />
                    <span>至</span>
                    <t-input-number v-model="creditRange[1]" theme="normal" placeholder="最大学分" @change="handleRealTimeSearch" />
                  </t-space>
                </t-form-item>
              </t-col>
              <t-col :span="24">
                <t-form-item>
                  <t-space>
                    <t-button theme="default" @click="handleSearchReset">重置</t-button>
                    <t-button theme="primary" @click="toggleAdvancedSearch">收起</t-button>
                  </t-space>
                </t-form-item>
              </t-col>
            </t-row>
          </t-form>
        </div>
      </transition>
      
      <t-table
        row-key="id"
        :data="courseList"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        :size="tableSize"
        @page-change="onPageChange"
        hover
        stripe
      >
        <template #status="{ row }">
          <t-tag :theme="row.status === 1 ? 'success' : 'warning'" variant="light">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </t-tag>
        </template>
        <template #operation="{ row }">
          <t-space>
            <t-button theme="primary" variant="text" size="small" @click="handleView(row)">查看</t-button>
            <t-button theme="primary" variant="text" size="small" @click="handleEdit(row)">编辑</t-button>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { MessagePlugin, FormRule, UploadFile } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';

interface CourseItem {
  id: string | number;
  code: string;
  name: string;
  englishName: string;
  category: string;
  nature: string;
  credits: number;
  theoryHours: number;
  practiceHours: number;
  totalHours: number;
  examType: string;
  department: string;
  status: number;
  createTime: string;
}

const router = useRouter();
const form = ref(null);
const searchForm = ref(null);

// 表单折叠状态
const isFormCollapsed = ref(false);
const collapseValue = computed(() => isFormCollapsed.value ? [] : ['create-form']);

// 切换表单折叠状态
const toggleFormCollapse = () => {
  isFormCollapsed.value = !isFormCollapsed.value;
};

// 表单数据
const formData = reactive({
  code: '',
  name: '',
  englishName: '',
  category: '',
  nature: '',
  credits: 3,
  theoryHours: 32,
  practiceHours: 16,
  examType: 'exam',
  department: '',
  status: 1,
});

// 表单验证规则
const rules = {
  code: [{ required: true, message: '请输入课程代码', type: 'error' as const }],
  name: [{ required: true, message: '请输入课程名称', type: 'error' as const }],
  category: [{ required: true, message: '请选择课程类别', type: 'error' as const }],
  nature: [{ required: true, message: '请选择课程性质', type: 'error' as const }],
  credits: [{ required: true, message: '请输入学分', type: 'error' as const }],
  department: [{ required: true, message: '请选择开课院系', type: 'error' as const }],
};

// 高级搜索相关
// 控制高级搜索面板显示
const isAdvancedSearchVisible = ref(false);

// 快速搜索
const quickSearchValue = ref('');

// 学分范围
const creditRange = ref([0, 10]);

// 搜索表单数据
const searchFormData = reactive({
  name: '',
  code: '',
  category: '',
  nature: '',
  department: '',
});

// 课程类别选项
const categoryOptions = ref([
  { label: '公共基础课', value: 'GC' },
  { label: '专业基础课', value: 'ZJ' },
  { label: '专业课', value: 'ZY' },
  { label: '实践教学', value: 'SJ' },
  { label: '通识选修课', value: 'TX' },
]);

// 课程性质选项
const natureOptions = ref([
  { label: '必修', value: 'required' },
  { label: '选修', value: 'elective' },
  { label: '限选', value: 'limited' },
]);

// 开课院系选项
const departmentOptions = ref([
  { label: '计算机学院', value: '计算机学院' },
  { label: '机械学院', value: '机械学院' },
  { label: '电子信息学院', value: '电子信息学院' },
  { label: '外国语学院', value: '外国语学院' },
]);

// 考核方式选项
const examOptions = ref([
  { label: '考试', value: 'exam' },
  { label: '考查', value: 'check' },
  { label: '论文', value: 'paper' },
  { label: '设计', value: 'design' },
  { label: '操作', value: 'operation' },
]);

// 导入相关
const importDialogVisible = ref(false);
const uploadFiles = ref<UploadFile[]>([]);
const uploadRef = ref(null);

// 表格相关
const loading = ref(false);
const tableSize = ref<'small' | 'medium' | 'large'>('medium');
const courseList = ref<CourseItem[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50],
});

// 表格列定义
const columns = [
  { colKey: 'code', title: '课程代码', width: 120 },
  { colKey: 'name', title: '课程名称', width: 180 },
  { colKey: 'category', title: '课程类别', width: 120 },
  { colKey: 'nature', title: '课程性质', width: 100 },
  { colKey: 'credits', title: '学分', width: 80 },
  { colKey: 'theoryHours', title: '理论学时', width: 100 },
  { colKey: 'practiceHours', title: '实践学时', width: 100 },
  { colKey: 'examType', title: '考核方式', width: 100 },
  { colKey: 'department', title: '开课院系', width: 150 },
  { colKey: 'status', title: '状态', width: 100 },
  {
    colKey: 'operation',
    title: '操作',
    width: 150,
    fixed: 'right' as 'right',
  },
];

// 页面挂载时获取数据
onMounted(() => {
  fetchCourseList();
});

// 切换高级搜索
const toggleAdvancedSearch = () => {
  isAdvancedSearchVisible.value = !isAdvancedSearchVisible.value;
};

// 获取课程列表
const fetchCourseList = async () => {
  loading.value = true;
  try {
    // 构造查询参数
    const params: Record<string, any> = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.current,
    };
    
    // 如果有快速搜索词，使用快速搜索
    if (quickSearchValue.value) {
      params.keyword = quickSearchValue.value;
    } else {
      // 否则使用高级搜索参数
      if (searchFormData.name) params.name = searchFormData.name;
      if (searchFormData.code) params.code = searchFormData.code;
      if (searchFormData.category) params.category = searchFormData.category;
      if (searchFormData.nature) params.nature = searchFormData.nature;
      if (searchFormData.department) params.department = searchFormData.department;
      
      // 学分范围
      if (creditRange.value[0] > 0) params.minCredits = creditRange.value[0];
      if (creditRange.value[1] < 10) params.maxCredits = creditRange.value[1];
    }
    
    const response = await fetch(`/api/course/browse?${new URLSearchParams(params).toString()}`);
    const result = await response.json();
    
    if (result.code === 0) {
      courseList.value = result.data.list;
      pagination.total = result.data.total;
    } else {
      MessagePlugin.error(result.message || '获取课程列表失败');
    }
  } catch (error) {
    console.error('获取课程列表失败:', error);
    MessagePlugin.error('获取课程列表失败');
  } finally {
    loading.value = false;
  }
};

// 分页变化
const onPageChange = (pageInfo: any) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchCourseList();
};

// 处理快速搜索
const handleQuickSearch = debounce(() => {
  // 清空高级搜索选项
  if (quickSearchValue.value) {
    Object.keys(searchFormData).forEach((key: string) => {
      (searchFormData as any)[key] = '';
    });
    creditRange.value = [0, 10];
  }
  
  pagination.current = 1;
  fetchCourseList();
}, 300);

// 处理实时搜索
const handleRealTimeSearch = debounce(() => {
  // 清空快速搜索
  quickSearchValue.value = '';
  
  pagination.current = 1;
  fetchCourseList();
}, 300);

// 处理高级搜索重置
const handleSearchReset = () => {
  // 重置高级搜索表单
  Object.keys(searchFormData).forEach((key: string) => {
    (searchFormData as any)[key] = '';
  });
  creditRange.value = [0, 10];
  
  // 清空快速搜索
  quickSearchValue.value = '';
  
  // 重置分页并重新获取数据
  pagination.current = 1;
  fetchCourseList();
};

// 格式化上传响应
const formatResponse = (res: any) => {
  return res;
};

// 文件过滤
const onFileExclude = (files: UploadFile[]) => {
  return files;
};

// 处理提交
const handleSubmit = async () => {
  if (!form.value) return;
  
  try {
    await form.value.validate();
    MessagePlugin.success('保存成功');
    // 这里添加实际保存逻辑
  } catch (e) {
    console.error('表单验证失败:', e);
  }
};

// 处理取消
const handleCancel = () => {
  router.back();
};

// 处理导入
const handleImport = () => {
  importDialogVisible.value = true;
};

// 处理导入确认
const handleImportConfirm = () => {
  MessagePlugin.success('导入成功');
  importDialogVisible.value = false;
};

// 处理导出
const handleExport = () => {
  MessagePlugin.success('导出成功');
};

// 处理列表导出
const handleExportList = () => {
  MessagePlugin.success('列表导出成功');
};

// 处理同步
const handleSync = () => {
  MessagePlugin.success('同步成功');
};

// 处理查看
const handleView = (row: CourseItem) => {
  router.push(`/course-library/maintain/view/${row.id}`);
};

// 处理编辑
const handleEdit = (row: CourseItem) => {
  router.push(`/course-library/maintain/edit/${row.id}`);
};

// 处理生成代码
const handleGenerateCode = async () => {
  // 验证必填项
  let missingField = '';
  
  if (!formData.category) {
    missingField = '课程类别';
  } else if (!formData.department) {
    missingField = '开课院系';
  } else if (!formData.nature) {
    missingField = '课程性质';
  } else if (!formData.credits) {
    missingField = '学分';
  }
  
  if (missingField) {
    MessagePlugin.warning(`请先填写${missingField}`);
    return;
  }
  
  try {
    const response = await fetch('/api/course/code/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: formData.category,
        department: formData.department,
        nature: formData.nature,
        credits: formData.credits,
        examType: formData.examType,
      }),
    });
    const result = await response.json();
    
    if (result.code === 0) {
      formData.code = result.data.code;
      MessagePlugin.success('代码生成成功');
    } else {
      MessagePlugin.error(result.message || '代码生成失败');
    }
  } catch (error) {
    console.error('代码生成失败:', error);
    MessagePlugin.error('代码生成失败');
  }
};

// 下载模板
const downloadTemplate = () => {
  window.open('/api/course/import/template', '_blank');
  MessagePlugin.success('模板下载成功');
};
</script>

<style lang="less" scoped>
.course-create-container {
  padding: 20px 0;
  
  .form-container {
    padding: 10px 0;
  }
  
  .course-list-card {
    margin-top: 20px;
  }
  
  .import-dialog-body {
    .import-note {
      margin-top: 16px;
      padding: 12px;
      background-color: var(--td-bg-color-container-hover);
      border-radius: var(--td-radius-medium);
      
      p {
        font-weight: bold;
        margin-bottom: 8px;
      }
      
      ol {
        padding-left: 20px;
        margin: 0;
        
        li {
          margin-bottom: 4px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  
  // 高级搜索样式
  .advanced-search-form {
    background-color: var(--td-bg-color-container-hover);
    padding: 16px;
    margin-bottom: 16px;
    border-radius: var(--td-radius-medium);
    border: 1px solid var(--td-component-stroke);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .advanced-search-toggle {
    text-align: center;
    margin-bottom: 16px;
    position: relative;
    
    &::before {
      content: '';
      height: 1px;
      background-color: var(--td-component-stroke);
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      z-index: 0;
    }
    
    .t-button {
      position: relative;
      z-index: 1;
      padding: 0 16px;
      background-color: #fff;
    }
  }
  
  // 添加动画效果
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s, max-height 0.3s;
    max-height: 1000px;
    overflow: hidden;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    max-height: 0;
  }
}
</style> 