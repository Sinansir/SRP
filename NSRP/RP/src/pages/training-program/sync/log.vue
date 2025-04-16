<template>
  <div class="program-sync-log">
    <t-card title="同步日志" :bordered="false">
      <t-space direction="vertical" style="width: 100%">
        <!-- 筛选区域 -->
        <t-row :gutter="[16, 16]" class="filter-area">
          <t-col :span="6">
            <t-date-picker
              v-model="searchParams.dateRange"
              mode="date"
              range
              placeholder="选择日期范围"
              style="width: 100%"
            />
          </t-col>
          <t-col :span="6">
            <t-select v-model="searchParams.syncType" placeholder="同步类型" clearable>
              <t-option v-for="item in syncTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </t-select>
          </t-col>
          <t-col :span="6">
            <t-select v-model="searchParams.status" placeholder="同步状态" clearable>
              <t-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </t-select>
          </t-col>
          <t-col :span="6">
            <t-space>
              <t-button theme="primary" @click="searchData">搜索</t-button>
              <t-button theme="default" @click="resetSearch">重置</t-button>
            </t-space>
          </t-col>
        </t-row>

        <!-- 表格区域 -->
        <t-table
          row-key="id"
          :data="tableData"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          @page-change="onPageChange"
          stripe
          hover
        >
          <template #syncType="{ row }">
            <t-tag v-if="row.syncType === 'push'" theme="primary" variant="light">推送到教务系统</t-tag>
            <t-tag v-else-if="row.syncType === 'pull'" theme="success" variant="light">从教务系统获取</t-tag>
            <t-tag v-else-if="row.syncType === 'both'" theme="warning" variant="light">双向同步</t-tag>
          </template>
          
          <template #startTime="{ row }">
            {{ formatDate(row.startTime) }}
          </template>
          
          <template #endTime="{ row }">
            {{ formatDate(row.endTime) }}
          </template>
          
          <template #duration="{ row }">
            {{ row.duration }}秒
          </template>
          
          <template #status="{ row }">
            <t-tag v-if="row.status === 'success'" theme="success">成功</t-tag>
            <t-tag v-else-if="row.status === 'partial'" theme="warning">部分成功</t-tag>
            <t-tag v-else-if="row.status === 'failed'" theme="danger">失败</t-tag>
            <t-tag v-else-if="row.status === 'running'" theme="primary">进行中</t-tag>
          </template>
          
          <template #operation="{ row }">
            <t-space>
              <t-button variant="text" theme="primary" @click="viewDetail(row)">详情</t-button>
              <t-button v-if="row.status === 'failed'" variant="text" theme="warning" @click="retry(row)">重试</t-button>
            </t-space>
          </template>
        </t-table>

        <!-- 详情抽屉 -->
        <t-drawer
          v-model:visible="detailDrawerVisible"
          header="同步详情"
          size="large"
          :footer="false"
        >
          <template v-if="currentDetail">
            <t-descriptions bordered size="large">
              <t-descriptions-item label="同步ID">{{ currentDetail.id }}</t-descriptions-item>
              <t-descriptions-item label="同步类型">
                <t-tag v-if="currentDetail.syncType === 'push'" theme="primary" variant="light">推送到教务系统</t-tag>
                <t-tag v-else-if="currentDetail.syncType === 'pull'" theme="success" variant="light">从教务系统获取</t-tag>
                <t-tag v-else-if="currentDetail.syncType === 'both'" theme="warning" variant="light">双向同步</t-tag>
              </t-descriptions-item>
              <t-descriptions-item label="同步内容">{{ getSyncContentText(currentDetail.content) }}</t-descriptions-item>
              <t-descriptions-item label="开始时间">{{ formatDate(currentDetail.startTime) }}</t-descriptions-item>
              <t-descriptions-item label="结束时间">{{ formatDate(currentDetail.endTime) }}</t-descriptions-item>
              <t-descriptions-item label="同步耗时">{{ currentDetail.duration }}秒</t-descriptions-item>
              <t-descriptions-item label="状态">
                <t-tag v-if="currentDetail.status === 'success'" theme="success">成功</t-tag>
                <t-tag v-else-if="currentDetail.status === 'partial'" theme="warning">部分成功</t-tag>
                <t-tag v-else-if="currentDetail.status === 'failed'" theme="danger">失败</t-tag>
                <t-tag v-else-if="currentDetail.status === 'running'" theme="primary">进行中</t-tag>
              </t-descriptions-item>
              <t-descriptions-item label="总记录数">{{ currentDetail.totalItems }}</t-descriptions-item>
              <t-descriptions-item label="成功记录数">{{ currentDetail.successItems }}</t-descriptions-item>
              <t-descriptions-item label="失败记录数">{{ currentDetail.failedItems }}</t-descriptions-item>
            </t-descriptions>
            
            <div class="log-detail-title">
              <h4>操作日志</h4>
            </div>
            
            <t-timeline>
              <t-timeline-item v-for="(log, index) in currentDetail.logs" :key="index">
                <template #dot>
                  <t-tag 
                    size="small" 
                    :theme="log.type === 'success' ? 'success' : log.type === 'warning' ? 'warning' : log.type === 'error' ? 'danger' : 'primary'"
                    :icon="log.type === 'success' ? 'check-circle' : log.type === 'warning' ? 'help-circle' : log.type === 'error' ? 'close-circle' : 'info-circle'"
                  />
                </template>
                <div class="log-time">{{ formatDate(log.time) }}</div>
                <div class="log-content">{{ log.message }}</div>
              </t-timeline-item>
            </t-timeline>
            
            <div class="drawer-footer">
              <t-space>
                <t-button v-if="currentDetail.status === 'failed'" theme="warning" @click="retry(currentDetail)">重试同步</t-button>
                <t-button theme="default" @click="detailDrawerVisible = false">关闭</t-button>
              </t-space>
            </div>
          </template>
        </t-drawer>
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { formatDate as formatDateUtil } from '@/utils/date';

