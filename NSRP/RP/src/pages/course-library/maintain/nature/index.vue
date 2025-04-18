<template>
  <div class="course-nature-container">
    <t-card title="课程性质管理" subtitle="管理课程性质数据" header-bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleAdd">新增课程性质</t-button>
          <t-button theme="default" @click="handleSync">教务系统同步</t-button>
        </t-space>
      </template>
      
      <t-form ref="form" :data="formData" :style="{ marginBottom: '20px' }">
        <t-row :gutter="[16, 16]">
          <t-col :span="6">
            <t-form-item label="性质名称">
              <t-input v-model="formData.name" placeholder="请输入性质名称" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="性质代码">
              <t-input v-model="formData.code" placeholder="请输入性质代码" />
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
        :data="natureList"
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
      :header="isEdit ? '编辑课程性质' : '新增课程性质'"
      :on-close="() => (dialogVisible = false)"
      :on-confirm="handleConfirm"
      :confirm-btn="{ content: '确定', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      width="500"
    >
      <t-form
        ref="natureForm"
        :data="natureForm"
        :rules="rules"
        label-width="100px"
        @submit="handleConfirm"
      >
        <t-form-item label="性质名称" name="name">
          <t-input v-model="natureForm.name" placeholder="请输入性质名称" />
        </t-form-item>
        <t-form-item label="性质代码" name="code">
          <t-input v-model="natureForm.code" placeholder="请输入性质代码（如：BX、XX）" />
        </t-form-item>
        <t-form-item label="排序" name="sort">
          <t-input-number v-model="natureForm.sort" :min="1" placeholder="数字越小越靠前" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group v-model="natureForm.status">
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
import type { PrimaryTableCol, PageInfo } from 'tdesign-vue-next';

interface NatureItem {
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
const columns: PrimaryTableCol<NatureItem>[] = [
  { colKey: 'code', title: '性质代码', width: 120 },
  { colKey: 'name', title: '性质名称', width: 180 },
  { colKey: 'sort', title: '排序', width: 80 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'createTime', title: '创建时间', width: 180 },
  { colKey: 'updateTime', title: '更新时间', width: 180 },
  { colKey: 'operation', title: '操作', width: 180, fixed: 'right' },
];

// 表格数据和加载状态
const natureList = ref<NatureItem[]>([]);
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
const natureForm = reactive({
  id: 0,
  name: '',
  code: '',
  sort: 1,
  status: 1,
});

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入性质名称', type: 'error' }],
  code: [
    { required: true, message: '请输入性质代码', type: 'error' },
    { validator: (val: string) => /^[A-Z]{2}$/.test(val), message: '性质代码必须为2个大写字母', type: 'error' }
  ],
  sort: [{ required: true, message: '请输入排序', type: 'error' }],
};

// 同步结果
const syncResultVisible = ref(false);
const syncResult = ref<SyncResult | null>(null);

// 页面挂载时获取数据
onMounted(() => {
  fetchNatureList();
});

// 获取课程性质列表数据
const fetchNatureList = async () => {
  loading.value = true;
  try {
    const { pageSize, current: pageIndex } = pagination;
    const params = {
      pageSize,
      pageIndex,
      name: formData.name,
      code: formData.code,
      status: formData.status !== null ? formData.status.toString() : '',
    };
    
    const response = await fetch(`/api/course/nature/list?${new URLSearchParams(params as Record<string, string>)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (result.code === 0) {
      natureList.value = result.data.list;
      pagination.total = result.data.total;
    } else {
      MessagePlugin.error(result.message || '获取课程性质列表失败');
    }
  } catch (error) {
    console.error('获取课程性质列表出错:', error);
    MessagePlugin.error('获取课程性质列表失败');
  } finally {
    loading.value = false;
  }
};

// 分页变化
const onPageChange = (pageInfo: { current: number, pageSize: number }) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchNatureList();
};

// 新增课程性质
const handleAdd = () => {
  isEdit.value = false;
  natureForm.id = 0;
  natureForm.name = '';
  natureForm.code = '';
  natureForm.sort = natureList.value.length + 1;
  natureForm.status = 1;
  dialogVisible.value = true;
};

// 编辑课程性质
const handleEdit = (row: NatureItem) => {
  isEdit.value = true;
  natureForm.id = row.id;
  natureForm.name = row.name;
  natureForm.code = row.code;
  natureForm.sort = row.sort;
  natureForm.status = row.status;
  dialogVisible.value = true;
};

// 切换课程性质状态
const handleToggleStatus = async (row: NatureItem) => {
  const newStatus = row.status === 1 ? 0 : 1;
  const statusText = newStatus === 1 ? '启用' : '禁用';
  
  MessagePlugin.confirm({
    header: `确认${statusText}`,
    body: `确定要${statusText}课程性质"${row.name}"吗？`,
    confirmBtn: {
      content: '确定',
      theme: 'primary',
    },
    onConfirm: async () => {
      try {
        const response = await fetch('/api/course/nature/update', {
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
          fetchNatureList();
        } else {
          MessagePlugin.error(result.message || `${statusText}失败`);
        }
      } catch (error) {
        console.error(`${statusText}课程性质出错:`, error);
        MessagePlugin.error(`${statusText}失败`);
      }
    },
  });
};

// 删除课程性质
const handleDelete = (id: number) => {
  MessagePlugin.confirm({
    header: '确认删除',
    body: '确定要删除该课程性质吗？此操作不可恢复。',
    confirmBtn: {
      content: '删除',
      theme: 'danger',
    },
    onConfirm: async () => {
      try {
        const response = await fetch(`/api/course/nature/delete/${id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.code === 0) {
          MessagePlugin.success('删除成功');
          fetchNatureList();
        } else {
          MessagePlugin.error(result.message || '删除失败');
        }
      } catch (error) {
        console.error('删除课程性质出错:', error);
        MessagePlugin.error('删除失败');
      }
    },
  });
};

// 确认添加/编辑
const handleConfirm = async () => {
  try {
    const url = isEdit.value ? '/api/course/nature/update' : '/api/course/nature/add';
    const method = isEdit.value ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(natureForm),
    });
    
    const result = await response.json();
    
    if (result.code === 0) {
      MessagePlugin.success(isEdit.value ? '编辑成功' : '添加成功');
      dialogVisible.value = false;
      fetchNatureList();
    } else {
      MessagePlugin.error(result.message || (isEdit.value ? '编辑失败' : '添加失败'));
    }
  } catch (error) {
    console.error(isEdit.value ? '编辑课程性质出错:' : '添加课程性质出错:', error);
    MessagePlugin.error(isEdit.value ? '编辑失败' : '添加失败');
  }
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  fetchNatureList();
};

// 重置
const handleReset = () => {
  formData.name = '';
  formData.code = '';
  formData.status = null;
  pagination.current = 1;
  fetchNatureList();
};

// 同步教务系统
const handleSync = async () => {
  try {
    loading.value = true;
    
    const response = await fetch('/api/course/nature/sync', {
      method: 'POST',
    });
    
    const result = await response.json();
    
    if (result.code === 0) {
      syncResult.value = result.data;
      syncResultVisible.value = true;
      fetchNatureList();
    } else {
      MessagePlugin.error(result.message || '同步失败');
    }
  } catch (error) {
    console.error('同步课程性质出错:', error);
    MessagePlugin.error('同步失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="less" scoped>
.course-nature-container {
  padding: 16px;

  .t-card {
    margin-bottom: 16px;
  }
}
</style> 