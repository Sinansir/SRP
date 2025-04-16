<template>
  <div class="audit-apply-page">
    <t-card title="变更申请" bordered>
      <template #actions>
        <t-button theme="primary" @click="createApplication">新建变更申请</t-button>
      </template>
    </t-card>

    <t-card title="我的申请列表" bordered class="mt-4">
      <template #actions>
        <t-button @click="resetSearch">重置</t-button>
        <t-button theme="primary" @click="searchMyAudit">查询</t-button>
      </template>
      <t-form :data="formData" ref="form" label-width="120px">
        <t-row :gutter="[16, 16]">
          <t-col :span="6">
            <t-form-item label="课程名称">
              <t-input v-model="formData.name" placeholder="请输入课程名称" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="课程编码">
              <t-input v-model="formData.code" placeholder="请输入课程编码" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="申请日期">
              <t-date-range-picker v-model="formData.dateRange" :placeholder="['开始日期', '结束日期']" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="申请类型">
              <t-select v-model="formData.type" placeholder="请选择申请类型" clearable>
                <t-option v-for="(value, key) in applicationTypes" :key="key" :value="key" :label="value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="状态">
              <t-select v-model="formData.status" placeholder="请选择状态" clearable>
                <t-option v-for="(value, key) in statusOptions" :key="key" :value="key" :label="value" />
              </t-select>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    </t-card>

    <t-card bordered class="mt-4">
      <t-table
        :data="auditList"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        stripe
        row-key="id"
        @page-change="onPageChange"
      >
        <template #operation="{ row }">
          <t-space>
            <t-button theme="primary" variant="text" @click="viewDetails(row.id)">查看</t-button>
            <t-button 
              v-if="row.status === 'pending'" 
              theme="danger" 
              variant="text" 
              @click="withdrawApplication(row.id)"
            >
              撤回
            </t-button>
          </t-space>
        </template>
        <template #status="{ row }">
          <t-tag :theme="getStatusTheme(row.status)" :style="{ marginRight: '0' }">
            {{ statusOptions[row.status] }}
          </t-tag>
        </template>
        <template #type="{ row }">
          {{ applicationTypes[row.type] }}
        </template>
        <template #priority="{ row }">
          <t-tag :theme="getPriorityTheme(row.priority)" :style="{ marginRight: '0' }">
            {{ priorityOptions[row.priority] }}
          </t-tag>
        </template>
      </t-table>
    </t-card>

    <!-- 申请表单对话框 -->
    <t-dialog
      v-model:visible="applicationDialog.visible"
      header="变更申请"
      :confirm-btn="{ content: '提交', loading: applicationDialog.loading }"
      width="800px"
      :on-confirm="submitApplication"
    >
      <t-form :data="applicationDialog.formData" ref="applicationForm" :rules="applicationRules" label-width="120px">
        <t-form-item label="课程" name="courseId">
          <t-input-adornment append>
            <t-input v-model="selectedCourseName" readonly placeholder="点击选择课程" />
            <template #append>
              <t-button theme="primary" variant="text" @click="openCourseSelector">
                <template #icon><t-icon name="search" /></template>
                选择
              </t-button>
            </template>
          </t-input-adornment>
        </t-form-item>
        <t-form-item v-if="applicationDialog.formData.courseId" label="课程编码">
          <t-input v-model="applicationDialog.formData.code" readonly />
        </t-form-item>
        <t-form-item label="申请类型" name="type">
          <t-select v-model="applicationDialog.formData.type" placeholder="请选择申请类型">
            <t-option v-for="(value, key) in applicationTypes" :key="key" :value="key" :label="value" />
          </t-select>
        </t-form-item>
        <t-form-item label="紧急程度" name="priority">
          <t-select v-model="applicationDialog.formData.priority" placeholder="请选择紧急程度">
            <t-option v-for="(value, key) in priorityOptions" :key="key" :value="key" :label="value" />
          </t-select>
        </t-form-item>
        <t-form-item label="变更说明" name="description">
          <t-textarea
            v-model="applicationDialog.formData.description"
            placeholder="请输入变更说明"
            :maxlength="500"
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
        </t-form-item>

        <!-- 修改类型特有的字段对比 -->
        <template v-if="applicationDialog.formData.type === 'update'">
          <div class="comparison-title">变更内容：</div>
          
          <!-- 课程名称 -->
          <t-form-item label="课程名称" name="afterChange.name">
            <t-input v-model="applicationDialog.formData.afterChange.name" placeholder="请输入课程名称" />
          </t-form-item>
          
          <!-- 英文名称 -->
          <t-form-item label="英文名称" name="afterChange.englishName">
            <t-input v-model="applicationDialog.formData.afterChange.englishName" placeholder="请输入英文名称" />
          </t-form-item>
          
          <!-- 课程类别 -->
          <t-form-item label="课程类别" name="afterChange.category">
            <t-select v-model="applicationDialog.formData.afterChange.category" placeholder="请选择课程类别">
              <t-option v-for="(value, index) in categoryOptions" :key="index" :value="value" :label="value" />
            </t-select>
          </t-form-item>
          
          <!-- 课程性质 -->
          <t-form-item label="课程性质" name="afterChange.nature">
            <t-select v-model="applicationDialog.formData.afterChange.nature" placeholder="请选择课程性质">
              <t-option v-for="(value, index) in natureOptions" :key="index" :value="value" :label="value" />
            </t-select>
          </t-form-item>
          
          <!-- 开课院系 -->
          <t-form-item label="开课院系" name="afterChange.department">
            <t-select v-model="applicationDialog.formData.afterChange.department" placeholder="请选择开课院系">
              <t-option v-for="(value, index) in departmentOptions" :key="index" :value="value" :label="value" />
            </t-select>
          </t-form-item>
          
          <!-- 学分 -->
          <t-form-item label="学分" name="afterChange.credits">
            <t-input-number v-model="applicationDialog.formData.afterChange.credits" />
          </t-form-item>
          
          <!-- 理论学时 -->
          <t-form-item label="理论学时" name="afterChange.theoryHours">
            <t-input-number v-model="applicationDialog.formData.afterChange.theoryHours" />
          </t-form-item>
          
          <!-- 实践学时 -->
          <t-form-item label="实践学时" name="afterChange.practiceHours">
            <t-input-number v-model="applicationDialog.formData.afterChange.practiceHours" />
          </t-form-item>
          
          <!-- 考核方式 -->
          <t-form-item label="考核方式" name="afterChange.examType">
            <t-select v-model="applicationDialog.formData.afterChange.examType" placeholder="请选择考核方式">
              <t-option v-for="(value, index) in examTypeOptions" :key="index" :value="value" :label="value" />
            </t-select>
          </t-form-item>
        </template>
      </t-form>
    </t-dialog>

    <!-- 撤回确认对话框 -->
    <t-dialog
      v-model:visible="withdrawDialog.visible"
      header="撤回申请"
      :confirm-btn="{ content: '确认', loading: withdrawDialog.loading }"
      @confirm="confirmWithdraw"
    >
      <p>确认要撤回此申请吗？撤回后将不再进入审核流程。</p>
    </t-dialog>

    <!-- 申请详情对话框 -->
    <t-dialog
      v-model:visible="detailDialog.visible"
      header="申请详情"
      width="800px"
      :footer="false"
    >
      <t-loading :loading="detailDialog.loading">
        <template v-if="detailDialog.data">
          <t-descriptions bordered size="large">
            <t-descriptions-item label="申请ID">{{ detailDialog.data.id }}</t-descriptions-item>
            <t-descriptions-item label="课程名称">{{ detailDialog.data.courseName }}</t-descriptions-item>
            <t-descriptions-item label="课程编码">{{ detailDialog.data.courseCode }}</t-descriptions-item>
            <t-descriptions-item label="申请类型">{{ applicationTypes[detailDialog.data.type] }}</t-descriptions-item>
            <t-descriptions-item label="优先级">{{ priorityOptions[detailDialog.data.priority] }}</t-descriptions-item>
            <t-descriptions-item label="状态">
              <t-tag :theme="getStatusTheme(detailDialog.data.status)">
                {{ statusOptions[detailDialog.data.status] }}
              </t-tag>
            </t-descriptions-item>
            <t-descriptions-item label="提交时间">{{ detailDialog.data.applyDate }}</t-descriptions-item>
            <t-descriptions-item label="变更说明" :span="2">{{ detailDialog.data.description }}</t-descriptions-item>
          </t-descriptions>

          <!-- 修改详情对话框中的变更内容展示 -->
          <template v-if="detailDialog.data.type === 'update' && detailDialog.data.afterChange">
            <div class="mt-4 mb-2 section-title">变更内容：</div>
            <t-table
              :data="getChangeData()"
              :columns="[
                { colKey: 'field', title: '字段', width: 120 },
                { colKey: 'value', title: '变更后的值', width: 280 }
              ]"
              bordered
              stripe
              size="small"
            />
          </template>
        </template>
      </t-loading>
    </t-dialog>

    <!-- 添加课程选择器弹窗 -->
    <t-dialog
      v-model:visible="courseSelectorDialog.visible"
      header="课程选择"
      width="900px"
      :confirm-btn="{ content: '确认', disabled: !courseSelectorDialog.selectedId }"
      @confirm="confirmCourseSelection"
    >
      <t-form :data="courseSelectorDialog.filter" label-width="100px">
        <t-row :gutter="[16, 16]">
          <t-col :span="8">
            <t-form-item label="搜索关键词">
              <t-input
                v-model="courseSelectorDialog.filter.keyword"
                placeholder="课程名称或代码"
                clearable
                @change="searchCourses"
              />
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="开课院系">
              <t-select
                v-model="courseSelectorDialog.filter.department"
                placeholder="全部"
                clearable
                @change="searchCourses"
              >
                <t-option v-for="(value, index) in departmentOptions" :key="index" :value="value" :label="value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="课程性质">
              <t-select
                v-model="courseSelectorDialog.filter.nature"
                placeholder="全部"
                clearable
                @change="searchCourses"
              >
                <t-option v-for="(value, index) in natureOptions" :key="index" :value="value" :label="value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="课程类别">
              <t-select
                v-model="courseSelectorDialog.filter.category"
                placeholder="全部"
                clearable
                @change="searchCourses"
              >
                <t-option v-for="(value, index) in categoryOptions" :key="index" :value="value" :label="value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-button theme="default" @click="resetCourseFilter">重置</t-button>
            <t-button theme="primary" style="margin-left: 8px;" @click="searchCourses">搜索</t-button>
          </t-col>
        </t-row>
      </t-form>
      
      <div class="course-selector-list mt-4">
        <t-loading :loading="courseSelectorDialog.loading">
          <t-table
            :data="courseSelectorDialog.list"
            :columns="courseSelectorDialog.columns"
            rowKey="id"
            :selected-row-keys="courseSelectorDialog.selectedId ? [courseSelectorDialog.selectedId] : []"
            hover
            stripe
            bordered
            @select-change="handleSelectChange"
            select-on-row-click
            :pagination="{
              pageSize: 5,
              total: courseSelectorDialog.list.length,
              current: 1,
              showJumper: true,
              showPageSize: true,
              pageSizeOptions: [5, 10, 20]
            }"
          />
        </t-loading>
      </div>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { MessagePlugin, PrimaryTableCol } from 'tdesign-vue-next';

