<template>
  <div class="program-change-rejected">
    <t-card title="方案变更已驳回" :bordered="false">
      <template #actions>
        <t-row justify="end">
          <t-col>
            <t-space>
              <t-button theme="primary" @click="refreshTable">刷新</t-button>
            </t-space>
          </t-col>
        </t-row>
      </template>

      <!-- 筛选区域 -->
      <t-row :gutter="[16, 16]" class="filter-area">
        <t-col :span="6">
          <t-input v-model="searchParams.programName" placeholder="搜索方案名称" clearable></t-input>
        </t-col>
        <t-col :span="6">
          <t-select v-model="searchParams.major" placeholder="选择专业" clearable>
            <t-option v-for="item in majorOptions" :key="item.value" :label="item.label" :value="item.value" />
          </t-select>
        </t-col>
        <t-col :span="6">
          <t-select v-model="searchParams.changeType" placeholder="选择变更类型" clearable>
            <t-option v-for="item in changeTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <template #changeType="{ row }">
          <t-tag v-if="row.changeType === '1'" theme="primary" variant="light">培养目标变更</t-tag>
          <t-tag v-else-if="row.changeType === '2'" theme="success" variant="light">核心课程变更</t-tag>
          <t-tag v-else-if="row.changeType === '3'" theme="warning" variant="light">课程体系调整</t-tag>
          <t-tag v-else-if="row.changeType === '4'" theme="danger" variant="light">毕业要求调整</t-tag>
          <t-tag v-else-if="row.changeType === '5'" theme="default" variant="light">课程内容调整</t-tag>
          <t-tag v-else theme="default" variant="light">其他变更</t-tag>
        </template>
        
        <template #createTime="{ row }">
          {{ formatDate(row.createTime) }}
        </template>

        <template #rejectTime="{ row }">
          {{ formatDate(row.rejectTime) }}
        </template>
        
        <template #status="{ row }">
          <t-tag theme="danger">已驳回</t-tag>
        </template>
        
        <template #operation="{ row }">
          <t-space>
            <t-button variant="text" theme="primary" @click="viewDetail(row)">查看</t-button>
            <t-button variant="text" theme="warning" @click="reApply(row)">重新申请</t-button>
          </t-space>
        </template>
      </t-table>

      <!-- 详情抽屉 -->
      <t-drawer
        v-model:visible="detailDrawerVisible"
        header="变更详情"
        size="large"
        :footer="false"
      >
        <template v-if="currentDetail">
          <t-descriptions bordered size="large">
            <t-descriptions-item label="方案名称">{{ currentDetail.programName }}</t-descriptions-item>
            <t-descriptions-item label="专业">{{ getMajorLabel(currentDetail.major) }}</t-descriptions-item>
            <t-descriptions-item label="变更类型">{{ getChangeTypeLabel(currentDetail.changeType) }}</t-descriptions-item>
            <t-descriptions-item label="申请时间">{{ formatDate(currentDetail.createTime) }}</t-descriptions-item>
            <t-descriptions-item label="驳回时间">{{ formatDate(currentDetail.rejectTime) }}</t-descriptions-item>
            <t-descriptions-item label="申请人">{{ currentDetail.creator }}</t-descriptions-item>
            <t-descriptions-item label="驳回人">{{ currentDetail.rejecter }}</t-descriptions-item>
            <t-descriptions-item label="状态">
              <t-tag theme="danger">已驳回</t-tag>
            </t-descriptions-item>
            <t-descriptions-item label="变更原因" span="2">
              <div class="long-text">{{ currentDetail.reason || '无' }}</div>
            </t-descriptions-item>
            <t-descriptions-item label="变更内容" span="2">
              <div class="long-text">{{ currentDetail.content || '无' }}</div>
            </t-descriptions-item>
            <t-descriptions-item label="驳回理由" span="2">
              <div class="long-text rejection-reason">{{ currentDetail.rejectReason || '无' }}</div>
            </t-descriptions-item>
            <t-descriptions-item label="附件" span="2">
              <t-space v-if="currentDetail.attachments && currentDetail.attachments.length > 0">
                <t-link
                  v-for="(file, index) in currentDetail.attachments"
                  :key="index"
                  hover="underline"
                  @click="downloadFile(file)"
                >
                  {{ file.name }}
                </t-link>
              </t-space>
              <span v-else>无</span>
            </t-descriptions-item>
          </t-descriptions>
          
          <div class="drawer-footer">
            <t-space>
              <t-button theme="warning" @click="reApply(currentDetail)">重新申请</t-button>
              <t-button theme="default" @click="detailDrawerVisible = false">关闭</t-button>
            </t-space>
          </div>
        </template>
      </t-drawer>

      <!-- 重新申请对话框 -->
      <t-dialog
        v-model:visible="reapplyDialogVisible"
        header="重新申请"
        :footer="true"
        :on-confirm="confirmReapply"
        :on-cancel="() => (reapplyDialogVisible = false)"
        confirm-btn="确认"
        cancel-btn="取消"
      >
        <t-space direction="vertical" style="width: 100%">
          <p>您确定要重新提交此变更申请吗？</p>
          <p>重新申请将基于原申请内容创建新的变更申请，您可以在申请表单中修改变更内容。</p>
        </t-space>
      </t-dialog>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { formatDate as formatDateUtil } from '@/utils/date';

