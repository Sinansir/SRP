<template>
  <div class="college-info-container">
    <t-card title="学院信息管理" bordered>
      <template #actions>
        <t-button theme="primary" @click="handleAddCollege">新增学院</t-button>
      </template>
      
      <div class="search-bar">
        <t-input
          v-model="searchKey"
          placeholder="输入学院名称或代码搜索"
          clearable
          @clear="handleSearch"
          style="width: 300px"
        >
          <template #suffix>
            <t-icon name="search" @click="handleSearch" />
          </template>
        </t-input>
      </div>
      
      <t-table
        :data="collegeList"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        stripe
        row-key="id"
      >
        <template #status="{ row }">
          <t-tag :theme="row.status ? 'success' : 'warning'">
            {{ row.status ? '正常' : '停用' }}
          </t-tag>
        </template>
        <template #operation="{ row }">
          <t-space>
            <t-button theme="primary" variant="text" @click="handleEditCollege(row)">编辑</t-button>
            <t-button theme="danger" variant="text" @click="handleDeleteCollege(row)">删除</t-button>
          </t-space>
        </template>
      </t-table>
    </t-card>
    
    <!-- 学院信息编辑对话框 -->
    <t-dialog
      v-model:visible="collegeDialog.visible"
      :header="collegeDialog.isEdit ? '编辑学院信息' : '新增学院信息'"
      :confirm-btn="{ content: '确认', loading: collegeDialog.loading }"
      @confirm="handleConfirmCollege"
    >
      <t-form :data="collegeDialog.formData" ref="collegeForm" :rules="collegeFormRules" label-width="120px">
        <t-form-item label="学院代码" name="code">
          <t-input v-model="collegeDialog.formData.code" placeholder="请输入学院代码" />
        </t-form-item>
        <t-form-item label="学院名称" name="name">
          <t-input v-model="collegeDialog.formData.name" placeholder="请输入学院名称" />
        </t-form-item>
        <t-form-item label="英文名称" name="enName">
          <t-input v-model="collegeDialog.formData.enName" placeholder="请输入英文名称" />
        </t-form-item>
        <t-form-item label="学院简称" name="shortName">
          <t-input v-model="collegeDialog.formData.shortName" placeholder="请输入学院简称" />
        </t-form-item>
        <t-form-item label="联系电话" name="phone">
          <t-input v-model="collegeDialog.formData.phone" placeholder="请输入联系电话" />
        </t-form-item>
        <t-form-item label="邮箱" name="email">
          <t-input v-model="collegeDialog.formData.email" placeholder="请输入邮箱" />
        </t-form-item>
        <t-form-item label="成立时间" name="foundTime">
          <t-date-picker v-model="collegeDialog.formData.foundTime" placeholder="请选择成立时间" format="YYYY-MM-DD" />
        </t-form-item>
        <t-form-item label="排序号" name="sort">
          <t-input-number v-model="collegeDialog.formData.sort" min="0" />
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="collegeDialog.formData.remark"
            placeholder="请输入备注"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </t-form-item>
        <t-form-item label="状态">
          <t-switch v-model="collegeDialog.formData.status" />
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
      <p>确定要删除学院"{{ deleteDialog.collegeName }}"吗？删除后不可恢复。</p>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import type { PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

interface College {
  id: string;
  code: string;
  name: string;
  enName: string;
  shortName: string;
  phone: string;
  email: string;
  foundTime: string;
  sort: number;
  status: boolean;
  remark: string;
  createTime: string;
  updateTime: string;
}

interface CollegeFormData {
  id?: string;
  code: string;
  name: string;
  enName: string;
  shortName: string;
  phone: string;
  email: string;
  foundTime: string;
  sort: number;
  status: boolean;
  remark: string;
}

// 搜索关键字
const searchKey = ref('');

// 表单引用
const collegeForm = ref();

// 加载状态
const loading = ref(false);

// 表格列配置
const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'code', title: '学院代码', width: 120 },
  { colKey: 'name', title: '学院名称', width: 160 },
  { colKey: 'shortName', title: '简称', width: 100 },
  { colKey: 'phone', title: '联系电话', width: 140 },
  { colKey: 'email', title: '邮箱', width: 180 },
  { colKey: 'foundTime', title: '成立时间', width: 120 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'updateTime', title: '更新时间', width: 160 },
  { colKey: 'operation', title: '操作', width: 120, fixed: 'right' as const },
];

