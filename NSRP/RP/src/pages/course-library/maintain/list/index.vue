<template>
  <div class="course-list-container">
    <t-card title="课程列表" subtitle="管理所有课程" header-bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleAdd">新增课程</t-button>
          <t-button theme="default">导入</t-button>
          <t-button theme="default">导出</t-button>
        </t-space>
      </template>
      
      <t-form ref="form" :data="formData" :style="{ marginBottom: '20px' }">
        <t-row :gutter="[16, 16]">
          <t-col :span="6">
            <t-form-item label="课程名称">
              <t-input v-model="formData.name" placeholder="请输入课程名称" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="课程代码">
              <t-input v-model="formData.code" placeholder="请输入课程代码" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="课程类别">
              <t-select v-model="formData.category" placeholder="请选择课程类别" clearable>
                <t-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="课程性质">
              <t-select v-model="formData.nature" placeholder="请选择课程性质" clearable>
                <t-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="开课院系">
              <t-select v-model="formData.department" placeholder="请选择开课院系" clearable>
                <t-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="状态">
              <t-select v-model="formData.status" placeholder="请选择状态" clearable>
                <t-option :key="1" label="正常" :value="1" />
                <t-option :key="0" label="禁用" :value="0" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item>
              <t-space>
                <t-button theme="primary" @click="handleSearch">查询</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
              </t-space>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    
      <t-table
        row-key="id"
        :data="courseList"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
        hover
      />
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';

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
  isCore: boolean;
  isBilingual: boolean;
  status: number;
  description: string;
}

const router = useRouter();

// 表单数据
const formData = reactive({
  name: '',
  code: '',
  category: '',
  nature: '',
  department: '',
  status: null,
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
  { label: '计算机学院', value: '3' },
  { label: '机械学院', value: '4' },
  { label: '电子信息学院', value: '5' },
  { label: '外国语学院', value: '6' },
]);

// 表格列定义
const columns = [
  { colKey: 'code', title: '课程代码', width: 120 },
  { colKey: 'name', title: '课程名称', width: 180 },
  { colKey: 'category', title: '课程类别', width: 120 },
  { colKey: 'nature', title: '课程性质', width: 100 },
  { colKey: 'credits', title: '学分', width: 80 },
  { colKey: 'totalHours', title: '总学时', width: 90 },
  { colKey: 'department', title: '开课院系', width: 120 },
  { 
    colKey: 'status', 
    title: '状态', 
    width: 80,
    cell: ({ row }) => (
      <t-tag theme={row.status === 1 ? 'success' : 'danger'}>
        {row.status === 1 ? '正常' : '禁用'}
      </t-tag>
    ),
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 220,
    fixed: 'right',
    cell: ({ row }) => (
      <t-space>
        <t-button theme="primary" variant="text" size="small" onClick={() => handleView(row)}>
          查看
        </t-button>
        <t-button theme="primary" variant="text" size="small" onClick={() => handleEdit(row)}>
          编辑
        </t-button>
        <t-button 
          theme={row.status === 1 ? 'warning' : 'success'} 
          variant="text" 
          size="small" 
          onClick={() => handleToggleStatus(row)}
        >
          {row.status === 1 ? '禁用' : '启用'}
        </t-button>
        <t-button theme="danger" variant="text" size="small" onClick={() => handleDelete(row.id)}>
          删除
        </t-button>
      </t-space>
    ),
  },
];

// 表格数据和加载状态
const courseList = ref<CourseItem[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50],
});

// 页面挂载时获取数据
onMounted(() => {
  fetchCourseList();
});

// 获取课程列表数据
const fetchCourseList = async () => {
  loading.value = true;
  try {
    // 构建查询参数
    const params = new URLSearchParams({
      pageSize: pagination.pageSize.toString(),
      pageIndex: pagination.current.toString(),
    });

    // 添加筛选条件
    if (formData.name) params.append('name', formData.name);
    if (formData.code) params.append('code', formData.code);
    if (formData.category) params.append('category', formData.category);
    if (formData.nature) params.append('nature', formData.nature);
    if (formData.department) params.append('department', formData.department);
    if (formData.status !== null) params.append('status', formData.status.toString());

    // 使用fetch API调用课程列表接口
    const response = await fetch(`/api/course/list?${params.toString()}`);
    const result = await response.json();

    if (result.code === 0) {
      courseList.value = result.data.list;
      pagination.total = result.data.total;
    } else {
      MessagePlugin.error(result.message || '获取数据失败');
    }
  } catch (error) {
    console.error('获取课程列表数据失败:', error);
    MessagePlugin.error('获取课程列表数据失败');
  } finally {
    loading.value = false;
  }
};

// 查询操作
const handleSearch = () => {
  pagination.current = 1;
  fetchCourseList();
};

// 重置查询表单
const handleReset = () => {
  // 重置表单数据
  Object.assign(formData, {
    name: '',
    code: '',
    category: '',
    nature: '',
    department: '',
    status: null,
  });
  
  pagination.current = 1;
  fetchCourseList();
};

// 分页变化处理
const onPageChange = (currentPage: number) => {
  pagination.current = currentPage;
  fetchCourseList();
};

// 添加课程
const handleAdd = () => {
  router.push('/course-library/maintain/create');
};

// 查看课程
const handleView = (row: CourseItem) => {
  router.push(`/course-library/maintain/view/${row.id}`);
};

// 编辑课程
const handleEdit = (row: CourseItem) => {
  router.push(`/course-library/maintain/edit/${row.id}`);
};

// 切换课程状态
const handleToggleStatus = (row: CourseItem) => {
  const newStatus = row.status === 1 ? 0 : 1;
  const statusText = newStatus === 1 ? '启用' : '禁用';
  
  MessagePlugin.success(`已${statusText}课程: ${row.name}`);
  row.status = newStatus;
};

// 删除课程
const handleDelete = (id: string | number) => {
  MessagePlugin.success(`已删除课程 ID: ${id}`);
  courseList.value = courseList.value.filter(item => item.id !== id);
};
</script>

<style lang="less" scoped>
.course-list-container {
  padding: 16px;

  .t-card {
    margin-bottom: 16px;
  }
}
</style> 