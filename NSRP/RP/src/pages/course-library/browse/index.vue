<template>
  <div class="course-browse-container">
    <t-card title="课程浏览" subtitle="浏览和查询课程信息" header-bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="toggleAdvancedSearch">
            {{ isAdvancedSearchVisible ? '收起高级搜索' : '高级搜索' }}
          </t-button>
          <t-button theme="default" @click="handleExport">导出</t-button>
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
          <t-form ref="form" :data="formData" :style="{ marginBottom: '16px' }">
            <t-row :gutter="[16, 16]">
              <t-col :span="8">
                <t-form-item label="课程名称">
                  <t-input v-model="formData.name" placeholder="请输入课程名称" @input="handleRealTimeSearch" clearable />
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="课程代码">
                  <t-input v-model="formData.code" placeholder="请输入课程代码" @input="handleRealTimeSearch" clearable />
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="课程类别">
                  <t-select v-model="formData.category" placeholder="请选择课程类别" clearable @change="handleRealTimeSearch">
                    <t-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="课程性质">
                  <t-select v-model="formData.nature" placeholder="请选择课程性质" clearable @change="handleRealTimeSearch">
                    <t-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="开课院系">
                  <t-select v-model="formData.department" placeholder="请选择开课院系" clearable @change="handleRealTimeSearch">
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
                    <t-button theme="default" @click="handleReset">重置</t-button>
                    <t-button theme="primary" @click="toggleAdvancedSearch">收起</t-button>
                  </t-space>
                </t-form-item>
              </t-col>
            </t-row>
          </t-form>
        </div>
      </transition>
      
      <!-- 表格尺寸控制 -->
      <div class="table-operations">
        <t-radio-group v-model="tableSize" variant="outline" size="small">
          <t-radio-button value="small">紧凑</t-radio-button>
          <t-radio-button value="medium">常规</t-radio-button>
          <t-radio-button value="large">宽松</t-radio-button>
        </t-radio-group>
      </div>
    
      <!-- 课程列表 -->
      <t-table
        row-key="id"
        :data="courseList"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        :size="tableSize"
        @page-change="onPageChange"
        @select-change="onSelectChange"
        hover
      >
        <template #operation="{ row }">
          <t-space>
            <t-button theme="primary" variant="text" size="small" @click="viewDetail(row.id)">
              查看
            </t-button>
            <t-button theme="primary" variant="text" size="small" @click="navigateToRelationAnalysis(row)">
              关联分析
            </t-button>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { PaginationProps } from 'tdesign-vue-next';
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
  isCore: boolean;
  isBilingual: boolean;
  description: string;
}

const router = useRouter();

// 控制高级搜索面板显示
const isAdvancedSearchVisible = ref(false);

// 快速搜索
const quickSearchValue = ref('');

// 学分范围
const creditRange = ref([0, 10]);

// 表单数据
const formData = reactive({
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
  { label: '计算机学院', value: '3' },
  { label: '机械学院', value: '4' },
  { label: '电子信息学院', value: '5' },
  { label: '外国语学院', value: '6' },
]);

// 表格列定义
const columns = [
  { colKey: 'code', title: '课程代码', width: 120 },
  { colKey: 'name', title: '课程名称', width: 180 },
  { colKey: 'englishName', title: '英文名称', width: 180 },
  { colKey: 'category', title: '课程类别', width: 120 },
  { colKey: 'nature', title: '课程性质', width: 100 },
  { colKey: 'credits', title: '学分', width: 80 },
  { colKey: 'totalHours', title: '总学时', width: 90 },
  { colKey: 'theoryHours', title: '理论学时', width: 90 },
  { colKey: 'practiceHours', title: '实践学时', width: 90 },
  { colKey: 'examType', title: '考核方式', width: 100 },
  { colKey: 'department', title: '开课院系', width: 120 },
  {
    colKey: 'operation',
    title: '操作',
    width: 150,
    fixed: 'right' as 'right',
  },
];

// 表格数据和加载状态
const courseList = ref<CourseItem[]>([]);
const loading = ref(false);
// 表格尺寸
const tableSize = ref<'small' | 'medium' | 'large'>('medium');
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