// 表格数据
const collegeList = ref<College[]>([]);
const allCollegeList = ref<College[]>([]);

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
    updateDisplayList();
  },
});

// 学院信息对话框
const collegeDialog = reactive({
  visible: false,
  isEdit: false,
  loading: false,
  formData: {
    code: '',
    name: '',
    enName: '',
    shortName: '',
    phone: '',
    email: '',
    foundTime: '',
    sort: 0,
    status: true,
    remark: '',
  } as CollegeFormData,
});

// 学院表单校验规则
const collegeFormRules = {
  code: [{ required: true, message: '请输入学院代码', type: 'error' as const }],
  name: [{ required: true, message: '请输入学院名称', type: 'error' as const }],
  phone: [
    { required: true, message: '请输入联系电话', type: 'error' as const },
    { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/, message: '请输入正确的电话格式', type: 'error' as const },
  ],
  email: [
    { required: true, message: '请输入邮箱', type: 'error' as const },
    { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, message: '请输入正确的邮箱格式', type: 'error' as const },
  ],
};

// 删除对话框
const deleteDialog = reactive({
  visible: false,
  loading: false,
  collegeId: '',
  collegeName: '',
});

// 获取学院列表
const fetchCollegeList = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    
    // 模拟数据
    const mockData: College[] = [
      {
        id: '1',
        code: 'CS',
        name: '计算机科学与工程学院',
        enName: 'College of Computer Science and Engineering',
        shortName: '计算机学院',
        phone: '010-12345678',
        email: 'cs@example.edu.cn',
        foundTime: '1985-09-01',
        sort: 1,
        status: true,
        remark: '负责计算机科学与技术、软件工程、网络工程等专业的教学与管理',
        createTime: '2023-01-15 08:30:00',
        updateTime: '2023-03-20 14:22:30',
      },
      {
        id: '2',
        code: 'EE',
        name: '电子工程学院',
        enName: 'College of Electronic Engineering',
        shortName: '电子学院',
        phone: '010-12345679',
        email: 'ee@example.edu.cn',
        foundTime: '1978-09-01',
        sort: 2,
        status: true,
        remark: '负责电子信息工程、通信工程、电子科学与技术等专业的教学与管理',
        createTime: '2023-01-16 10:20:00',
        updateTime: '2023-02-28 11:30:45',
      },
      {
        id: '3',
        code: 'MA',
        name: '数学与统计学院',
        enName: 'College of Mathematics and Statistics',
        shortName: '数统学院',
        phone: '010-12345680',
        email: 'math@example.edu.cn',
        foundTime: '1952-09-01',
        sort: 3,
        status: true,
        remark: '负责数学与应用数学、统计学、数据科学与大数据技术等专业的教学与管理',
        createTime: '2023-01-18 13:45:00',
        updateTime: '2023-03-15 16:42:10',
      },
      {
        id: '4',
        code: 'ME',
        name: '机械工程学院',
        enName: 'College of Mechanical Engineering',
        shortName: '机械学院',
        phone: '010-12345681',
        email: 'me@example.edu.cn',
        foundTime: '1955-09-01',
        sort: 4,
        status: true,
        remark: '负责机械设计制造及其自动化、机械电子工程等专业的教学与管理',
        createTime: '2023-02-01 09:20:00',
        updateTime: '2023-03-10 09:15:25',
      },
      {
        id: '5',
        code: 'FL',
        name: '外国语学院',
        enName: 'College of Foreign Languages',
        shortName: '外语学院',
        phone: '010-12345682',
        email: 'fl@example.edu.cn',
        foundTime: '1960-09-01',
        sort: 5,
        status: true,
        remark: '负责英语、日语、俄语等专业的教学与管理',
        createTime: '2023-02-05 11:30:00',
        updateTime: '2023-03-05 10:20:15',
      },
    ];

    allCollegeList.value = mockData;
    updateDisplayList();
  } catch (error) {
    MessagePlugin.error('获取学院信息列表失败');
    console.error('获取学院信息列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 更新显示的列表数据（分页和搜索）
const updateDisplayList = () => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  
  // 根据搜索关键字过滤
  let filteredList = allCollegeList.value;
  if (searchKey.value) {
    const keyword = searchKey.value.toLowerCase();
    filteredList = allCollegeList.value.filter(
      item => item.name.toLowerCase().includes(keyword) || 
             item.code.toLowerCase().includes(keyword) ||
             item.shortName.toLowerCase().includes(keyword)
    );
  }
  
  // 更新分页数据
  collegeList.value = filteredList.slice(start, end);
  pagination.total = filteredList.length;
};

// 处理搜索
const handleSearch = () => {
  pagination.current = 1;
  updateDisplayList();
};

// 处理新增学院
const handleAddCollege = () => {
  collegeDialog.isEdit = false;
  collegeDialog.formData = {
    code: '',
    name: '',
    enName: '',
    shortName: '',
    phone: '',
    email: '',
    foundTime: '',
    sort: allCollegeList.value.length + 1,
    status: true,
    remark: '',
  };
  collegeDialog.visible = true;
};

// 处理编辑学院
const handleEditCollege = (row: College) => {
  collegeDialog.isEdit = true;
  collegeDialog.formData = {
    id: row.id,
    code: row.code,
    name: row.name,
    enName: row.enName,
    shortName: row.shortName,
    phone: row.phone,
    email: row.email,
    foundTime: row.foundTime,
    sort: row.sort,
    status: row.status,
    remark: row.remark,
  };
  collegeDialog.visible = true;
};

// 处理确认学院表单
const handleConfirmCollege = async () => {
  const valid = await collegeForm.value?.validate();
  if (!valid) return;
  
  collegeDialog.loading = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
    
    // 处理数据更新
    const newCollege: College = {
      id: collegeDialog.isEdit ? collegeDialog.formData.id as string : `${Date.now()}`,
      ...collegeDialog.formData,
      createTime: collegeDialog.isEdit ? '' : new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    
    if (collegeDialog.isEdit) {
      // 更新现有学院
      const index = allCollegeList.value.findIndex(item => item.id === newCollege.id);
      if (index !== -1) {
        allCollegeList.value[index] = { ...allCollegeList.value[index], ...newCollege };
      }
      MessagePlugin.success('学院信息更新成功');
    } else {
      // 添加新学院
      allCollegeList.value.unshift(newCollege);
      MessagePlugin.success('学院信息添加成功');
    }
    
    collegeDialog.visible = false;
    updateDisplayList();
  } catch (error) {
    MessagePlugin.error('操作失败，请重试');
    console.error('学院操作失败:', error);
  } finally {
    collegeDialog.loading = false;
  }
};

// 处理删除学院
const handleDeleteCollege = (row: College) => {
  deleteDialog.collegeId = row.id;
  deleteDialog.collegeName = row.name;
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
    const index = allCollegeList.value.findIndex(item => item.id === deleteDialog.collegeId);
    if (index !== -1) {
      allCollegeList.value.splice(index, 1);
    }
    
    MessagePlugin.success('学院信息删除成功');
    deleteDialog.visible = false;
    updateDisplayList();
  } catch (error) {
    MessagePlugin.error('删除失败，请重试');
    console.error('删除学院失败:', error);
  } finally {
    deleteDialog.loading = false;
  }
};

// 初始化
onMounted(() => {
  fetchCollegeList();
});
</script>

<script lang="ts">
export default {
  name: 'CollegeInfo',
};
</script>

<style lang="less" scoped>
.college-info-container {
  .search-bar {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-start;
  }
  
  .t-card {
    margin-bottom: 16px;
  }
}
</style>