<template>
  <div class="course-analysis-container">
    <t-card title="课程关联分析" subtitle="分析课程之间的关联关系" header-bordered>
      <div v-if="currentCourse" class="selected-course-info">
        <t-tag theme="primary" variant="light" size="large">
          <template #icon>
            <t-icon name="book" />
          </template>
          当前选中：{{ currentCourse.name }}（{{ currentCourse.code }}）
        </t-tag>
      </div>

      <t-tabs v-model="activeTab" :style="{ marginTop: '12px' }">
        <t-tab-panel value="graph" label="关系图谱">
          <div class="graph-container" ref="graphContainer">
            <div v-if="loading" class="loading-container">
              <t-loading size="medium" />
            </div>
            <div v-else-if="!currentCourse" class="empty-container">
              <t-empty description="请选择一门课程进行关联分析" />
            </div>
            <div v-else ref="graphChart" class="graph-chart"></div>
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
            stripe
          >
            <template #relationType="{ row }">
              <t-tag v-if="row.relationType" :theme="getRelationTypeTheme(row.relationType)" variant="light">
                {{ getRelationTypeName(row.relationType) }}
              </t-tag>
              <span v-else>-</span>
            </template>
            <template #operation="{ row }">
              <t-space>
                <t-button theme="danger" variant="text" size="small" @click="handleDeleteRelation(row)">删除</t-button>
              </t-space>
            </template>
          </t-table>
          <t-empty v-else description="请选择一门课程进行关联分析" />
        </t-tab-panel>
      </t-tabs>
    </t-card>

    <t-card title="课程选择" :style="{ marginTop: '16px' }" header-bordered>
      <t-form ref="form" :data="formData" :style="{ marginBottom: '20px' }">
        <t-row :gutter="[16, 16]">
          <t-col :span="6">
            <t-form-item label="课程名称">
              <t-input 
                v-model="formData.name" 
                placeholder="请输入课程名称" 
                clearable
                @input="handleRealTimeSearch"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="课程代码">
              <t-input 
                v-model="formData.code" 
                placeholder="请输入课程代码" 
                clearable
                @input="handleRealTimeSearch"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="课程类别">
              <t-select 
                v-model="formData.category" 
                placeholder="请选择课程类别" 
                clearable
                @change="handleRealTimeSearch"
              >
                <t-option 
                  v-for="item in categoryOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value" 
                />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="开课学院">
              <t-select 
                v-model="formData.department" 
                placeholder="请选择开课学院" 
                clearable
                @change="handleRealTimeSearch"
              >
                <t-option 
                  v-for="item in departmentOptions" 
                  :key="item.value" 
                  :label="item.name" 
                  :value="item.value" 
                />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="24">
            <t-form-item>
              <t-space>
                <t-button theme="default" @click="handleReset">重置</t-button>
                <t-button 
                  v-if="currentCourse" 
                  theme="primary" 
                  variant="outline" 
                  @click="handleClearCurrentCourse"
                >
                  清除当前选择
                </t-button>
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
        stripe
      >
        <template #operation="{ row }">
          <t-button theme="primary" variant="text" size="small" @click.stop="onCourseSelect(row)">
            选择
          </t-button>
        </template>
      </t-table>
    </t-card>
    
    <t-dialog
      v-model:visible="relationDialogVisible"
      header="关系详情"
      width="600px"
      :footer="false"
    >
      <t-descriptions
        v-if="selectedRelation"
        :data="relationDetailData"
        :layout="'horizontal'"
        :column="1"
        :colon="true"
        :label-width="100"
      />
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import * as echarts from 'echarts';
import { debounce } from 'lodash';
import { useRoute } from 'vue-router';
import { 
  fetchCourseRelationData, 
  fetchCourseListData, 
  fetchCourseRelationGraph,
  fetchDepartmentOptions,
  deleteCourseRelation
} from '@/api/course-library/relation';

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
  sourceCourseName: string;
  sourceCourseCode: string;
  targetCourseId: string | number;
  targetCourseName: string;
  targetCourseCode: string;
  relationType: string;
  relationStrength: number;
  description: string;
  status?: string;
  createTime?: string;
  updateTime?: string;
}

interface GraphData {
  nodes: any[];
  links: any[];
  categories: any[];
}

