<template>
  <div class="exam-type-container">
    <t-card title="考试形式维护" subtitle="管理考试形式数据" header-bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleAdd">新增考试形式</t-button>
          <t-button theme="default" @click="handleSync">教务系统同步</t-button>
        </t-space>
      </template>
      
      <t-form ref="form" :data="formData" :style="{ marginBottom: '20px' }">
        <t-row :gutter="[16, 16]">
          <t-col :span="6">
            <t-form-item label="形式名称">
              <t-input v-model="formData.name" placeholder="请输入形式名称" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="形式代码">
              <t-input v-model="formData.code" placeholder="请输入形式代码" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="状态">
              <t-select v-model="formData.status" placeholder="请选择状态" clearable>
                <t-option :key="1" label="正常" :value="1" />
                <t-option :key="0" label="禁用" :value="0" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item>
              <t-space>
                <t-button theme="primary" @click="handleSearch">查询</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
              </t-space>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    
      <t-table
        row-key="id"
        :data="examTypeList"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
        hover
      >
        <template #status="{ row }">
          <t-tag :theme="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </t-tag>
        </template>
        <template #operation="{ row }">
          <t-space>
            <t-button theme="primary" variant="text" size="small" @click="handleEdit(row)">
              编辑
            </t-button>
            <t-button 
              :theme="row.status === 1 ? 'warning' : 'success'" 
              variant="text" 
              size="small" 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </t-button>
            <t-button theme="danger" variant="text" size="small" @click="handleDelete(row.id)">
              删除
            </t-button>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 新增/编辑对话框 -->
    <t-dialog
      :visible="dialogVisible"
      :header="isEdit ? '编辑考试形式' : '新增考试形式'"
      :on-close="() => (dialogVisible = false)"
      :on-confirm="handleConfirm"
      :confirm-btn="{ content: '确定', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      width="500"
    >
      <t-form
        ref="examTypeForm"
        :data="examTypeForm"
        :rules="rules"
        label-width="100px"
        @submit="handleConfirm"
      >
        <t-form-item label="形式名称" name="name">
          <t-input v-model="examTypeForm.name" placeholder="请输入形式名称" />
        </t-form-item>
        <t-form-item label="形式代码" name="code">
          <t-input v-model="examTypeForm.code" placeholder="请输入形式代码（如：KS、KC）" />
        </t-form-item>
        <t-form-item label="排序" name="sort">
          <t-input-number v-model="examTypeForm.sort" :min="1" placeholder="数字越小越靠前" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group v-model="examTypeForm.status">
            <t-radio :value="1">正常</t-radio>
            <t-radio :value="0">禁用</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- 同步结果对话框 -->
    <t-dialog
      :visible="syncResultVisible"
      header="同步结果"
      :on-close="() => (syncResultVisible = false)"
      :on-confirm="() => (syncResultVisible = false)"
      :confirm-btn="{ content: '确定', theme: 'primary' }"
      width="500"
    >
      <div v-if="syncResult">
        <t-space direction="vertical">
          <p>同步完成！</p>
          <t-row>
            <t-col :span="8">新增数据：</t-col>
            <t-col :span="16">{{ syncResult.added }}条</t-col>
          </t-row>
          <t-row>
            <t-col :span="8">更新数据：</t-col>
            <t-col :span="16">{{ syncResult.updated }}条</t-col>
          </t-row>
          <t-row>
            <t-col :span="8">失败数据：</t-col>
            <t-col :span="16">{{ syncResult.failed }}条</t-col>
          </t-row>
        </t-space>
      </div>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import type { PrimaryTableCol, TableRowData, PageInfo } from 'tdesign-vue-next';

interface ExamTypeItem {
  id: number;
  code: string;
  name: string;
  status: number;
  sort: number;
  createTime: string;
  updateTime: string;
}

interface SyncResult {
  added: number;
  updated: number;
  failed: number;
}

// 表单数据
const formData = reactive({
  name: '',
  code: '',
  status: null as number | null,
});

// 表格列定义
const columns: PrimaryTableCol<ExamTypeItem>[] = [
  { colKey: 'code', title: '形式代码', width: 120 },
  { colKey: 'name', title: '形式名称', width: 180 },
  { colKey: 'sort', title: '排序', width: 80 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'createTime', title: '创建时间', width: 180 },
  { colKey: 'updateTime', title: '更新时间', width: 180 },
  { colKey: 'operation', title: '操作', width: 180, fixed: 'right' },
];

// 表格数据和加载状态
const examTypeList = ref<ExamTypeItem[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50],
});

// 对话框相关
const dialogVisible = ref(false);
const isEdit = ref(false);
const examTypeForm = reactive({
  id: 0,
  name: '',
  code: '',
  sort: 1,
  status: 1,
});

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入形式名称', type: 'error' }],
  code: [
    { required: true, message: '请输入形式代码', type: 'error' },
    { validator: (val: string) => /^[A-Z]{2}$/.test(val), message: '形式代码必须为2个大写字母', type: 'error' }
  ],
  sort: [{ required: true, message: '请输入排序', type: 'error' }],
};

