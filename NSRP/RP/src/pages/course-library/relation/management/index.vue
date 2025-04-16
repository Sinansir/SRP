<template>
  <div class="course-relation-management-container">
    <t-card title="课程关联管理" subtitle="维护课程之间的关联关系" header-bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="openAddRelationDialog">
            <template #icon>
              <add-icon />
            </template>
            新建关联
          </t-button>
          <t-button theme="default" @click="handleExport">
            <template #icon>
              <download-icon />
            </template>
            导出
          </t-button>
          <t-button theme="default" @click="handleRefresh">
            <template #icon>
              <refresh-icon />
            </template>
            刷新
          </t-button>
        </t-space>
      </template>
      
      <t-space direction="vertical" size="large" style="width: 100%">
        <!-- 搜索表单 -->
        <t-form ref="form" :data="searchFormData" :style="{ marginBottom: '16px' }">
          <t-row :gutter="[16, 16]">
            <t-col :span="6">
              <t-form-item label="源课程">
                <t-select
                  v-model="searchFormData.sourceCourseId"
                  placeholder="请选择源课程"
                  :loading="courseLoading"
                  filterable
                  clearable
                  @change="handleRealTimeSearch"
                >
                  <t-option v-for="item in courseOptions" :key="item.id" :label="`${item.name} (${item.code})`" :value="item.id" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="目标课程">
                <t-select
                  v-model="searchFormData.targetCourseId"
                  placeholder="请选择目标课程"
                  :loading="courseLoading"
                  filterable
                  clearable
                  @change="handleRealTimeSearch"
                >
                  <t-option v-for="item in courseOptions" :key="item.id" :label="`${item.name} (${item.code})`" :value="item.id" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="关系类型">
                <t-select v-model="searchFormData.relationType" placeholder="请选择关系类型" clearable @change="handleRealTimeSearch">
                  <t-option v-for="item in relationTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="状态">
                <t-select v-model="searchFormData.status" placeholder="请选择状态" clearable @change="handleRealTimeSearch">
                  <t-option key="active" label="有效" value="active" />
                  <t-option key="inactive" label="无效" value="inactive" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="24">
              <t-form-item>
                <t-space>
                  <t-button theme="default" @click="handleResetSearch">重置</t-button>
                </t-space>
              </t-form-item>
            </t-col>
          </t-row>
        </t-form>
      
        <!-- 课程关联列表 -->
        <t-table
          row-key="id"
          :data="relationList"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @page-change="onPageChange"
          hover
          stripe
        >
          <template #relationType="{ row }">
            <t-tag v-if="row.relationType" :theme="getRelationTypeTheme(row.relationType)" variant="light">
              {{ getRelationTypeName(row.relationType) }}
            </t-tag>
            <span v-else>-</span>
          </template>
          <template #status="{ row }">
            <t-tag v-if="row.status === 'active'" theme="success" variant="light">有效</t-tag>
            <t-tag v-else theme="warning" variant="light">无效</t-tag>
          </template>
          <template #operation="{ row }">
            <t-space>
              <t-button theme="primary" variant="text" size="small" @click="handleEdit(row)">编辑</t-button>
              <t-button theme="danger" variant="text" size="small" @click="handleDelete(row)">删除</t-button>
            </t-space>
          </template>
        </t-table>
      </t-space>
    </t-card>

    <!-- 新建/编辑关联对话框 -->
    <t-dialog
      v-model:visible="dialogVisible"
      :header="isEdit ? '编辑课程关联' : '新建课程关联'"
      width="680px"
      :confirm-btn="{ content: '确定', theme: 'primary' }"
      :cancel-btn="{ content: '取消', theme: 'default' }"
      @confirm="handleConfirm"
    >
      <t-form ref="form" :data="formData" :rules="rules" label-width="120px" @submit="handleConfirm">
        <t-form-item label="源课程" name="sourceCourseId">
          <t-select
            v-model="formData.sourceCourseId"
            placeholder="请选择源课程"
            :loading="courseLoading"
            filterable
            clearable
          >
            <t-option v-for="item in courseOptions" :key="item.id" :label="`${item.name} (${item.code})`" :value="item.id" />
          </t-select>
        </t-form-item>

        <t-form-item label="关系类型" name="relationType">
          <t-select v-model="formData.relationType" placeholder="请选择关系类型">
            <t-option v-for="item in relationTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </t-select>
        </t-form-item>

        <t-form-item label="目标课程" name="targetCourseId">
          <t-select
            v-model="formData.targetCourseId"
            placeholder="请选择目标课程"
            :loading="courseLoading"
            filterable
            clearable
          >
            <t-option v-for="item in courseOptions" :key="item.id" :label="`${item.name} (${item.code})`" :value="item.id" />
          </t-select>
        </t-form-item>

        <t-form-item label="关联强度" name="relationStrength">
          <t-slider v-model="formData.relationStrength" :marks="{ 0: '弱', 50: '中', 100: '强' }" :step="1" />
        </t-form-item>

        <t-form-item label="关系描述" name="description">
          <t-textarea
            v-model="formData.description"
            placeholder="请输入关系描述"
            :maxlength="200"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </t-form-item>

        <t-form-item label="状态" name="status">
          <t-radio-group v-model="formData.status">
            <t-radio value="active">有效</t-radio>
            <t-radio value="inactive">无效</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { AddIcon, RefreshIcon, DownloadIcon } from 'tdesign-icons-vue-next';