// 接口中使用any来处理mock数据的API响应格式
interface ApiResponse {
  data: any;
  code: number;
  message: string;
}

interface ListResponse<T> {
  list: T[];
  total: number;
}

interface Department {
  name: string;
  value: string;
}

// 当前活动标签页
const activeTab = ref('graph');

// 图表实例
let chartInstance: echarts.ECharts | null = null;

// 表单数据
const formData = reactive({
  name: '',
  code: '',
  category: '',
  department: '',
});

// 当前选中课程
const currentCourse = ref<CourseItem | null>(null);

// 关系详情对话框
const relationDialogVisible = ref(false);
const selectedRelation = ref<RelationItem | null>(null);

// 关系详情数据
const relationDetailData = computed(() => {
  if (!selectedRelation.value) return [];
  
  return [
    { label: '源课程', content: `${selectedRelation.value.sourceCourseName} (${selectedRelation.value.sourceCourseCode})` },
    { label: '目标课程', content: `${selectedRelation.value.targetCourseName} (${selectedRelation.value.targetCourseCode})` },
    { label: '关系类型', content: getRelationTypeName(selectedRelation.value.relationType) },
    { label: '关联强度', content: `${selectedRelation.value.relationStrength}%` },
    { label: '关系描述', content: selectedRelation.value.description || '无' },
    { label: '更新时间', content: selectedRelation.value.updateTime || '无' },
  ];
});

// 课程类别选项
const categoryOptions = ref([
  { label: '公共基础课', value: 'GC' },
  { label: '专业基础课', value: 'ZJ' },
  { label: '专业课', value: 'ZY' },
  { label: '实践教学', value: 'SJ' },
  { label: '通识选修课', value: 'TX' },
]);

// 学院选项
const departmentOptions = ref<{name: string; value: string}[]>([]);

// 关系类型选项
const relationTypeOptions = ref([
  { label: '先修课程', value: 'prerequisite' },
  { label: '后续课程', value: 'subsequent' },
  { label: '并行课程', value: 'parallel' },
  { label: '替代课程', value: 'alternative' },
]);

// 获取关系类型名称
const getRelationTypeName = (value: string) => {
  const item = relationTypeOptions.value.find((item) => item.value === value);
  return item ? item.label : value;
};

// 获取关系类型标签主题
const getRelationTypeTheme = (value: string) => {
  const themes = {
    prerequisite: 'primary',
    subsequent: 'success',
    parallel: 'warning',
    alternative: 'danger'
  };
  return themes[value as keyof typeof themes] || 'default';
};

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
  },
];

// 关系表格列定义
const columns = [
  { colKey: 'targetCourseName', title: '关联课程', width: 180 },
  {
    colKey: 'relationType',
    title: '关系类型',
    width: 120,
  },
  { colKey: 'relationStrength', title: '关联强度', width: 100 },
  { colKey: 'description', title: '关系描述', width: 200 },
  {
    colKey: 'operation',
    title: '操作',
    width: 160,
    fixed: 'right',
  },
];

// 图形容器引用
const graphContainer = ref(null);
// 添加图表容器引用
const graphChart = ref(null);

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

// 获取路由信息
const route = useRoute();

// 页面挂载时获取数据
onMounted(() => {
  fetchCourseList();
  fetchDepartments();
  
  // 检查URL中是否有课程ID参数
  const courseId = route.query.courseId;
  if (courseId) {
    handleLoadCourseFromParams();
  }
});

// 监听当前课程变化，更新图表
watch(currentCourse, (newVal) => {
  if (newVal) {
    fetchRelationList();
    fetchGraphData();
  } else {
    relationList.value = [];
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
  }
});

// 监听标签页切换，确保切回图谱时重新渲染
watch(activeTab, (newVal) => {
  if (newVal === 'graph' && currentCourse.value) {
    // 完全重绘图表，而不是尝试复用
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
    // 页签切换时，给DOM更新的时间，然后重新获取图谱数据
    nextTick(() => {
      setTimeout(() => {
        fetchGraphData();
      }, 200); // 增加更长的延迟，确保DOM已完全更新
    });
  }
});

// 获取学院选项
const fetchDepartments = async () => {
  try {
    const response: any = await fetchDepartmentOptions();
    departmentOptions.value = response.data || response;
  } catch (error) {
    console.error('获取学院选项出错:', error);
    MessagePlugin.error('获取学院选项失败');
  }
};

