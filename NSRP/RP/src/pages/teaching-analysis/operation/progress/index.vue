<template>
  <div class="container">
    <a-card class="general-card" title="教学进度监控">
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
              <a-form-item field="status" label="状态">
                <a-select v-model="searchForm.status" placeholder="请选择状态" style="width: 120px">
                  <a-option value="">全部</a-option>
                  <a-option value="normal">正常</a-option>
                  <a-option value="delay">延迟</a-option>
                  <a-option value="ahead">提前</a-option>
                </a-select>
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
            <a-card class="stat-card">
              <div class="stat-value">85%</div>
              <div class="stat-title">总体进度</div>
              <a-progress :percent="85" color="#165dff" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="stat-card">
              <div class="stat-value">76</div>
              <div class="stat-title">正常课程</div>
              <div class="stat-footer">
                <icon-check-circle-fill style="color: #00b42a; margin-right: 4px" />
                <span>占比 76%</span>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="stat-card">
              <div class="stat-value">18</div>
              <div class="stat-title">延迟课程</div>
              <div class="stat-footer">
                <icon-exclamation-circle-fill style="color: #f53f3f; margin-right: 4px" />
                <span>占比 18%</span>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="stat-card">
              <div class="stat-value">6</div>
              <div class="stat-title">提前课程</div>
              <div class="stat-footer">
                <icon-play-circle-fill style="color: #0fc6c2; margin-right: 4px" />
                <span>占比 6%</span>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <a-table
          :loading="loading"
          :data="filteredData"
          :pagination="pagination"
          @page-change="onPageChange"
        >
          <template #columns>
            <a-table-column title="课程编号" data-index="courseCode" />
            <a-table-column title="课程名称" data-index="courseName" />
            <a-table-column title="授课教师" data-index="teacher" />
            <a-table-column title="计划进度" data-index="planProgress">
              <template #cell="{ record }">
                {{ record.planProgress }}%
              </template>
            </a-table-column>
            <a-table-column title="实际进度" data-index="actualProgress">
              <template #cell="{ record }">
                {{ record.actualProgress }}%
              </template>
            </a-table-column>
            <a-table-column title="进度状态" data-index="status">
              <template #cell="{ record }">
                <a-tag
                  :color="
                    record.status === 'normal'
                      ? 'green'
                      : record.status === 'delay'
                      ? 'red'
                      : 'blue'
                  "
                >
                  {{ getStatusText(record.status) }}
                  {{ getProgressDiff(record) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="最近更新" data-index="lastUpdate" />
            <a-table-column title="操作" width="150">
              <template #cell="{ record }">
                <a-space>
                  <a-button type="text" size="small" @click="handleDetail(record)">
                    详情
                  </a-button>
                  <a-button type="text" size="small" @click="handleUpdate(record)">
                    更新
                  </a-button>
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
import { ref, reactive, computed } from 'vue';
import { Message } from '@arco-design/web-vue';

// 搜索表单
const searchForm = reactive({
  semester: '2023-2024-1',
  college: '',
  course: '',
  status: '',
});

// 表格加载状态
const loading = ref(false);

// 分页配置
const pagination = reactive({
  total: 100,
  current: 1,
  pageSize: 10,
});

// 课程进度数据
const courseProgressData = ref([
  {
    id: '1',
    courseCode: 'CS101',
    courseName: '计算机导论',
    teacher: '张教授',
    planProgress: 85,
    actualProgress: 83,
    status: 'normal',
    lastUpdate: '2023-12-10',
  },
  {
    id: '2',
    courseCode: 'CS201',
    courseName: '数据结构',
    teacher: '李教授',
    planProgress: 80,
    actualProgress: 65,
    status: 'delay',
    lastUpdate: '2023-12-09',
  },
  {
    id: '3',
    courseCode: 'CS301',
    courseName: '操作系统',
    teacher: '王教授',
    planProgress: 75,
    actualProgress: 85,
    status: 'ahead',
    lastUpdate: '2023-12-11',
  },
  {
    id: '4',
    courseCode: 'MATH101',
    courseName: '高等数学',
    teacher: '刘教授',
    planProgress: 90,
    actualProgress: 88,
    status: 'normal',
    lastUpdate: '2023-12-08',
  },
  {
    id: '5',
    courseCode: 'EE101',
    courseName: '电路基础',
    teacher: '赵教授',
    planProgress: 70,
    actualProgress: 60,
    status: 'delay',
    lastUpdate: '2023-12-07',
  },
]);

// 筛选后的数据
const filteredData = computed(() => {
  let result = [...courseProgressData.value];
  
  if (searchForm.course) {
    result = result.filter(
      (item) => item.courseName.includes(searchForm.course) || item.courseCode.includes(searchForm.course)
    );
  }
  
  if (searchForm.status) {
    result = result.filter((item) => item.status === searchForm.status);
  }
  
  return result;
});

// 状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    normal: '正常',
    delay: '延迟',
    ahead: '提前',
  };
  return statusMap[status] || status;
};

// 进度差异
const getProgressDiff = (record: any) => {
  const diff = record.actualProgress - record.planProgress;
  return diff > 0 ? `+${diff}%` : `${diff}%`;
};

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
  searchForm.status = '';
  handleSearch();
};

// 查看详情
const handleDetail = (record: any) => {
  Message.info(`查看课程进度详情: ${record.courseName}`);
  // 在这里实现查看详情逻辑
};

// 更新进度
const handleUpdate = (record: any) => {
  Message.info(`更新课程进度: ${record.courseName}`);
  // 在这里实现更新进度逻辑
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;

  .stat-card {
    height: 120px;
    
    .stat-value {
      font-size: 28px;
      font-weight: 500;
      color: #1d2129;
      margin-bottom: 4px;
    }
    
    .stat-title {
      font-size: 14px;
      color: #86909c;
      margin-bottom: 12px;
    }
    
    .stat-footer {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #86909c;
    }
  }
}
</style> 