// 申请类型
const applicationTypes = {
  update: '修改课程',
  disable: '禁用课程'
};

// 状态选项
const statusOptions = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回'
};

// 优先级选项
const priorityOptions = {
  high: '高',
  medium: '中',
  low: '低'
};

// 课程类别选项
const categoryOptions = [
  '公共基础课', '专业基础课', '专业课', '实践教学', '通识选修课'
];

// 课程性质选项
const natureOptions = [
  '必修', '选修', '限选'
];

// 开课院系选项
const departmentOptions = [
  '计算机学院', '机械学院', '电子信息学院', '外国语学院', '管理学院'
];

// 考核方式选项
const examTypeOptions = [
  '考试', '考查', '论文', '设计', '操作'
];

// 查询表单数据
const formData = reactive({
  name: '',
  code: '',
  dateRange: [],
  type: '',
  status: ''
});

// 表格列配置
const columns: PrimaryTableCol[] = [
  { colKey: 'id', title: 'ID', width: 80 },
  { colKey: 'courseName', title: '课程名称', width: 150 },
  { colKey: 'courseCode', title: '课程代码', width: 100 },
  { colKey: 'type', title: '申请类型', cell: 'type', width: 120 },
  { colKey: 'priority', title: '优先级', cell: 'priority', width: 100 },
  { colKey: 'status', title: '状态', cell: 'status', width: 100 },
  { colKey: 'applyDate', title: '申请日期', width: 120 },
  { colKey: 'creator', title: '申请人', width: 100 },
  { colKey: 'department', title: '所属学院', width: 120 },
  { colKey: 'operation', title: '操作', fixed: 'right', cell: 'operation', width: 120 }
];

