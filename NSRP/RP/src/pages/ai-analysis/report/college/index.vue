<template>
  <div class="container">
    <a-card class="general-card" title="学院分析报告">
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
                  <a-option value="1">计算机科学与技术学院</a-option>
                  <a-option value="2">电子工程学院</a-option>
                  <a-option value="3">数学学院</a-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="handleSearch">生成报告</a-button>
                  <a-button @click="handleExport">导出报告</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>

        <a-alert v-if="!hasData" type="info">请选择学院并生成报告</a-alert>

        <template v-if="hasData">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-card class="stat-card">
                <template #title>学院概况</template>
                <a-descriptions :data="collegeInfo" layout="horizontal" column="3" />
              </a-card>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-card class="chart-card">
                <template #title>课程开设统计</template>
                <div class="chart-placeholder">课程开设数量统计图表</div>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card class="chart-card">
                <template #title>学生选课情况</template>
                <div class="chart-placeholder">学生选课情况统计图表</div>
              </a-card>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="24">
              <a-card class="chart-card">
                <template #title>教学质量评估</template>
                <div class="chart-placeholder">教学质量评估雷达图</div>
              </a-card>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="24">
              <a-card class="table-card">
                <template #title>优质课程排名</template>
                <a-table :data="topCourses" :pagination="false">
                  <template #columns>
                    <a-table-column title="排名" data-index="rank" />
                    <a-table-column title="课程名称" data-index="name" />
                    <a-table-column title="主讲教师" data-index="teacher" />
                    <a-table-column title="学生评分" data-index="score" />
                    <a-table-column title="选课人数" data-index="studentCount" />
                  </template>
                </a-table>
              </a-card>
            </a-col>
          </a-row>
        </template>
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
  college: '1',
});

// 是否已有数据
const hasData = ref(false);

// 学院信息
const collegeInfo = [
  {
    label: '学院名称',
    value: '计算机科学与技术学院',
  },
  {
    label: '现任院长',
    value: '张三',
  },
  {
    label: '专业数量',
    value: '5',
  },
  {
    label: '学生数量',
    value: '1280',
  },
  {
    label: '教师数量',
    value: '68',
  },
  {
    label: '课程数量',
    value: '126',
  },
];

// 优质课程排名
const topCourses = [
  {
    rank: 1,
    name: '数据结构',
    teacher: '李教授',
    score: '4.9',
    studentCount: 320,
  },
  {
    rank: 2,
    name: '计算机网络',
    teacher: '王教授',
    score: '4.8',
    studentCount: 280,
  },
  {
    rank: 3,
    name: '操作系统',
    teacher: '张教授',
    score: '4.7',
    studentCount: 260,
  },
  {
    rank: 4,
    name: '编译原理',
    teacher: '刘教授',
    score: '4.6',
    studentCount: 240,
  },
  {
    rank: 5,
    name: '数据库系统',
    teacher: '赵教授',
    score: '4.5',
    studentCount: 300,
  },
];

// 搜索
const handleSearch = () => {
  if (!searchForm.college) {
    Message.warning('请选择学院');
    return;
  }
  
  Message.success('报告生成成功');
  hasData.value = true;
};

// 导出报告
const handleExport = () => {
  if (!hasData.value) {
    Message.warning('请先生成报告');
    return;
  }
  
  Message.success('报告导出成功');
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;

  .chart-placeholder {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }

  .stat-card, .chart-card, .table-card {
    margin-bottom: 16px;
  }
}
</style> 