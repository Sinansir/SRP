<template>
  <div class="data-maintenance-container">
    <t-card title="基础数据维护" bordered>
      <template #actions>
        <t-button theme="primary" @click="handleAddData">新增数据</t-button>
      </template>
      
      <t-tabs v-model="activeTab">
        <t-tab-panel value="common" label="通用数据">
          <t-table
            :data="commonData"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            stripe
            row-key="id"
          >
            <template #operation="{ row }">
              <t-space>
                <t-button theme="primary" variant="text" @click="handleEditData(row)">编辑</t-button>
                <t-button theme="danger" variant="text" @click="handleDeleteData(row)">删除</t-button>
              </t-space>
            </template>
          </t-table>
        </t-tab-panel>
        
        <t-tab-panel value="academic" label="学术数据">
          <t-table
            :data="academicData"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            stripe
            row-key="id"
          >
            <template #operation="{ row }">
              <t-space>
                <t-button theme="primary" variant="text" @click="handleEditData(row)">编辑</t-button>
                <t-button theme="danger" variant="text" @click="handleDeleteData(row)">删除</t-button>
              </t-space>
            </template>
          </t-table>
        </t-tab-panel>
        
        <t-tab-panel value="system" label="系统数据">
          <t-table
            :data="systemData"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            stripe
            row-key="id"
          >
            <template #operation="{ row }">
              <t-space>
                <t-button theme="primary" variant="text" @click="handleEditData(row)">编辑</t-button>
                <t-button theme="danger" variant="text" @click="handleDeleteData(row)">删除</t-button>
              </t-space>
            </template>
          </t-table>
        </t-tab-panel>
      </t-tabs>
    </t-card>
    
    <!-- 数据编辑对话框 -->
    <t-dialog
      v-model:visible="dataDialog.visible"
      :header="dataDialog.isEdit ? '编辑基础数据' : '新增基础数据'"
      :confirm-btn="{ content: '确认', loading: dataDialog.loading }"
      @confirm="handleConfirmData"
    >
      <t-form :data="dataDialog.formData" ref="dataForm" :rules="dataFormRules" label-width="120px">
        <t-form-item label="数据类型" name="type">
          <t-select v-model="dataDialog.formData.type" placeholder="请选择数据类型">
            <t-option key="common" value="common" label="通用数据" />
            <t-option key="academic" value="academic" label="学术数据" />
            <t-option key="system" value="system" label="系统数据" />
          </t-select>
        </t-form-item>
        <t-form-item label="数据编码" name="code">
          <t-input v-model="dataDialog.formData.code" placeholder="请输入数据编码" />
        </t-form-item>
        <t-form-item label="数据名称" name="name">
          <t-input v-model="dataDialog.formData.name" placeholder="请输入数据名称" />
        </t-form-item>
        <t-form-item label="数据值" name="value">
          <t-input v-model="dataDialog.formData.value" placeholder="请输入数据值" />
        </t-form-item>
        <t-form-item label="排序" name="sort">
          <t-input-number v-model="dataDialog.formData.sort" min="0" />
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="dataDialog.formData.remark"
            placeholder="请输入备注"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </t-form-item>
        <t-form-item label="是否启用">
          <t-switch v-model="dataDialog.formData.isActive" />
        </t-form-item>
      </t-form>
    </t-dialog>
    
    <!-- 删除确认对话框 -->
    <t-dialog
      v-model:visible="deleteDialog.visible"
      header="删除确认"
      :confirm-btn="{ content: '确认', theme: 'danger', loading: deleteDialog.loading }"
      @confirm="confirmDelete"
    >
      <p>确定要删除基础数据"{{ deleteDialog.dataName }}"吗？删除后不可恢复。</p>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import type { PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

interface BaseData {
  id: string;
  type: string;
  code: string;
  name: string;
  value: string;
  sort: number;
  remark: string;
  isActive: boolean;
  createTime: string;
  updateTime: string;
}

interface BaseDataFormData {
  id?: string;
  type: string;
  code: string;
  name: string;
  value: string;
  sort: number;
  remark: string;
  isActive: boolean;
}

// 当前活动的标签页
const activeTab = ref<string>('common');

// 表单引用
const dataForm = ref();

// 加载状态
const loading = ref(false);

// 表格列配置
const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'code', title: '数据编码', width: 120 },
  { colKey: 'name', title: '数据名称', width: 160 },
  { colKey: 'value', title: '数据值', width: 160 },
  { colKey: 'sort', title: '排序', width: 80 },
  { colKey: 'remark', title: '备注', width: 200 },
  { colKey: 'isActive', title: '状态', width: 100,
    cell: ({ row }) => {
      if (!row) return '';
      return (row as BaseData).isActive ? '启用' : '停用';
    }
  },
  { colKey: 'updateTime', title: '更新时间', width: 160 },
  { colKey: 'operation', title: '操作', width: 120, fixed: 'right' as const },
];