import { fetchCourseRelationList, addCourseRelation, updateCourseRelation, deleteCourseRelation, fetchCourseOptions } from '@/api/course-library/relation';
import { debounce } from 'lodash';

interface CourseOption {
  id: string | number;
  code: string;
  name: string;
}

interface RelationItem {
  id: string | number;
  sourceCourseId: string | number;
  sourceCourseName: string;
  sourceCourseCode: string;
  targetCourseId: string | number;
  targetCourseName: string;
  targetCourseCode: string;
  relationType: string;
  relationStrength: number;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

// 搜索表单数据
const searchFormData = reactive({
  sourceCourseId: '',
  targetCourseId: '',
  relationType: '',
  status: '',
});

// 对话框状态
const dialogVisible = ref(false);
const isEdit = ref(false);

// 表单数据
const formData = reactive({
  id: '',
  sourceCourseId: '',
  targetCourseId: '',
  relationType: '',
  relationStrength: 50,
  description: '',
  status: 'active',
});

// 表单规则
const rules = {
  sourceCourseId: [{ required: true, message: '请选择源课程', type: 'error' }],
  targetCourseId: [{ required: true, message: '请选择目标课程', type: 'error' }],
  relationType: [{ required: true, message: '请选择关系类型', type: 'error' }],
};

// 关系类型选项
const relationTypeOptions = ref([
  { label: '先修课程', value: 'prerequisite' },
  { label: '后续课程', value: 'subsequent' },
  { label: '并行课程', value: 'parallel' },
  { label: '替代课程', value: 'alternative' },
]);

// 获取关系类型名称
const getRelationTypeName = (value: string) => {
  const item = relationTypeOptions.value.find((item) => item.value === value);
  return item ? item.label : value;
};

// 获取关系类型标签主题
const getRelationTypeTheme = (value: string) => {
  const themes = {
    prerequisite: 'primary',
    subsequent: 'success',
    parallel: 'warning',
    alternative: 'danger'
  };
  return themes[value as keyof typeof themes] || 'default';
};

// 表格列定义
const columns = [
  { colKey: 'sourceCourseCode', title: '源课程代码', width: 120 },
  { colKey: 'sourceCourseName', title: '源课程名称', width: 180 },
  { colKey: 'relationType', title: '关系类型', width: 120 },
  { colKey: 'targetCourseCode', title: '目标课程代码', width: 120 },
  { colKey: 'targetCourseName', title: '目标课程名称', width: 180 },
  { colKey: 'relationStrength', title: '关联强度', width: 100 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'updateTime', title: '更新时间', width: 160 },
  { colKey: 'operation', title: '操作', width: 160, fixed: 'right' },
];

// 表格数据和加载状态
const relationList = ref<RelationItem[]>([]);
const courseOptions = ref<CourseOption[]>([]);
const loading = ref(false);
const courseLoading = ref(false);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50],
});

// 页面挂载时获取数据
onMounted(() => {
  fetchRelationList();
  fetchCourses();
});

