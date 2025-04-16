<template>
  <div class="rejected-audit-page">
    <t-card title="已驳回课程" bordered>
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
            <t-form-item label="驳回日期">
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
            <t-button theme="default" variant="text" @click="viewRejectReason(row.id)">驳回原因</t-button>
            <t-button theme="warning" variant="text" @click="resubmit(row.id)">重新提交</t-button>
          </t-space>
        </template>
        <template #result="{ row }">
          <t-tag theme="danger" :style="{ marginRight: '0' }">
            驳回
          </t-tag>
        </template>
        <template #type="{ row }">
          {{ applicationTypes[row.type as keyof typeof applicationTypes] }}
        </template>
      </t-table>
    </t-card>

    <!-- 驳回原因对话框 -->
    <t-dialog
      v-model:visible="rejectReasonDialog.visible"
      header="驳回原因"
      :footer="false"
      width="680px"
    >
      <div class="reject-reason">
        <t-descriptions
          title="基本信息"
          :data="rejectReasonData.basic"
          layout="vertical"
          :column="2"
          bordered
          :colon="true"
        />
        <div class="reject-detail">
          <h3>驳回意见</h3>
          <t-alert theme="warning" message="以下为审批人的驳回意见，请根据意见修改后重新提交" />
          <div class="reason-content">
            {{ rejectReasonData.rejectComment }}
          </div>
        </div>
        <div class="reject-timeline">
          <h3>审批流程</h3>
          <t-timeline>
            <t-timeline-item v-for="(item, index) in rejectReasonData.timeline" :key="index">
              <template #dot>
                <t-tag size="small" shape="round" :theme="getTimelineTheme(item.status)">
                  {{ getTimelineLabel(item.status) }}
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

    <!-- 重新提交对话框 -->
    <t-dialog
      v-model:visible="resubmitDialog.visible"
      header="重新提交课程修改"
      :confirm-btn="{ content: '提交', loading: resubmitDialog.loading }"
      @confirm="handleResubmit"
    >
      <t-form :data="resubmitDialog.formData" ref="resubmitForm" :rules="resubmitRules">
        <t-form-item label="修改说明" name="comment">
          <t-textarea
            v-model="resubmitDialog.formData.comment"
            placeholder="请输入修改说明，描述您根据审批意见做出的修改"
            :maxlength="500"
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
        </t-form-item>
        <t-form-item label="上传附件" name="attachments">
          <t-upload
            v-model="resubmitDialog.formData.attachments"
            theme="file"
            multiple
            :max="5"
            :format-request="formatRequest"
            :format-response="formatResponse"
            action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          >
            <t-button>添加附件</t-button>
          </t-upload>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import type { PageInfo, PrimaryTableCol, TableRowData, UploadFile } from 'tdesign-vue-next';

interface AuditItem {
  id: string;
  code: string;
  name: string;
  applicant: string;
  auditor: string;
  auditDate: string;
  applyDate: string;
  type: string;
  rejectReason: string;
}

interface FormData {
  name: string;
  code: string;
  applicant: string;
  auditor: string;
  dateRange: Array<string>;
  type: string;
}

interface RejectReasonBasic {
  label: string;
  content: string;
}

interface TimelineItem {
  title: string;
  content: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

interface RejectReasonData {
  basic: RejectReasonBasic[];
  rejectComment: string;
  timeline: TimelineItem[];
}

interface ResubmitFormData {
  comment: string;
  attachments: UploadFile[];
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
const resubmitForm = ref();

// 表单数据
const formData = reactive<FormData>({
  name: '',
  code: '',
  applicant: '',
  auditor: '',
  dateRange: [],
  type: '',
});

// 驳回原因对话框
const rejectReasonDialog = reactive({
  visible: false,
  currentId: '',
});

// 驳回原因数据
const rejectReasonData = reactive<RejectReasonData>({
  basic: [],
  rejectComment: '',
  timeline: []
});

// 重新提交对话框
const resubmitDialog = reactive({
  visible: false,
  currentId: '',
  loading: false,
  formData: {
    comment: '',
    attachments: [],
  } as ResubmitFormData,
});

// 表格列配置
const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'code', title: '课程编码', width: 120 },
  { colKey: 'name', title: '课程名称', width: 200 },
  { colKey: 'applicant', title: '申请人', width: 100 },
  { colKey: 'applyDate', title: '申请日期', width: 120 },
  { colKey: 'auditor', title: '审批人', width: 100 },
  { colKey: 'auditDate', title: '驳回日期', width: 120 },
  { colKey: 'type', title: '申请类型', width: 100 },
  { colKey: 'result', title: '审批结果', width: 100 },
  { colKey: 'operation', title: '操作', width: 260, fixed: 'right' as const },
];

// 表格数据
const auditList = ref<AuditItem[]>([]);
const loading = ref(false);

// 重新提交表单规则
const resubmitRules = {
  comment: [{ required: true, message: '请输入修改说明', type: 'error' as const }],
};

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