// 表格数据
const commonData = ref<BaseData[]>([]);
const academicData = ref<BaseData[]>([]);
const systemData = ref<BaseData[]>([]);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [5, 10, 20, 50],
  onChange: (pageInfo: PageInfo) => {
    pagination.current = pageInfo.current;
    pagination.pageSize = pageInfo.pageSize;
    fetchDataList();
  },
});

// 数据对话框
const dataDialog = reactive({
  visible: false,
  isEdit: false,
  loading: false,
  formData: {
    type: 'common',
    code: '',
    name: '',
    value: '',
    sort: 0,
    remark: '',
    isActive: true,
  } as BaseDataFormData,
});

// 数据表单校验规则
const dataFormRules = {
  type: [{ required: true, message: '请选择数据类型', type: 'error' as const }],
  code: [{ required: true, message: '请输入数据编码', type: 'error' as const }],
  name: [{ required: true, message: '请输入数据名称', type: 'error' as const }],
  value: [{ required: true, message: '请输入数据值', type: 'error' as const }],
};

// 删除对话框
const deleteDialog = reactive({
  visible: false,
  loading: false,
  dataId: '',
  dataName: '',
});

// 获取基础数据列表
const fetchDataList = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    
    // 模拟数据
    const mockCommonData: BaseData[] = [
      {
        id: '1',
        type: 'common',
        code: 'SEX',
        name: '性别',
        value: '{"male":"男","female":"女"}',
        sort: 1,
        remark: '用户性别选项',
        isActive: true,
        createTime: '2023-01-15 08:30:00',
        updateTime: '2023-03-20 14:22:30',
      },
      {
        id: '2',
        type: 'common',
        code: 'STATUS',
        name: '状态',
        value: '{"0":"禁用","1":"启用"}',
        sort: 2,
        remark: '通用状态选项',
        isActive: true,
        createTime: '2023-01-16 10:20:00',
        updateTime: '2023-02-28 11:30:45',
      },
    ];
    
    const mockAcademicData: BaseData[] = [
      {
        id: '3',
        type: 'academic',
        code: 'DEGREE',
        name: '学位',
        value: '{"bachelor":"学士","master":"硕士","doctor":"博士"}',
        sort: 1,
        remark: '学位类型',
        isActive: true,
        createTime: '2023-01-18 13:45:00',
        updateTime: '2023-03-15 16:42:10',
      },
    ];
    
    const mockSystemData: BaseData[] = [
      {
        id: '4',
        type: 'system',
        code: 'USER_TYPE',
        name: '用户类型',
        value: '{"admin":"管理员","teacher":"教师","student":"学生"}',
        sort: 1,
        remark: '系统用户类型',
        isActive: true,
        createTime: '2023-02-01 09:20:00',
        updateTime: '2023-03-10 09:15:25',
      },
      {
        id: '5',
        type: 'system',
        code: 'LOG_TYPE',
        name: '日志类型',
        value: '{"login":"登录日志","operation":"操作日志","error":"错误日志"}',
        sort: 2,
        remark: '系统日志类型',
        isActive: true,
        createTime: '2023-02-05 11:30:00',
        updateTime: '2023-03-05 10:20:15',
      },
    ];

    commonData.value = mockCommonData;
    academicData.value = mockAcademicData;
    systemData.value = mockSystemData;
    
    updatePaginationTotal();
  } catch (error) {
    MessagePlugin.error('获取基础数据列表失败');
    console.error('获取基础数据列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 更新分页器总数
const updatePaginationTotal = () => {
  switch (activeTab.value) {
    case 'common':
      pagination.total = commonData.value.length;
      break;
    case 'academic':
      pagination.total = academicData.value.length;
      break;
    case 'system':
      pagination.total = systemData.value.length;
      break;
    default:
      pagination.total = 0;
  }
};

// 处理新增数据
const handleAddData = () => {
  dataDialog.isEdit = false;
  dataDialog.formData = {
    type: activeTab.value,
    code: '',
    name: '',
    value: '',
    sort: 0,
    remark: '',
    isActive: true,
  };
  dataDialog.visible = true;
};

// 处理编辑数据
const handleEditData = (row: BaseData) => {
  dataDialog.isEdit = true;
  dataDialog.formData = {
    id: row.id,
    type: row.type,
    code: row.code,
    name: row.name,
    value: row.value,
    sort: row.sort,
    remark: row.remark,
    isActive: row.isActive,
  };
  dataDialog.visible = true;
};

// 处理确认数据表单
const handleConfirmData = async () => {
  const valid = await dataForm.value?.validate();
  if (!valid) return;
  
  dataDialog.loading = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
    
    // 处理数据更新
    const newData: BaseData = {
      id: dataDialog.isEdit ? dataDialog.formData.id as string : `${Date.now()}`,
      ...dataDialog.formData,
      createTime: dataDialog.isEdit ? '' : new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    
    // 更新对应数据列表
    if (dataDialog.isEdit) {
      updateDataInList(newData);
      MessagePlugin.success('基础数据更新成功');
    } else {
      addDataToList(newData);
      MessagePlugin.success('基础数据添加成功');
    }
    
    dataDialog.visible = false;
    updatePaginationTotal();
  } catch (error) {
    MessagePlugin.error('操作失败，请重试');
    console.error('数据操作失败:', error);
  } finally {
    dataDialog.loading = false;
  }
};

// 更新列表中的数据
const updateDataInList = (data: BaseData) => {
  let dataList: BaseData[] = [];
  
  switch (data.type) {
    case 'common':
      dataList = commonData.value;
      break;
    case 'academic':
      dataList = academicData.value;
      break;
    case 'system':
      dataList = systemData.value;
      break;
    default:
      return;
  }
  
  const index = dataList.findIndex(item => item.id === data.id);
  if (index !== -1) {
    dataList[index] = { ...data };
  }
};

// 添加数据到列表
const addDataToList = (data: BaseData) => {
  switch (data.type) {
    case 'common':
      commonData.value.unshift(data);
      break;
    case 'academic':
      academicData.value.unshift(data);
      break;
    case 'system':
      systemData.value.unshift(data);
      break;
  }
};

// 处理删除数据
const handleDeleteData = (row: BaseData) => {
  deleteDialog.dataId = row.id;
  deleteDialog.dataName = row.name;
  deleteDialog.visible = true;
};

// 确认删除
const confirmDelete = async () => {
  deleteDialog.loading = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
    
    // 从列表中移除
    removeDataFromList(deleteDialog.dataId);
    
    MessagePlugin.success('基础数据删除成功');
    deleteDialog.visible = false;
    updatePaginationTotal();
  } catch (error) {
    MessagePlugin.error('删除失败，请重试');
    console.error('删除数据失败:', error);
  } finally {
    deleteDialog.loading = false;
  }
};

// 从列表中移除数据
const removeDataFromList = (id: string) => {
  const removeFromList = (list: BaseData[]) => {
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
      return true;
    }
    return false;
  };
  
  // 尝试从各个列表中移除
  if (!removeFromList(commonData.value)) {
    if (!removeFromList(academicData.value)) {
      removeFromList(systemData.value);
    }
  }
};

// 监听标签页变化
watch(activeTab, () => {
  pagination.current = 1;
  updatePaginationTotal();
});

// 初始化
onMounted(() => {
  fetchDataList();
});
</script>

<script lang="ts">
import { watch } from 'vue';

export default {
  name: 'DataMaintenance',
};
</script>

<style lang="less" scoped>
.data-maintenance-container {
  .t-card {
    margin-bottom: 16px;
  }
  
  .t-tab-panel {
    padding: 16px 0;
  }
}
</style> 