// 表格数据
const auditList = ref<any[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  pageSizeOptions: [10, 20, 50],
});

// 课程选项
const courseOptions = ref<any[]>([]);

// 申请表单对话框
const applicationDialog = reactive({
  visible: false,
  loading: false,
  formData: {
    courseId: '',
    code: '',
    type: 'update',
    priority: 'medium',
    reason: '',
    description: '',
    afterChange: {
      name: '',
      englishName: '',
      category: '',
      nature: '',
      department: '',
      credits: 0,
      theoryHours: 0,
      practiceHours: 0,
      examType: ''
    }
  },
  courseDetails: null as any
});

// 申请表单验证规则
const applicationRules = {
  courseId: [{ required: true, message: '请选择课程', type: 'error' }],
  type: [{ required: true, message: '请选择申请类型', type: 'error' }],
  description: [{ required: true, message: '请输入变更说明', type: 'error' }],
  priority: [{ required: true, message: '请选择紧急程度', type: 'error' }],
  'afterChange.credits': [{ required: true, message: '请输入学分', type: 'error' }],
  'afterChange.theoryHours': [{ required: true, message: '请输入理论学时', type: 'error' }],
  'afterChange.practiceHours': [{ required: true, message: '请输入实践学时', type: 'error' }],
  'afterChange.examType': [{ required: true, message: '请选择考核方式', type: 'error' }]
};