// 获取课程列表数据
const fetchCourseList = async () => {
  searchLoading.value = true;
  try {
    const params = {
      ...formData,
      pageSize: coursePagination.pageSize,
      current: coursePagination.current,
    };
    
    const response: any = await fetchCourseListData(params);
    const data = response.data || response;
    courseList.value = data.list || [];
    coursePagination.total = data.total || 0;
  } catch (error) {
    console.error('获取课程列表出错:', error);
    MessagePlugin.error('获取课程列表失败');
  } finally {
    searchLoading.value = false;
  }
};

// 获取关联列表数据
const fetchRelationList = async () => {
  if (!currentCourse.value) return;
  
  loading.value = true;
  try {
    const params = {
      sourceCourseId: currentCourse.value.id,
      pageSize: pagination.pageSize,
      current: pagination.current,
    };
    
    const response: any = await fetchCourseRelationData(params);
    const data = response.data || response;
    relationList.value = data.list || [];
    pagination.total = data.total || 0;
  } catch (error) {
    console.error('获取关联列表出错:', error);
    MessagePlugin.error('获取关联列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取图谱数据并渲染
const fetchGraphData = async () => {
  if (!currentCourse.value) return;
  
  loading.value = true;
  try {
    const response: any = await fetchCourseRelationGraph(currentCourse.value.id);
    const data = response.data || response;
    
    // 不再嵌套使用nextTick，直接调用渲染函数
    if (data && data.nodes && data.links) {
      renderGraph(data);
    } else {
      console.error('图谱数据格式不正确:', data);
      MessagePlugin.error('图谱数据格式不正确');
    }
  } catch (error) {
    console.error('获取图谱数据出错:', error);
    MessagePlugin.error('获取图谱数据失败');
  } finally {
    loading.value = false;
  }
};

// 渲染关系图谱
const renderGraph = (graphData: GraphData) => {
  // 确保在当前活动标签为图谱且有当前课程时才尝试渲染
  if (activeTab.value !== 'graph' || !currentCourse.value) {
    return;
  }
  
  // 使用nextTick确保DOM已更新
  nextTick(() => {
    setTimeout(() => {
      // 使用ref引用获取DOM元素
      const chartDom = graphChart.value;
      if (!chartDom) {
        console.error('图表容器不存在');
        // 如果图表容器不存在，再次尝试等待DOM渲染，最多重试3次
        if (renderRetryCount.value < 3) {
          renderRetryCount.value++;
          console.log(`尝试重新渲染图表，第${renderRetryCount.value}次尝试`);
          setTimeout(() => renderGraph(graphData), 300);
        } else {
          renderRetryCount.value = 0;
          MessagePlugin.error('加载图表失败，请尝试刷新页面');
        }
        return;
      }
      
      renderRetryCount.value = 0; // 重置重试计数
    
      try {
        // 销毁旧的图表实例
        if (chartInstance) {
          chartInstance.dispose();
        }
        
        // 创建新的图表实例
        chartInstance = echarts.init(chartDom);
        
        const option = {
          title: {
            text: `${currentCourse.value?.name || ''} 课程关联图谱`,
            left: 'center',
            top: 10,
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            top: 50,
            data: Array.isArray(graphData.categories) ? graphData.categories.map(a => a.name) : []
          },
          series: [
            {
              type: 'graph',
              layout: 'force',
              data: graphData.nodes,
              links: graphData.links,
              categories: graphData.categories || [],
              roam: true,
              label: {
                show: true,
                position: 'right',
                formatter: '{b}'
              },
              force: {
                repulsion: 100,
                edgeLength: [50, 200]
              },
              emphasis: {
                focus: 'adjacency',
                lineStyle: {
                  width: 3
                }
              }
            }
          ]
        };
        
        chartInstance.setOption(option);
        
        // 响应窗口大小变化
        window.addEventListener('resize', () => {
          chartInstance?.resize();
        });
      } catch (error) {
        console.error('渲染图谱出错:', error);
        MessagePlugin.error('渲染图谱失败');
      }
    }, 200); // 增加延迟时间，确保DOM完全渲染
  });
};

// 添加重试计数变量
const renderRetryCount = ref(0);

// 分页变化
const onPageChange = (pageInfo: { current: number; pageSize: number }) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchRelationList();
};

// 课程分页变化
const onCoursePageChange = (pageInfo: { current: number; pageSize: number }) => {
  coursePagination.current = pageInfo.current;
  coursePagination.pageSize = pageInfo.pageSize;
  fetchCourseList();
};

// 选择课程
const onCourseSelect = (row) => {
  currentCourse.value = row;
};

// 查看关系详情
const handleViewRelation = (row) => {
  selectedRelation.value = row;
  relationDialogVisible.value = true;
};

// 删除关联关系
const handleDeleteRelation = (row) => {
  MessagePlugin.dialog({
    header: '确认删除',
    body: `确定要删除"${currentCourse.value?.name || ''} - ${row.targetCourseName}"的关联关系吗？`,
    confirmBtn: {
      theme: 'danger',
      content: '删除',
    },
    cancelBtn: '取消',
    onConfirm: async () => {
      try {
        await deleteCourseRelation(row.id);
        MessagePlugin.success('删除成功');
        fetchRelationList();
        fetchGraphData(); // 重新加载图谱数据
      } catch (error) {
        console.error('删除课程关联出错:', error);
        MessagePlugin.error('删除失败');
      }
    },
  });
};

// 实时搜索处理（防抖）
const handleRealTimeSearch = debounce(() => {
  coursePagination.current = 1;
  fetchCourseList();
}, 300);

// 清除当前选择的课程
const handleClearCurrentCourse = () => {
  currentCourse.value = null;
};

// 重置
const handleReset = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = '';
  });
  coursePagination.current = 1;
  fetchCourseList();
};