// 专业选项
const majorOptions = [
  { label: '计算机科学与技术', value: '1' },
  { label: '软件工程', value: '2' },
  { label: '网络工程', value: '3' },
  { label: '信息安全', value: '4' },
  { label: '物联网工程', value: '5' },
];

// 变更类型选项
const changeTypeOptions = [
  { label: '培养目标变更', value: '1' },
  { label: '核心课程变更', value: '2' },
  { label: '课程体系调整', value: '3' },
  { label: '毕业要求调整', value: '4' },
  { label: '课程内容调整', value: '5' },
];

// 表格列定义
const columns = [
  { colKey: 'programName', title: '方案名称', width: 180 },
  { colKey: 'major', title: '专业', width: 150 },
  { colKey: 'changeType', title: '变更类型', width: 150 },
  { colKey: 'creator', title: '申请人', width: 100 },
  { colKey: 'rejecter', title: '驳回人', width: 100 },
  { colKey: 'createTime', title: '申请时间', width: 160 },
  { colKey: 'rejectTime', title: '驳回时间', width: 160 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'operation', title: '操作', width: 150, fixed: 'right' },
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
  programName: '',
  major: '',
  changeType: '',
});

// 详情抽屉
const detailDrawerVisible = ref(false);
const currentDetail = ref(null);

// 重新申请对话框
const reapplyDialogVisible = ref(false);
const reapplyRecord = ref(null);

// 获取表格数据
const fetchTableData = async () => {
  try {
    loading.value = true;
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // 模拟数据
    const mockData = Array.from({ length: 15 }).map((_, index) => ({
      id: `${index + 200}`,
      programName: `培养方案${index + 1}`,
      major: (index % 5 + 1).toString(),
      changeType: (index % 5 + 1).toString(),
      creator: `用户${index % 3 + 1}`,
      rejecter: `审核员${index % 2 + 1}`,
      createTime: new Date(Date.now() - (index + 15) * 86400000),
      rejectTime: new Date(Date.now() - (index + 5) * 86400000),
      reason: `这是变更原因说明，详细描述了为什么需要进行此次变更。原因内容${index + 1}`,
      content: `这是变更内容说明，详细描述了本次变更的具体内容和涉及的课程。变更内容${index + 1}`,
      rejectReason: `驳回原因：变更内容不符合专业培养方向，请重新修改培养方案后再次提交。具体问题包括：\n1. 核心课程设置不合理\n2. 学分结构不平衡\n3. 缺少必要的先修课程要求`,
      attachments: index % 3 === 0 ? [
        { name: `附件1-${index}.docx`, url: '#' },
        { name: `附件2-${index}.pdf`, url: '#' },
      ] : [],
    }));
    
    // 根据搜索条件过滤
    const filteredData = mockData.filter(item => {
      const nameMatch = !searchParams.programName || item.programName.includes(searchParams.programName);
      const majorMatch = !searchParams.major || item.major === searchParams.major;
      const typeMatch = !searchParams.changeType || item.changeType === searchParams.changeType;
      return nameMatch && majorMatch && typeMatch;
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
  Object.keys(searchParams).forEach(key => {
    searchParams[key] = '';
  });
  pagination.current = 1;
  fetchTableData();
};

// 刷新表格
const refreshTable = () => {
  fetchTableData();
};

// 查看详情
const viewDetail = (row) => {
  currentDetail.value = { ...row };
  detailDrawerVisible.value = true;
};

// 重新申请
const reApply = (row) => {
  reapplyRecord.value = row;
  reapplyDialogVisible.value = true;
};

// 确认重新申请
const confirmReapply = async () => {
  try {
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    MessagePlugin.success('已创建新的变更申请');
    reapplyDialogVisible.value = false;
    
    // 如果详情抽屉打开，则关闭
    if (detailDrawerVisible.value) {
      detailDrawerVisible.value = false;
    }
    
    // 模拟跳转到申请页
    setTimeout(() => {
      MessagePlugin.info('即将跳转到变更申请页面');
    }, 1000);
    
  } catch (error) {
    MessagePlugin.error('操作失败');
    console.error(error);
  }
};

// 格式化日期
const formatDate = (date) => {
  return formatDateUtil(date, 'YYYY-MM-DD HH:mm');
};

// 获取专业名称
const getMajorLabel = (value) => {
  const option = majorOptions.find(item => item.value === value);
  return option ? option.label : value;
};

// 获取变更类型名称
const getChangeTypeLabel = (value) => {
  const option = changeTypeOptions.find(item => item.value === value);
  return option ? option.label : value;
};

// 下载文件
const downloadFile = (file) => {
  MessagePlugin.info(`模拟下载文件: ${file.name}`);
};

// 页面加载时获取数据
onMounted(() => {
  fetchTableData();
});
</script>

<style lang="less" scoped>
.program-change-rejected {
  padding: 20px;
  
  .filter-area {
    margin-bottom: 16px;
  }
  
  .long-text {
    white-space: pre-wrap;
    word-break: break-all;
  }
  
  .rejection-reason {
    color: var(--td-error-color);
    font-weight: 500;
  }
  
  .drawer-footer {
    margin-top: 24px;
    text-align: right;
  }
}
</style> 