<template>
  <div class="pending-audit-page">
    <t-card title="待审核课程" bordered>
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
            <t-form-item label="申请人">
              <t-input v-model="formData.applicant" placeholder="请输入申请人" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="申请日期">
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
            <t-form-item label="紧急程度">
              <t-select v-model="formData.priority" placeholder="请选择紧急程度" clearable>
                <t-option v-for="(value, key) in priorityOptions" :key="key" :value="key" :label="value" />
              </t-select>
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
            <t-button theme="primary" variant="text" @click="openApproveDialog(row.id, 'approve')">审批通过</t-button>
            <t-button theme="danger" variant="text" @click="openApproveDialog(row.id, 'reject')">驳回</t-button>
          </t-space>
        </template>
        <template #priority="{ row }">
          <t-tag :theme="getPriorityTheme(row.priority)" :style="{ marginRight: '0' }">
            {{ priorityOptions[row.priority as keyof typeof priorityOptions] }}
          </t-tag>
        </template>
        <template #type="{ row }">
          {{ applicationTypes[row.type as keyof typeof applicationTypes] }}
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="approveDialog.visible"
      :header="approveDialog.type === 'approve' ? '审批通过' : '驳回'"
      :confirm-btn="{ content: '确认', loading: approveDialog.loading }"
      @confirm="handleApprove"
    >
      <t-form :data="approveDialog.formData" ref="approveForm" :rules="approveRules">
        <t-form-item label="审批意见" name="comment">
          <t-textarea
            v-model="approveDialog.formData.comment"
            placeholder="请输入审批意见"
            :maxlength="200"
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
        </t-form-item>
      </t-form>
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
  applyDate: string;
  type: string;
  priority: string;
}

interface FormData {
  name: string;
  code: string;
  applicant: string;
  dateRange: Array<string>;
  type: string;
  priority: string;
}

// 申请类型
const applicationTypes = {
  create: '新建',
  update: '修改',
  disable: '停用',
  enable: '启用',
};

// 紧急程度
const priorityOptions = {
  normal: '普通',
  urgent: '紧急',
  very_urgent: '非常紧急',
};

type PriorityType = 'normal' | 'urgent' | 'very_urgent';
type PriorityTheme = 'default' | 'primary' | 'warning' | 'danger';

const router = useRouter();
const form = ref();
const approveForm = ref();

// 表单数据
const formData = reactive<FormData>({
  name: '',
  code: '',
  applicant: '',
  dateRange: [],
  type: '',
  priority: '',
});

// 审批对话框
const approveDialog = reactive({
  visible: false,
  type: 'approve',
  currentId: '',
  loading: false,
  formData: {
    comment: '',
  },
});

// 表格列配置
const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'code', title: '课程编码', width: 120 },
  { colKey: 'name', title: '课程名称', width: 200 },
  { colKey: 'applicant', title: '申请人', width: 120 },
  { colKey: 'applyDate', title: '申请日期', width: 120 },
  { colKey: 'type', title: '申请类型', width: 120 },
  { colKey: 'priority', title: '紧急程度', width: 120 },
  { colKey: 'operation', title: '操作', width: 200, fixed: 'right' as const },
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

// 审批表单规则
const approveRules = {
  comment: [{ required: true, message: '请输入审批意见', type: 'error' as const }],
};

// 获取优先级对应的主题色
const getPriorityTheme = (priority: string): PriorityTheme => {
  const themes: Record<PriorityType, PriorityTheme> = {
    normal: 'default',
    urgent: 'warning',
    very_urgent: 'danger',
  };
  return themes[priority as PriorityType] || 'default';
};

// 查询待审核列表
const fetchAuditList = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    
    // 模拟数据
    const mockData = Array.from({ length: 10 }).map((_, index) => ({
      id: `audit_${index + 1}`,
      code: `COURSE${1000 + index}`,
      name: `课程示例 ${index + 1}`,
      applicant: `申请人 ${(index % 3) + 1}`,
      applyDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      type: Object.keys(applicationTypes)[index % 4],
      priority: Object.keys(priorityOptions)[index % 3],
    }));

    auditList.value = mockData;
    pagination.total = 100; // 模拟总数
  } catch (error) {
    MessagePlugin.error('获取待审核列表失败');
    console.error('获取待审核列表失败:', error);
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

// 查看详情
const viewDetails = (id: string) => {
  router.push(`/course-library/audit/details/${id}`);
};

// 打开审批对话框
const openApproveDialog = (id: string, type: 'approve' | 'reject') => {
  approveDialog.visible = true;
  approveDialog.type = type;
  approveDialog.currentId = id;
  approveDialog.formData.comment = '';
};

// 处理审批
const handleApprove = async () => {
  const valid = await approveForm.value?.validate();
  if (!valid) return;

  approveDialog.loading = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
    
    MessagePlugin.success(`课程${approveDialog.type === 'approve' ? '审批通过' : '驳回'}成功`);
    approveDialog.visible = false;
    fetchAuditList(); // 刷新列表
  } catch (error) {
    MessagePlugin.error(`课程${approveDialog.type === 'approve' ? '审批通过' : '驳回'}失败`);
    console.error('审批操作失败:', error);
  } finally {
    approveDialog.loading = false;
  }
};

// 初始化
onMounted(() => {
  fetchAuditList();
});
</script>

<style lang="less" scoped>
.pending-audit-page {
  .audit-list-card {
    margin-top: 16px;
  }
}
</style> 