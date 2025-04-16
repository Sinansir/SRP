<template>
  <div class="course-analysis-container">
    <t-card title="课程关联分析" subtitle="分析课程之间的关联关系" header-bordered>
      <t-tabs default-value="graph" :style="{ marginTop: '12px' }">
        <t-tab-panel value="graph" label="关系图谱">
          <div class="graph-container" ref="graphContainer">
            <div v-if="loading" class="loading-container">
              <t-loading size="medium" />
            </div>
            <div v-else-if="!currentCourse" class="empty-container">
              <t-empty description="请选择一门课程进行关联分析" />
            </div>
            <div v-else>
              <!-- 这里将放置关系图谱组件 -->
              <div class="graph-placeholder">
                <p>课程关联图谱将在此显示</p>
                <p>当前课程: {{ currentCourse.name }}</p>
              </div>
            </div>
          </div>
        </t-tab-panel>
        <t-tab-panel value="list" label="关联列表">
          <t-table
            v-if="currentCourse"
            row-key="id"
            :data="relationList"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            @page-change="onPageChange"
            hover
          />
          <t-empty v-else description="请选择一门课程进行关联分析" />
        </t-tab-panel>
      </t-tabs>
    </t-card>

    <t-card title="课程选择" :style="{ marginTop: '16px' }" header-bordered>
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
        :columns="courseColumns"
        :loading="searchLoading"
        :pagination="coursePagination"
        @page-change="onCoursePageChange"
        @row-click="onCourseSelect"
        hover
      />
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

interface CourseItem {
  id: string | number;
  code: string;
  name: string;
  category: string;
  nature: string;
  credits: number;
  department: string;
}

interface RelationItem {
  id: string | number;
  sourceCourseId: string | number;
  targetCourseId: string | number;
  targetCourseName: string;
  relationType: string;
  relationStrength: number;
  description: string;
}

// 表单数据
const formData = reactive({
  name: '',
  code: '',
  category: '',
});

// 当前选中课程
const currentCourse = ref<CourseItem | null>(null);

// 课程类别选项
const categoryOptions = ref([
  { label: '公共基础课', value: 'GC' },
  { label: '专业基础课', value: 'ZJ' },
  { label: '专业课', value: 'ZY' },
  { label: '实践教学', value: 'SJ' },
  { label: '通识选修课', value: 'TX' },
]);

// 关系类型选项
const relationTypeOptions = ref([
  { label: '先修课程', value: 'prerequisite' },
  { label: '后续课程', value: 'subsequent' },
  { label: '并行课程', value: 'parallel' },
  { label: '替代课程', value: 'alternative' },
]);

// 课程表格列定义
const courseColumns = [
  { colKey: 'code', title: '课程代码', width: 120 },
  { colKey: 'name', title: '课程名称', width: 180 },
  { colKey: 'category', title: '课程类别', width: 120 },
  { colKey: 'nature', title: '课程性质', width: 100 },
  { colKey: 'credits', title: '学分', width: 80 },
  { colKey: 'department', title: '开课院系', width: 120 },
  {
    colKey: 'operation',
    title: '操作',
    width: 100,
    fixed: 'right',
    cell: (h, { row }) => h(
      't-button',
      {
        theme: 'primary',
        variant: 'text',
        size: 'small',
        onClick: () => onCourseSelect(row)
      },
      '选择'
    ),
  },
];

// 关系表格列定义
const columns = [
  { colKey: 'targetCourseName', title: '关联课程', width: 180 },
  {
    colKey: 'relationType',
    title: '关系类型',
    width: 120,
    cell: (h, { row }) => {
      const item = relationTypeOptions.value.find(item => item.value === row.relationType);
      return item ? item.label : row.relationType;
    },
  },
  { colKey: 'relationStrength', title: '关联强度', width: 100 },
  { colKey: 'description', title: '关系描述', width: 200 },
  {
    colKey: 'operation',
    title: '操作',
    width: 120,
    fixed: 'right',
    cell: (h) => h(
      't-space',
      {},
      [
        h(
          't-button',
          {
            theme: 'primary',
            variant: 'text',
            size: 'small'
          },
          '查看'
        ),
        h(
          't-button',
          {
            theme: 'danger',
            variant: 'text',
            size: 'small'
          },
          '删除'
        )
      ]
    ),
  },
];