// 同步结果
const syncResultVisible = ref(false);
const syncResult = ref<SyncResult | null>(null);

// 页面挂载时获取数据
onMounted(() => {
  fetchExamTypeList();
});

// 获取考试形式列表数据
const fetchExamTypeList = async () => {
  loading.value = true;
  try {
    const { pageSize, current: pageIndex } = pagination;
    const params = {
      pageSize: pageSize.toString(),
      pageIndex: pageIndex.toString(),
      name: formData.name,
      code: formData.code,
      status: formData.status !== null ? formData.status.toString() : '',
    };
    
    const response = await fetch(`/api/course/exam-type/list?${new URLSearchParams(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (result.code === 0) {
      examTypeList.value = result.data.list;
      pagination.total = result.data.total;
    } else {
      MessagePlugin.error(result.message || '获取考试形式列表失败');
    }
  } catch (error) {
    console.error('获取考试形式列表出错:', error);
    MessagePlugin.error('获取考试形式列表失败');
  } finally {
    loading.value = false;
  }
};

// 分页变化
const onPageChange = (pageInfo: PageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchExamTypeList();
};

// 新增考试形式
const handleAdd = () => {
  isEdit.value = false;
  examTypeForm.id = 0;
  examTypeForm.name = '';
  examTypeForm.code = '';
  examTypeForm.sort = examTypeList.value.length + 1;
  examTypeForm.status = 1;
  dialogVisible.value = true;
};

// 编辑考试形式
const handleEdit = (row: ExamTypeItem) => {
  isEdit.value = true;
  examTypeForm.id = row.id;
  examTypeForm.name = row.name;
  examTypeForm.code = row.code;
  examTypeForm.sort = row.sort;
  examTypeForm.status = row.status;
  dialogVisible.value = true;
};

// 切换考试形式状态
const handleToggleStatus = async (row: ExamTypeItem) => {
  const newStatus = row.status === 1 ? 0 : 1;
  const statusText = newStatus === 1 ? '启用' : '禁用';
  
  try {
    if (confirm(`确定要${statusText}考试形式"${row.name}"吗？`)) {
      const response = await fetch('/api/course/exam-type/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: row.id,
          status: newStatus,
        }),
      });
      
      const result = await response.json();
      
      if (result.code === 0) {
        MessagePlugin.success(`${statusText}成功`);
        fetchExamTypeList();
      } else {
        MessagePlugin.error(result.message || `${statusText}失败`);
      }
    }
  } catch (error) {
    console.error(`${statusText}考试形式出错:`, error);
    MessagePlugin.error(`${statusText}失败`);
  }
};

// 删除考试形式
const handleDelete = (id: number) => {
  if (confirm('确定要删除该考试形式吗？此操作不可恢复。')) {
    try {
      fetch(`/api/course/exam-type/delete/${id}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(result => {
        if (result.code === 0) {
          MessagePlugin.success('删除成功');
          fetchExamTypeList();
        } else {
          MessagePlugin.error(result.message || '删除失败');
        }
      });
    } catch (error) {
      console.error('删除考试形式出错:', error);
      MessagePlugin.error('删除失败');
    }
  }
};

// 确认添加/编辑
const handleConfirm = async () => {
  try {
    const url = isEdit.value ? '/api/course/exam-type/update' : '/api/course/exam-type/add';
    const method = isEdit.value ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examTypeForm),
    });
    
    const result = await response.json();
    
    if (result.code === 0) {
      MessagePlugin.success(isEdit.value ? '编辑成功' : '添加成功');
      dialogVisible.value = false;
      fetchExamTypeList();
    } else {
      MessagePlugin.error(result.message || (isEdit.value ? '编辑失败' : '添加失败'));
    }
  } catch (error) {
    console.error(isEdit.value ? '编辑考试形式出错:' : '添加考试形式出错:', error);
    MessagePlugin.error(isEdit.value ? '编辑失败' : '添加失败');
  }
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  fetchExamTypeList();
};

// 重置
const handleReset = () => {
  formData.name = '';
  formData.code = '';
  formData.status = null;
  pagination.current = 1;
  fetchExamTypeList();
};

// 同步教务系统
const handleSync = async () => {
  try {
    loading.value = true;
    
    const response = await fetch('/api/course/exam-type/sync', {
      method: 'POST',
    });
    
    const result = await response.json();
    
    if (result.code === 0) {
      syncResult.value = result.data;
      syncResultVisible.value = true;
      fetchExamTypeList();
    } else {
      MessagePlugin.error(result.message || '同步失败');
    }
  } catch (error) {
    console.error('同步考试形式出错:', error);
    MessagePlugin.error('同步失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="less" scoped>
.exam-type-container {
  padding: 16px;

  .t-card {
    margin-bottom: 16px;
  }
}
</style> 