// 撤回确认对话框
const withdrawDialog = reactive({
  visible: false,
  loading: false,
  id: ''
});

// 申请详情对话框
const detailDialog = reactive({
  visible: false,
  loading: false,
  data: null as any
});

// 选中课程名称显示
const selectedCourseName = computed(() => {
  if (!applicationDialog.formData.courseId) return '';
  const course = courseOptions.value.find(c => c.id === applicationDialog.formData.courseId);
  return course ? `${course.name} (${course.code})` : '';
});

// 课程选择器对话框
const courseSelectorDialog = reactive({
  visible: false,
  loading: false,
  selectedId: '',
  list: [] as any[],
  filter: {
    keyword: '',
    department: '',
    nature: '',
    category: ''
  },
  columns: [
    { colKey: 'row-select', type: 'single', width: 50, title: '' },
    { colKey: 'code', title: '课程代码', width: 120 },
    { colKey: 'name', title: '课程名称', width: 180 },
    { colKey: 'englishName', title: '英文名称', width: 180 },
    { colKey: 'department', title: '开课院系', width: 150 },
    { colKey: 'nature', title: '课程性质', width: 100 },
    { colKey: 'category', title: '课程类别', width: 120 },
    { colKey: 'credits', title: '学分', width: 80 }
  ] as PrimaryTableCol[]
});

// 生命周期钩子
onMounted(() => {
  fetchAuditList();
  fetchCourseOptions();
});