// 图形容器引用
const graphContainer = ref(null);

// 表格数据和加载状态
const courseList = ref<CourseItem[]>([]);
const relationList = ref<RelationItem[]>([]);
const loading = ref(false);
const searchLoading = ref(false);

const coursePagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [5, 10, 20],
});

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
  searchLoading.value = true;
  try {
    // 模拟异步请求
    setTimeout(() => {
      // 模拟数据
      const mockData = Array.from({ length: 20 }).map((_, index) => ({
        id: `${index + 1}`,
        code: `C${(10000 + index).toString()}`,
        name: `示例课程${index + 1}`,
        category: ['公共基础课', '专业基础课', '专业课', '实践教学', '通识选修课'][Math.floor(Math.random() * 5)],
        nature: ['必修', '选修', '限选'][Math.floor(Math.random() * 3)],
        credits: Math.floor(Math.random() * 5) + 1,
        department: ['计算机学院', '机械学院', '电子信息学院', '外国语学院'][Math.floor(Math.random() * 4)],
      }));

      courseList.value = mockData.slice(
        (coursePagination.current - 1) * coursePagination.pageSize,
        coursePagination.current * coursePagination.pageSize
      );
      coursePagination.total = mockData.length;
      searchLoading.value = false;
    }, 500);
  } catch (error) {
    console.error('获取课程列表出错:', error);
    MessagePlugin.error('获取课程列表失败');
    searchLoading.value = false;
  }
};

// 获取关联列表数据
const fetchRelationList = async () => {
  if (!currentCourse.value) return;
  
  loading.value = true;
  try {
    // 模拟异步请求
    setTimeout(() => {
      // 模拟数据
      const mockData = Array.from({ length: 15 }).map((_, index) => ({
        id: `${index + 1}`,
        sourceCourseId: currentCourse.value?.id,
        targetCourseId: `${100 + index}`,
        targetCourseName: `相关课程${index + 1}`,
        relationType: ['prerequisite', 'subsequent', 'parallel', 'alternative'][Math.floor(Math.random() * 4)],
        relationStrength: Math.floor(Math.random() * 10) / 10 + 0.1,
        description: `与${currentCourse.value?.name}的关联关系描述...`,
      }));

      relationList.value = mockData.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
      );
      pagination.total = mockData.length;
      loading.value = false;
    }, 500);
  } catch (error) {
    console.error('获取关联列表出错:', error);
    MessagePlugin.error('获取关联列表失败');
    loading.value = false;
  }
};

// 分页变化
const onPageChange = (pageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchRelationList();
};

// 课程分页变化
const onCoursePageChange = (pageInfo) => {
  coursePagination.current = pageInfo.current;
  coursePagination.pageSize = pageInfo.pageSize;
  fetchCourseList();
};

// 选择课程
const onCourseSelect = (row) => {
  currentCourse.value = row;
  fetchRelationList();
};

// 搜索
const handleSearch = () => {
  coursePagination.current = 1;
  fetchCourseList();
  console.log('搜索条件:', formData);
};

// 重置
const handleReset = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = '';
  });
  coursePagination.current = 1;
  fetchCourseList();
};
</script>

<style lang="less" scoped>
.course-analysis-container {
  padding: 16px;

  .t-card {
    margin-bottom: 16px;
  }

  .graph-container {
    height: 400px;
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    position: relative;
    margin-top: 16px;
  }

  .loading-container,
  .empty-container,
  .graph-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: rgba(0, 0, 0, 0.4);
  }

  .graph-placeholder {
    color: rgba(0, 0, 0, 0.6);
    font-size: 16px;
  }
}
</style> 