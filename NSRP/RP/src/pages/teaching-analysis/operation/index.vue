<template>
  <div class="container">
    <a-card class="general-card" title="教学运行监测">
      <a-space direction="vertical" size="large" fill>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form :model="searchForm" layout="inline">
              <a-form-item field="semester" label="学期">
                <a-select v-model="searchForm.semester" placeholder="请选择学期" style="width: 160px">
                  <a-option value="2023-2024-1">2023-2024学年第一学期</a-option>
                  <a-option value="2023-2024-2">2023-2024学年第二学期</a-option>
                  <a-option value="2022-2023-1">2022-2023学年第一学期</a-option>
                  <a-option value="2022-2023-2">2022-2023学年第二学期</a-option>
                </a-select>
              </a-form-item>
              <a-form-item field="college" label="学院">
                <a-select v-model="searchForm.college" placeholder="请选择学院" style="width: 160px">
                  <a-option value="">全部</a-option>
                  <a-option value="1">计算机科学与技术学院</a-option>
                  <a-option value="2">电子工程学院</a-option>
                  <a-option value="3">数学学院</a-option>
                </a-select>
              </a-form-item>
              <a-form-item field="course" label="课程">
                <a-input v-model="searchForm.course" placeholder="课程名称" />
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="handleSearch">查询</a-button>
                  <a-button @click="handleReset">重置</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="6">
            <a-card class="metric-card">
              <div class="metric-title">已开课程</div>
              <div class="metric-value">168</div>
              <div class="metric-compare">
                <span class="up">↑ 8.3%</span>
                <span class="compare-text">较上学期</span>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="metric-card">
              <div class="metric-title">教学班数</div>
              <div class="metric-value">268</div>
              <div class="metric-compare">
                <span class="up">↑ 5.2%</span>
                <span class="compare-text">较上学期</span>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="metric-card">
              <div class="metric-title">总课时</div>
              <div class="metric-value">3842</div>
              <div class="metric-compare">
                <span class="up">↑ 3.7%</span>
                <span class="compare-text">较上学期</span>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="metric-card">
              <div class="metric-title">授课教师</div>
              <div class="metric-value">126</div>
              <div class="metric-compare">
                <span class="down">↓ 2.3%</span>
                <span class="compare-text">较上学期</span>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <a-table
          :loading="loading"
          :data="tableData"
          :pagination="pagination"
          @page-change="onPageChange"
        >
          <template #columns>
            <a-table-column title="课程编号" data-index="courseCode" />
            <a-table-column title="课程名称" data-index="courseName" />
            <a-table-column title="开课学院" data-index="college" />
            <a-table-column title="教学班数" data-index="classCount" />
            <a-table-column title="课时" data-index="hours" />
            <a-table-column title="主讲教师" data-index="teacher" />
            <a-table-column title="学生数" data-index="studentCount" />
            <a-table-column title="操作" width="150">
              <template #cell="{ record }">
                <a-space>
                  <a-button type="text" size="small" @click="handleDetail(record)">详情</a-button>
                  <a-button type="text" size="small" @click="handleMonitor(record)">监测</a-button>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';

// 搜索表单
const searchForm = reactive({
  semester: '2023-2024-1',
  college: '',
  course: '',
});

// 表格加载状态
const loading = ref(false);

// 分页配置
const pagination = reactive({
  total: 100,
  current: 1,
  pageSize: 10,
});

// 表格数据
const tableData = ref([
  {
    id: '1',
    courseCode: 'CS101',
    courseName: '计算机导论',
    college: '计算机科学与技术学院',
    classCount: 5,
    hours: 48,
    teacher: '张教授',
    studentCount: 150,
  },
  {
    id: '2',
    courseCode: 'CS201',
    courseName: '数据结构',
    college: '计算机科学与技术学院',
    classCount: 3,
    hours: 64,
    teacher: '李教授',
    studentCount: 120,
  },
  {
    id: '3',
    courseCode: 'EE101',
    courseName: '电路基础',
    college: '电子工程学院',
    classCount: 4,
    hours: 56,
    teacher: '王教授',
    studentCount: 130,
  },
  {
    id: '4',
    courseCode: 'MATH101',
    courseName: '高等数学',
    college: '数学学院',
    classCount: 8,
    hours: 80,
    teacher: '刘教授',
    studentCount: 200,
  },
]);

// 页码变化
const onPageChange = (current: number) => {
  pagination.current = current;
  // 这里添加加载数据的逻辑
};

// 查询
const handleSearch = () => {
  pagination.current = 1;
  // 这里添加查询逻辑
  console.log('搜索条件:', searchForm);
};

// 重置
const handleReset = () => {
  searchForm.semester = '2023-2024-1';
  searchForm.college = '';
  searchForm.course = '';
  handleSearch();
};

// 查看详情
const handleDetail = (record: any) => {
  console.log('查看详情:', record);
  // 这里添加查看详情逻辑
};

// 课程监测
const handleMonitor = (record: any) => {
  console.log('课程监测:', record);
  Message.success(`已开始监测课程: ${record.courseName}`);
  // 这里添加课程监测逻辑
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;

  .metric-card {
    height: 120px;
    
    .metric-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 8px;
    }
    
    .metric-value {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .metric-compare {
      font-size: 12px;
      
      .up {
        color: #f53f3f;
      }
      
      .down {
        color: #00b42a;
      }
      
      .compare-text {
        color: rgba(0, 0, 0, 0.45);
        margin-left: 8px;
      }
    }
  }
}
</style> 