// 切换高级搜索
const toggleAdvancedSearch = () => {
  // 直接切换显示状态，不进行滚动
  isAdvancedSearchVisible.value = !isAdvancedSearchVisible.value;
};

// 快速搜索处理函数
const handleQuickSearch = debounce(() => {
  const searchValue = quickSearchValue.value.trim();
  
  // 清空高级搜索选项
  if (searchValue) {
    Object.keys(formData).forEach((key: string) => {
      if (key !== 'name' && key !== 'code') {
        (formData as any)[key] = '';
      }
    });
    
    formData.name = '';
    formData.code = '';
  }
  
  // 重置分页并获取数据
  pagination.current = 1;
  fetchCourseList();
}, 300);

// 实时搜索处理函数
const handleRealTimeSearch = debounce(() => {
  // 清空快速搜索
  quickSearchValue.value = '';
  
  // 重置分页并获取数据
  pagination.current = 1;
  fetchCourseList();
}, 300);

// 获取课程列表数据
const fetchCourseList = async () => {
  loading.value = true;
  
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', pagination.pageSize.toString());
    queryParams.append('pageIndex', pagination.current.toString());
    
    // 添加快速搜索参数
    if (quickSearchValue.value) {
      queryParams.append('keyword', quickSearchValue.value);
    }
    
    // 添加高级搜索参数
    if (!quickSearchValue.value) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value.toString());
        }
      });
      
      // 添加学分范围
      if (creditRange.value[0] > 0) {
        queryParams.append('minCredits', creditRange.value[0].toString());
      }
      if (creditRange.value[1] < 10) {
        queryParams.append('maxCredits', creditRange.value[1].toString());
      }
    }
    
    // 调用课程浏览mock API
    fetch(`/api/course/browse?${queryParams.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 0) {
          courseList.value = data.data.list;
          pagination.total = data.data.total;
        } else {
          MessagePlugin.error('获取课程列表失败');
        }
        loading.value = false;
      });
  } catch (error) {
    console.error('获取课程列表出错:', error);
    MessagePlugin.error('获取课程列表失败');
    loading.value = false;
  }
};

// 分页变化
const onPageChange = (pageInfo: PaginationProps) => {
  pagination.current = pageInfo.current as number;
  pagination.pageSize = pageInfo.pageSize as number;
  fetchCourseList();
};

// 选择变化
const onSelectChange = (selectedRowKeys: (string | number)[]) => {
  console.log('选中行:', selectedRowKeys);
};

// 重置
const handleReset = () => {
  // 重置表单数据
  (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
    formData[key] = '';
  });
  
  // 重置信用范围
  creditRange.value = [0, 10];
  
  // 重置快速搜索
  quickSearchValue.value = '';
  
  // 重置分页
  pagination.current = 1;
  
  // 获取数据
  fetchCourseList();
};

// 导出
const handleExport = () => {
  MessagePlugin.info('正在导出数据...');
  
  const exportParams = {
    ...formData,
    keyword: quickSearchValue.value,
    minCredits: creditRange.value[0],
    maxCredits: creditRange.value[1],
    pageSize: pagination.total,
    pageIndex: 1,
  };
  
  fetch('/api/course/browse/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exportParams),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 0) {
        MessagePlugin.success('导出成功');
        // 在实际情况下，这里应该处理文件下载
      } else {
        MessagePlugin.error(data.message || '导出失败');
      }
    });
};

// 查看课程详情
const viewDetail = (id: string | number) => {
  router.push(`/course-library/maintain/view/${id}`);
};

// 查看课程关联分析
const navigateToRelationAnalysis = (row: CourseItem) => {
  router.push({
    path: '/course-library/relation/analysis',
    query: {
      courseId: row.id,
      courseName: row.name,
      courseCode: row.code
    }
  });
};
</script>

<style lang="less" scoped>
.course-browse-container {
  padding: 16px;
  
  .table-operations {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  
  .advanced-search-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
    border-bottom: 1px dashed #e7e7e7;
    padding-bottom: 8px;
    
    .t-button {
      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
  
  .advanced-search-form {
    background-color: #f9f9f9;
    padding: 16px;
    border-radius: 6px;
    margin-bottom: 16px;
    border: 1px solid #e7e7e7;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }
}

// 添加过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 