// 获取申请列表
const fetchAuditList = async () => {
  loading.value = true;
  try {
    const params: any = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.current,
      name: formData.name,
      code: formData.code,
      type: formData.type,
      status: formData.status
    };

    if (formData.dateRange && formData.dateRange.length === 2) {
      params.dateStart = formData.dateRange[0];
      params.dateEnd = formData.dateRange[1];
    }

    const response = await fetch(`/api/course/audit/list?${new URLSearchParams(params).toString()}`)
      .then(res => res.json());

    if (response.code === 0) {
      auditList.value = response.data.list;
      pagination.total = response.data.total;
    } else {
      MessagePlugin.error(response.message || '获取申请列表失败');
    }
  } catch (error) {
    console.error('获取申请列表失败:', error);
    MessagePlugin.error('获取申请列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取课程选项
const fetchCourseOptions = async () => {
  try {
    const response = await fetch('/api/course/options')
      .then(res => res.json());

    if (response.code === 0) {
      courseOptions.value = response.data;
    } else {
      MessagePlugin.error(response.message || '获取课程选项失败');
    }
  } catch (error) {
    console.error('获取课程选项失败:', error);
    MessagePlugin.error('获取课程选项失败');
  }
};

// 查询
const searchMyAudit = () => {
  pagination.current = 1;
  fetchAuditList();
};

// 重置查询
const resetSearch = () => {
  formData.name = '';
  formData.code = '';
  formData.dateRange = [];
  formData.type = '';
  formData.status = '';
  searchMyAudit();
};

// 处理分页变化
const onPageChange = (current: number) => {
  pagination.current = current;
  fetchAuditList();
};

// 新建申请
const createApplication = () => {
  // 重置表单
  applicationDialog.formData = {
    courseId: '',
    code: '',
    type: 'update',
    priority: 'medium',
    reason: '',
    description: '',
    afterChange: {
      name: '',
      englishName: '',
      category: '',
      nature: '',
      department: '',
      credits: 0,
      theoryHours: 0,
      practiceHours: 0,
      examType: ''
    }
  };
  applicationDialog.courseDetails = null;
  applicationDialog.visible = true;
};

// 处理课程变更
const handleCourseChange = async (courseId: string) => {
  if (!courseId) {
    applicationDialog.courseDetails = null;
    applicationDialog.formData.code = '';
    return;
  }

  try {
    const response = await fetch(`/api/course/detail/${courseId}`)
      .then(res => res.json());

    if (response.code === 0) {
      const courseData = response.data;
      applicationDialog.courseDetails = courseData;
      applicationDialog.formData.code = courseData.code;
      
      // 预填充变更后字段
      applicationDialog.formData.afterChange = {
        name: courseData.name,
        englishName: courseData.englishName,
        category: courseData.category,
        nature: courseData.nature,
        department: courseData.department,
        credits: courseData.credits,
        theoryHours: courseData.theoryHours,
        practiceHours: courseData.practiceHours,
        examType: courseData.examType
      };
    } else {
      MessagePlugin.error(response.message || '获取课程详情失败');
    }
  } catch (error) {
    console.error('获取课程详情失败:', error);
    MessagePlugin.error('获取课程详情失败');
  }
};

// 提交申请
const submitApplication = async () => {
  const applicationForm: any = document.querySelector('[ref="applicationForm"]');
  
  // 进行表单验证
  const result = await applicationForm?.validate?.();
  if (result !== true) {
    return;
  }
  
  applicationDialog.loading = true;
  
  try {
    // 将变更说明同时赋值给reason，保持后端兼容性
    applicationDialog.formData.reason = applicationDialog.formData.description;
    
    const response = await fetch('/api/course/audit/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationDialog.formData),
    }).then(res => res.json());

    if (response.code === 0) {
      MessagePlugin.success('申请提交成功');
      applicationDialog.visible = false;
      fetchAuditList();
    } else {
      MessagePlugin.error(response.message || '提交失败');
    }
  } catch (error) {
    console.error('提交失败:', error);
    MessagePlugin.error('提交失败');
  } finally {
    applicationDialog.loading = false;
  }
};

// 查看详情
const viewDetails = async (id: string) => {
  detailDialog.loading = true;
  detailDialog.visible = true;
  
  try {
    const response = await fetch(`/api/course/audit/detail/${id}`)
      .then(res => res.json());

    if (response.code === 0) {
      detailDialog.data = response.data;
    } else {
      MessagePlugin.error(response.message || '获取申请详情失败');
    }
  } catch (error) {
    console.error('获取申请详情失败:', error);
    MessagePlugin.error('获取申请详情失败');
  } finally {
    detailDialog.loading = false;
  }
};

// 撤回申请
const withdrawApplication = (id: string) => {
  withdrawDialog.id = id;
  withdrawDialog.visible = true;
};

// 确认撤回
const confirmWithdraw = async () => {
  withdrawDialog.loading = true;
  try {
    const response = await fetch(`/api/course/audit/withdraw/${withdrawDialog.id}`, {
      method: 'POST',
    }).then(res => res.json());

    if (response.code === 0) {
      MessagePlugin.success('申请撤回成功');
      withdrawDialog.visible = false;
      fetchAuditList(); // 刷新列表
    } else {
      MessagePlugin.error(response.message || '申请撤回失败');
    }
  } catch (error) {
    console.error('申请撤回失败:', error);
    MessagePlugin.error('申请撤回失败');
  } finally {
    withdrawDialog.loading = false;
  }
};

// 获取状态主题
const getStatusTheme = (status: string) => {
  const statusThemeMap: Record<string, any> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  };
  return statusThemeMap[status] || 'default';
};