// 获取已驳回列表
const fetchAuditList = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    
    // 模拟数据
    const mockData = Array.from({ length: 10 }).map((_, index) => ({
      id: `rejected_${index + 1}`,
      code: `COURSE${1000 + index}`,
      name: `课程示例 ${index + 1}`,
      applicant: `申请人 ${(index % 3) + 1}`,
      auditor: `审批人 ${(index % 4) + 1}`,
      applyDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      auditDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      type: Object.keys(applicationTypes)[index % 4],
      rejectReason: [
        '课程内容与培养目标不符，请重新调整课程大纲',
        '课程学分设置不合理，请参考相关标准进行修改',
        '课程教材选择不当，请选择更适合的教材',
        '课程描述不够详细，请补充完善',
        '课程先修要求设置不合理，请重新考虑'
      ][index % 5],
    }));

    auditList.value = mockData;
    pagination.total = 100; // 模拟总数
  } catch (error) {
    MessagePlugin.error('获取已驳回列表失败');
    console.error('获取已驳回列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取时间线状态对应的主题
const getTimelineTheme = (status: string): 'success' | 'warning' | 'danger' => {
  const themes: Record<string, 'success' | 'warning' | 'danger'> = {
    success: 'success',
    warning: 'warning',
    error: 'danger',
  };
  return themes[status] || 'warning';
};

// 获取时间线状态对应的文字
const getTimelineLabel = (status: string): string => {
  const labels: Record<string, string> = {
    success: '通过',
    warning: '待审',
    error: '驳回',
  };
  return labels[status] || '待定';
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
  const courseId = id.replace('rejected_', '');
  router.push(`/course-library/maintain/view/${courseId}`);
};

// 查看驳回原因
const viewRejectReason = async (id: string) => {
  rejectReasonDialog.currentId = id;
  rejectReasonDialog.visible = true;
  
  // 模拟加载驳回原因数据
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 300);
  });
  
  // 生成基本信息
  const courseItem = auditList.value.find(item => item.id === id);
  if (courseItem) {
    rejectReasonData.basic = [
      { label: '课程编码', content: courseItem.code },
      { label: '课程名称', content: courseItem.name },
      { label: '申请人', content: courseItem.applicant },
      { label: '申请日期', content: courseItem.applyDate },
      { label: '申请类型', content: applicationTypes[courseItem.type as keyof typeof applicationTypes] },
      { label: '审批人', content: courseItem.auditor },
      { label: '驳回日期', content: courseItem.auditDate },
    ];
    
    // 设置驳回意见
    rejectReasonData.rejectComment = courseItem.rejectReason;
    
    // 生成时间线数据
    rejectReasonData.timeline = [
      {
        title: '提交申请',
        content: `由${courseItem.applicant}提交${applicationTypes[courseItem.type as keyof typeof applicationTypes]}申请`,
        time: courseItem.applyDate,
        status: 'success',
      },
      {
        title: '审核驳回',
        content: `由${courseItem.auditor}审核驳回，原因：${courseItem.rejectReason}`,
        time: courseItem.auditDate,
        status: 'error',
      },
    ];
  }
};

// 重新提交
const resubmit = (id: string) => {
  resubmitDialog.currentId = id;
  resubmitDialog.visible = true;
  resubmitDialog.formData.comment = '';
  resubmitDialog.formData.attachments = [];
};

// 处理重新提交
const handleResubmit = async () => {
  const valid = await resubmitForm.value?.validate();
  if (!valid) return;
  
  resubmitDialog.loading = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
    
    MessagePlugin.success('课程修改已重新提交，请等待审核');
    resubmitDialog.visible = false;
    
    // 从列表中移除该项
    const index = auditList.value.findIndex(item => item.id === resubmitDialog.currentId);
    if (index !== -1) {
      auditList.value.splice(index, 1);
    }
    if (auditList.value.length === 0 && pagination.current > 1) {
      pagination.current -= 1;
      fetchAuditList();
    }
  } catch (error) {
    MessagePlugin.error('提交失败，请重试');
    console.error('重新提交失败:', error);
  } finally {
    resubmitDialog.loading = false;
  }
};

// 格式化上传请求
const formatRequest = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('courseId', resubmitDialog.currentId);
  return {
    body: formData,
  };
};

// 格式化上传响应
const formatResponse = () => {
  return { url: 'https://example.com/file.pdf' };
};

onMounted(() => {
  fetchAuditList();
});
</script>

<style lang="less" scoped>
.rejected-audit-page {
  .audit-list-card {
    margin-top: 16px;
  }
  
  .reject-reason {
    .reject-detail {
      margin-top: 24px;
      
      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 500;
      }
      
      .reason-content {
        margin-top: 12px;
        padding: 16px;
        background-color: var(--td-bg-color-container);
        border-radius: 6px;
        border: 1px solid var(--td-component-stroke);
        line-height: 1.6;
      }
    }
    
    .reject-timeline {
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