// 从URL参数加载课程
const handleLoadCourseFromParams = async () => {
  const courseId = route.query.courseId;
  const courseName = route.query.courseName;
  const courseCode = route.query.courseCode;
  
  if (courseId && courseName && courseCode) {
    // 如果URL中包含所有必要信息，直接创建课程对象
    currentCourse.value = {
      id: courseId,
      code: courseCode.toString(),
      name: courseName.toString(),
      category: '',  // 这些字段可能不需要，但为了类型一致性保留
      nature: '',
      credits: 0,
      department: ''
    };
    
    // 立即加载关联数据和图谱数据
    fetchRelationList();
    nextTick(() => {
      setTimeout(() => {
        fetchGraphData();
      }, 200);
    });
  } else if (courseId) {
    // 如果只有ID，从API获取课程详情
    searchLoading.value = true;
    try {
      // 尝试从课程详情API获取数据
      const response = await fetch(`/api/course/detail/${courseId}`).then(res => res.json());
      
      if (response.code === 0 && response.data) {
        currentCourse.value = {
          id: courseId,
          code: response.data.code || '',
          name: response.data.name || '',
          category: response.data.category || '',
          nature: response.data.nature || '',
          credits: response.data.credits || 0,
          department: response.data.department || ''
        };
        
        // 加载关联数据和图谱数据
        fetchRelationList();
        nextTick(() => {
          setTimeout(() => {
            fetchGraphData();
          }, 200);
        });
      } else {
        // 如果详情API失败，尝试从课程列表API获取
        const params = {
          id: courseId,
          pageSize: 10,
          current: 1,
        };
        
        const listResponse: any = await fetchCourseListData(params);
        const data = listResponse.data || listResponse;
        
        if (data.list && data.list.length > 0) {
          currentCourse.value = data.list[0];
          
          // 加载关联数据和图谱数据
          fetchRelationList();
          nextTick(() => {
            setTimeout(() => {
              fetchGraphData();
            }, 200);
          });
        } else {
          MessagePlugin.warning('未找到指定课程');
        }
      }
    } catch (error) {
      console.error('获取课程信息出错:', error);
      MessagePlugin.error('获取课程信息失败');
    } finally {
      searchLoading.value = false;
    }
  }
};
</script>

<style lang="less" scoped>
.course-analysis-container {
  padding: 16px;

  .t-card {
    margin-bottom: 16px;
  }

  .selected-course-info {
    margin-bottom: 16px;
    padding: 8px 0;
    border-bottom: 1px dashed #e7e7e7;
  }

  .graph-container {
    height: 500px;
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    position: relative;
    margin-top: 16px;
  }

  .loading-container,
  .empty-container {
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

  .graph-chart {
    width: 100%;
    height: 100%;
  }
}
</style> 