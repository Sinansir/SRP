<template>
  <div class="approved-audit-page">
    <t-card title="已审核课程" bordered>
      <template #actions>
        <t-button theme="primary" @click="resetSearch">重置</t-button>
        <t-button theme="primary" @click="searchAudit">查询</t-button>
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
            <t-form-item label="审批人">
              <t-input v-model="formData.auditor" placeholder="请输入审批人" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="审批日期">
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
            <t-form-item label="申请人">
              <t-input v-model="formData.applicant" placeholder="请输入申请人" />
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    </t-card>

    <t-card bordered class="audit-list-card">
      <t-table
        :data="auditList"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        stripe
        row-key="id"
      >
        <template #operation="{ row }">
          <t-space>
            <t-button theme="primary" variant="text" @click="viewDetails(row.id)">查看</t-button>
            <t-button theme="default" variant="text" @click="viewAuditDetail(row.id)">审批详情</t-button>
          </t-space>
        </template>
        <template #result="{ row }">
          <t-tag theme="success" :style="{ marginRight: '0' }">
            通过
          </t-tag>
        </template>
        <template #type="{ row }">
          {{ applicationTypes[row.type as keyof typeof applicationTypes] }}
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="auditDetailDialog.visible"
      header="审批详情"
      :footer="false"
      width="680px"
    >
      <div class="audit-detail">
        <t-descriptions
          title="基本信息"
          :data="auditDetailData.basic"
          layout="vertical"
          :column="2"
          bordered
          :colon="true"
        />
        <div class="audit-timeline">
          <h3>审批流程</h3>
          <t-timeline mode="alternate">
            <t-timeline-item v-for="(item, index) in auditDetailData.timeline" :key="index">
              <template #dot>
                <t-tag size="small" shape="round" :theme="item.status === 'success' ? 'success' : 'warning'">
                  {{ item.status === 'success' ? '通过' : '待审' }}
                </t-tag>
              </template>
              <template #label>
                {{ item.time }}
              </template>
              <div>
                <p class="timeline-title">{{ item.title }}</p>
                <p class="timeline-content">{{ item.content }}</p>
              </div>
            </t-timeline-item>
          </t-timeline>
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import type { PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

interface AuditItem {
  id: string;
  code: string;
  name: string;
  applicant: string;
  auditor: string;
  auditDate: string;
  applyDate: string;
  type: string;
}

interface FormData {
  name: string;
  code: string;
  applicant: string;
  auditor: string;
  dateRange: Array<string>;
  type: string;
}

interface AuditDetailBasic {
  label: string;
  content: string;
}

interface AuditTimeline {
  title: string;
  content: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

interface AuditDetail {
  basic: AuditDetailBasic[];
  timeline: AuditTimeline[];
}

// 申请类型
const applicationTypes = {
  create: '新建',
  update: '修改',
  disable: '停用',
  enable: '启用',
};

const router = useRouter();
const form = ref();

// 表单数据
const formData = reactive<FormData>({
  name: '',
  code: '',
  applicant: '',
  auditor: '',
  dateRange: [],
  type: '',
});

// 审批详情对话框
const auditDetailDialog = reactive({
  visible: false,
  currentId: '',
});

// 审批详情数据
const auditDetailData = reactive<AuditDetail>({
  basic: [],
  timeline: []
});

// 表格列配置
const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'code', title: '课程编码', width: 120 },
  { colKey: 'name', title: '课程名称', width: 200 },
  { colKey: 'applicant', title: '申请人', width: 120 },
  { colKey: 'applyDate', title: '申请日期', width: 120 },
  { colKey: 'auditor', title: '审批人', width: 120 },
  { colKey: 'auditDate', title: '审批日期', width: 120 },
  { colKey: 'type', title: '申请类型', width: 120 },
  { colKey: 'result', title: '审批结果', width: 100 },
  { colKey: 'operation', title: '操作', width: 180, fixed: 'right' as const },
];

// 表格数据
const auditList = ref<AuditItem[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: [10, 20, 50],
  showJumper: true,
  showPageSize: true,
  onChange: (pageInfo: PageInfo) => {
    pagination.current = pageInfo.current;
    pagination.pageSize = pageInfo.pageSize;
    fetchAuditList();
  },
});

// 获取已审核列表
const fetchAuditList = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    
    // 模拟数据
    const mockData = Array.from({ length: 10 }).map((_, index) => ({
      id: `approved_${index + 1}`,
      code: `COURSE${1000 + index}`,
      name: `课程示例 ${index + 1}`,
      applicant: `申请人 ${(index % 3) + 1}`,
      auditor: `审批人 ${(index % 4) + 1}`,
      applyDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      auditDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      type: Object.keys(applicationTypes)[index % 4],
    }));

    auditList.value = mockData;
    pagination.total = 100; // 模拟总数
  } catch (error) {
    MessagePlugin.error('获取已审核列表失败');
    console.error('获取已审核列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 查询
const searchAudit = () => {
  pagination.current = 1;
  fetchAuditList();
};

// 重置查询
const resetSearch = () => {
  form.value?.reset();
  pagination.current = 1;
  fetchAuditList();
};

// 查看课程详情
const viewDetails = (id: string) => {
  // 从ID提取课程ID
  const courseId = id.replace('approved_', '');
  router.push(`/course-library/maintain/view/${courseId}`);
};

// 查看审批详情
const viewAuditDetail = async (id: string) => {
  auditDetailDialog.currentId = id;
  auditDetailDialog.visible = true;
  
  // 模拟加载审批详情数据
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 300);
  });
  
  // 生成基本信息
  const courseItem = auditList.value.find(item => item.id === id);
  if (courseItem) {
    auditDetailData.basic = [
      { label: '课程编码', content: courseItem.code },
      { label: '课程名称', content: courseItem.name },
      { label: '申请人', content: courseItem.applicant },
      { label: '申请日期', content: courseItem.applyDate },
      { label: '申请类型', content: applicationTypes[courseItem.type as keyof typeof applicationTypes] },
      { label: '审批人', content: courseItem.auditor },
      { label: '审批日期', content: courseItem.auditDate },
      { label: '审批结果', content: '通过' },
    ];
    
    // 生成时间线数据
    const applyDate = new Date(courseItem.applyDate);
    const auditDate = new Date(courseItem.auditDate);
    
    auditDetailData.timeline = [
      {
        title: '提交申请',
        content: `由${courseItem.applicant}提交${applicationTypes[courseItem.type as keyof typeof applicationTypes]}申请`,
        time: courseItem.applyDate,
        status: 'success',
      },
      {
        title: '审核通过',
        content: `由${courseItem.auditor}审核通过，审批意见：符合课程标准要求，同意通过。`,
        time: courseItem.auditDate,
        status: 'success',
      },
      {
        title: '变更生效',
        content: '系统自动更新课程信息',
        time: new Date(auditDate.getTime() + 10 * 60000).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit', 
          minute: '2-digit'
        }).replace(/\//g, '-'),
        status: 'success',
      },
    ];
  }
};

onMounted(() => {
  fetchAuditList();
});
</script>

<style lang="less" scoped>
.approved-audit-page {
  .audit-list-card {
    margin-top: 16px;
  }
  
  .audit-detail {
    .audit-timeline {
      margin-top: 24px;
      
      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 500;
      }
      
      .timeline-title {
        font-weight: 500;
        margin-bottom: 4px;
      }
      
      .timeline-content {
        color: var(--td-text-color-secondary);
        font-size: 13px;
      }
    }
  }
}
</style> 