// 获取优先级主题
const getPriorityTheme = (priority: string) => {
  const priorityThemeMap: Record<string, any> = {
    high: 'danger',
    medium: 'warning',
    low: 'default'
  };
  return priorityThemeMap[priority] || 'default';
};

// 获取变更内容数据
const getChangeData = () => {
  if (!detailDialog.data || !detailDialog.data.afterChange) {
    return [];
  }
  
  const { afterChange } = detailDialog.data;
  const fieldMapping = {
    name: '课程名称',
    englishName: '英文名称',
    category: '课程类别',
    nature: '课程性质',
    department: '开课院系',
    credits: '学分',
    theoryHours: '理论学时',
    practiceHours: '实践学时',
    examType: '考核方式'
  };
  
  return Object.keys(fieldMapping).map((key) => {
    const fieldName = fieldMapping[key as keyof typeof fieldMapping];
    const value = afterChange[key as keyof typeof afterChange];
    
    return {
      field: fieldName,
      value
    };
  });
};

// 打开课程选择器
const openCourseSelector = () => {
  courseSelectorDialog.visible = true;
  courseSelectorDialog.selectedId = applicationDialog.formData.courseId;
  searchCourses();
};

// 搜索课程
const searchCourses = async () => {
  courseSelectorDialog.loading = true;
  try {
    const { keyword, department, nature, category } = courseSelectorDialog.filter;
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (department) params.append('department', department);
    if (nature) params.append('nature', nature);
    if (category) params.append('category', category);
    
    const response = await fetch(`/api/course/options?${params.toString()}`)
      .then((res) => res.json());
    
    if (response.code === 0) {
      courseSelectorDialog.list = Array.isArray(response.data) 
        ? response.data 
        : (response.data.list || []);
    } else {
      MessagePlugin.error(response.message || '获取课程列表失败');
    }
  } catch (error) {
    console.error('获取课程列表失败:', error);
    MessagePlugin.error('获取课程列表失败');
  } finally {
    courseSelectorDialog.loading = false;
  }
};

// 重置课程筛选条件
const resetCourseFilter = () => {
  courseSelectorDialog.filter = {
    keyword: '',
    department: '',
    nature: '',
    category: ''
  };
  searchCourses();
};

// 处理课程选择
const handleSelectChange = (value: any[]) => {
  courseSelectorDialog.selectedId = value.length > 0 ? value[0] : '';
};

// 确认课程选择
const confirmCourseSelection = async () => {
  if (!courseSelectorDialog.selectedId) return;
  
  applicationDialog.formData.courseId = courseSelectorDialog.selectedId;
  await handleCourseChange(courseSelectorDialog.selectedId);
  courseSelectorDialog.visible = false;
};
</script>

<style lang="less" scoped>
.audit-apply-page {
  padding: 16px;
  
  .mt-4 {
    margin-top: 16px;
  }
  
  .mb-2 {
    margin-bottom: 8px;
  }
  
  .comparison-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--td-text-color-primary);
    margin: 16px 0;
    padding-left: 8px;
    border-left: 3px solid var(--td-brand-color);
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--td-text-color-primary);
  }
}
</style> 