// 实时搜索处理函数
const handleRealTimeSearch = debounce(() => {
  pagination.current = 1;
  fetchRelationList();
}, 300);

// 获取课程关联列表
const fetchRelationList = async () => {
  loading.value = true;
  try {
    const params = {
      pageSize: pagination.pageSize,
      current: pagination.current,
      ...searchFormData,
    };
    
    const { list, total } = await fetchCourseRelationList(params);
    relationList.value = list.map((item: any) => ({
      ...item,
      relationType: item.relationType || '',
    }));
    pagination.total = total;
  } catch (error) {
    console.error('获取课程关联列表出错:', error);
    MessagePlugin.error('获取课程关联列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取课程选项
const fetchCourses = async () => {
  courseLoading.value = true;
  try {
    const { list } = await fetchCourseOptions();
    courseOptions.value = list;
  } catch (error) {
    console.error('获取课程选项出错:', error);
    MessagePlugin.error('获取课程选项失败');
  } finally {
    courseLoading.value = false;
  }
};

// 分页变化
const onPageChange = (pageInfo: any) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchRelationList();
};

// 重置搜索
const handleResetSearch = () => {
  Object.keys(searchFormData).forEach(key => {
    searchFormData[key as keyof typeof searchFormData] = '';
  });
  pagination.current = 1;
  fetchRelationList();
};

// 导出功能
const handleExport = () => {
  MessagePlugin.info('正在导出数据...');
  
  const exportParams = {
    ...searchFormData,
    pageSize: pagination.total,
    current: 1,
  };
  
  fetch('/api/course/relation/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exportParams),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 0) {
        MessagePlugin.success('导出成功');
        // 在实际情况下，这里应该处理文件下载
      } else {
        MessagePlugin.error(data.message || '导出失败');
      }
    });
};

// 打开新建关联对话框
const openAddRelationDialog = () => {
  isEdit.value = false;
  Object.assign(formData, {
    id: '',
    sourceCourseId: '',
    targetCourseId: '',
    relationType: '',
    relationStrength: 50,
    description: '',
    status: 'active',
  });
  dialogVisible.value = true;
};

// 处理编辑操作
const handleEdit = (row: RelationItem) => {
  isEdit.value = true;
  Object.assign(formData, {
    id: row.id,
    sourceCourseId: row.sourceCourseId,
    targetCourseId: row.targetCourseId,
    relationType: row.relationType,
    relationStrength: row.relationStrength,
    description: row.description,
    status: row.status,
  });
  dialogVisible.value = true;
};

// 处理删除操作
const handleDelete = (row: RelationItem) => {
  MessagePlugin.dialog({
    header: '确认删除',
    body: `确定要删除"${row.sourceCourseName} - ${row.targetCourseName}"的关联关系吗？`,
    confirmBtn: {
      theme: 'danger',
      content: '删除',
    },
    cancelBtn: '取消',
    onConfirm: async () => {
      try {
        await deleteCourseRelation(row.id);
        MessagePlugin.success('删除成功');
        fetchRelationList();
      } catch (error) {
        console.error('删除课程关联出错:', error);
        MessagePlugin.error('删除失败');
      }
    },
  });
};

// 处理确认操作
const handleConfirm = async () => {
  // 表单验证
  // 这里需要使用模板引用，但在此处简化处理
  if (!formData.sourceCourseId || !formData.targetCourseId || !formData.relationType) {
    MessagePlugin.error('请填写必填项');
    return;
  }

  // 源课程和目标课程不能相同
  if (formData.sourceCourseId === formData.targetCourseId) {
    MessagePlugin.error('源课程和目标课程不能相同');
    return;
  }

  try {
    if (isEdit.value) {
      await updateCourseRelation(formData);
      MessagePlugin.success('更新成功');
    } else {
      await addCourseRelation(formData);
      MessagePlugin.success('创建成功');
    }
    dialogVisible.value = false;
    fetchRelationList();
  } catch (error) {
    console.error('保存课程关联出错:', error);
    MessagePlugin.error('保存失败');
  }
};

// 刷新列表
const handleRefresh = () => {
  fetchRelationList();
};
</script>

<style lang="less" scoped>
.course-relation-management-container {
  padding: 16px;
}
</style> 