// 同步类型选项
const syncTypeOptions = [
  { label: '推送到教务系统', value: 'push' },
  { label: '从教务系统获取', value: 'pull' },
  { label: '双向同步', value: 'both' },
];

// 状态选项
const statusOptions = [
  { label: '成功', value: 'success' },
  { label: '部分成功', value: 'partial' },
  { label: '失败', value: 'failed' },
  { label: '进行中', value: 'running' },
];

// 表格列定义
const columns = [
  { colKey: 'id', title: '同步ID', width: 120 },
  { colKey: 'syncType', title: '同步类型', width: 150 },
  { colKey: 'content', title: '同步内容', width: 180 },
  { colKey: 'startTime', title: '开始时间', width: 180 },
  { colKey: 'endTime', title: '结束时间', width: 180 },
  { colKey: 'duration', title: '耗时', width: 100 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'totalItems', title: '记录数', width: 80 },
  { colKey: 'operation', title: '操作', width: 120, fixed: 'right' },
];

// 表格数据
const tableData = ref([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: [5, 10, 20, 50],
});

// 搜索参数
const searchParams = reactive({
  dateRange: [],
  syncType: '',
  status: '',
});

// 详情抽屉
const detailDrawerVisible = ref(false);
const currentDetail = ref(null);

// 获取表格数据
const fetchTableData = async () => {
  try {
    loading.value = true;
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // 模拟数据
    const mockData = Array.from({ length: 20 }).map((_, index) => {
      const startTime = new Date(Date.now() - index * 3600000);
      const duration = Math.floor(Math.random() * 120) + 10;
      const endTime = new Date(startTime.getTime() + duration * 1000);
      const totalItems = Math.floor(Math.random() * 500) + 100;
      const successItems = Math.floor(totalItems * (Math.random() * 0.3 + 0.7));
      const failedItems = totalItems - successItems;
      
      let status;
      if (failedItems === 0) {
        status = 'success';
      } else if (failedItems < totalItems * 0.2) {
        status = 'partial';
      } else {
        status = 'failed';
      }
      
      // 最近的一条可能是正在进行中的
      if (index === 0 && Math.random() < 0.3) {
        status = 'running';
      }
      
      const syncTypes = ['push', 'pull', 'both'];
      const contentTypes = [
        '培养方案', 
        '培养方案, 课程', 
        '培养方案, 课程, 教师', 
        '培养方案, 课程, 教师, 学生'
      ];
      
      return {
        id: `SYNC${(10000 + index).toString()}`,
        syncType: syncTypes[index % 3],
        content: contentTypes[index % 4],
        startTime,
        endTime: status === 'running' ? null : endTime,
        duration: status === 'running' ? null : duration,
        status,
        totalItems,
        successItems,
        failedItems,
        logs: Array.from({ length: 5 + index % 5 }).map((_, logIndex) => {
          const logTime = new Date(startTime.getTime() + (logIndex * duration * 1000) / 5);
          const logTypes = ['info', 'success', 'warning', 'error'];
          return {
            time: logTime,
            type: logTypes[logIndex % 4],
            message: `同步操作日志${logIndex + 1}: ${status === 'failed' && logIndex === 4 ? '连接超时，同步失败' : '处理数据中...'}`
          };
        })
      };
    });
    
    // 根据搜索条件过滤
    const filteredData = mockData.filter(item => {
      const typeMatch = !searchParams.syncType || item.syncType === searchParams.syncType;
      const statusMatch = !searchParams.status || item.status === searchParams.status;
      
      let dateMatch = true;
      if (searchParams.dateRange && searchParams.dateRange.length === 2) {
        const startDate = new Date(searchParams.dateRange[0]);
        const endDate = new Date(searchParams.dateRange[1]);
        endDate.setHours(23, 59, 59, 999); // 设置为当天的最后一毫秒
        
        dateMatch = item.startTime >= startDate && item.startTime <= endDate;
      }
      
      return typeMatch && statusMatch && dateMatch;
    });
    
    // 分页
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    
    tableData.value = filteredData.slice(start, end);
    pagination.total = filteredData.length;
    
  } catch (error) {
    MessagePlugin.error('获取数据失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 页码变化
const onPageChange = (pageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchTableData();
};

// 搜索数据
const searchData = () => {
  pagination.current = 1;
  fetchTableData();
};

// 重置搜索
const resetSearch = () => {
  searchParams.dateRange = [];
  searchParams.syncType = '';
  searchParams.status = '';
  pagination.current = 1;
  fetchTableData();
};

// 获取同步内容文本
const getSyncContentText = (content) => {
  return content || '全部内容';
};

// 查看详情
const viewDetail = (row) => {
  currentDetail.value = { ...row };
  detailDrawerVisible.value = true;
};

// 重试同步
const retry = (row) => {
  MessagePlugin.info(`模拟重试同步: ${row.id}`);
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-';
  return formatDateUtil(date, 'YYYY-MM-DD HH:mm:ss');
};

// 页面加载时获取数据
onMounted(() => {
  fetchTableData();
});
</script>

<style lang="less" scoped>
.program-sync-log {
  padding: 20px 0;
  
  .filter-area {
    margin-bottom: 16px;
  }
  
  .log-detail-title {
    margin: 24px 0 16px;
    
    h4 {
      font-size: 16px;
      font-weight: 500;
      margin: 0;
    }
  }
  
  .log-time {
    font-size: 12px;
    color: var(--td-text-color-secondary);
    margin-bottom: 4px;
  }
  
  .log-content {
    font-size: 14px;
  }
  
  .drawer-footer {
    margin-top: 24px;
    text-align: right;
  }
}
</style> 