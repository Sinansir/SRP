<template>
  <div class="major-info-container">
    <t-card title="专业信息管理" bordered>
      <template #actions>
        <t-button theme="primary" @click="handleAddMajor">新增专业</t-button>
      </template>
      
      <div class="search-bar">
        <t-input
          v-model="searchKey"
          placeholder="输入专业名称或代码搜索"
          clearable
          @clear="handleSearch"
          style="width: 300px"
        >
          <template #suffix>
            <t-icon name="search" @click="handleSearch" />
          </template>
        </t-input>
        
        <t-select
          v-model="collegeFilter"
          placeholder="选择所属学院"
          clearable
          @change="handleSearch"
          style="width: 200px; margin-left: 16px"
        >
          <t-option v-for="item in collegeList" :key="item.id" :value="item.id" :label="item.name" />
        </t-select>
      </div>
      
      <t-table
        :data="majorList"
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
        <template #collegeName="{ row }">
          {{ getCollegeName(row.collegeId) }}
        </template>
        <template #operation="{ row }">
          <t-space>
            <t-button theme="primary" variant="text" @click="handleEditMajor(row)">编辑</t-button>
            <t-button theme="danger" variant="text" @click="handleDeleteMajor(row)">删除</t-button>
          </t-space>
        </template>
      </t-table>
    </t-card>
    
    <!-- 专业信息编辑对话框 -->
    <t-dialog
      v-model:visible="majorDialog.visible"
      :header="majorDialog.isEdit ? '编辑专业信息' : '新增专业信息'"
      :confirm-btn="{ content: '确认', loading: majorDialog.loading }"
      @confirm="handleConfirmMajor"
    >
      <t-form :data="majorDialog.formData" ref="majorForm" :rules="majorFormRules" label-width="120px">
        <t-form-item label="所属学院" name="collegeId">
          <t-select v-model="majorDialog.formData.collegeId" placeholder="请选择所属学院">
            <t-option v-for="item in collegeList" :key="item.id" :value="item.id" :label="item.name" />
          </t-select>
        </t-form-item>
        <t-form-item label="专业代码" name="code">
          <t-input v-model="majorDialog.formData.code" placeholder="请输入专业代码" />
        </t-form-item>
        <t-form-item label="专业名称" name="name">
          <t-input v-model="majorDialog.formData.name" placeholder="请输入专业名称" />
        </t-form-item>
        <t-form-item label="英文名称" name="enName">
          <t-input v-model="majorDialog.formData.enName" placeholder="请输入英文名称" />
        </t-form-item>
        <t-form-item label="专业简称" name="shortName">
          <t-input v-model="majorDialog.formData.shortName" placeholder="请输入专业简称" />
        </t-form-item>
        <t-form-item label="学制" name="studyYears">
          <t-select v-model="majorDialog.formData.studyYears" placeholder="请选择学制">
            <t-option key="3" value="3" label="3年" />
            <t-option key="4" value="4" label="4年" />
            <t-option key="5" value="5" label="5年" />
          </t-select>
        </t-form-item>
        <t-form-item label="学位类型" name="degreeType">
          <t-select v-model="majorDialog.formData.degreeType" placeholder="请选择学位类型">
            <t-option key="science" value="science" label="理学" />
            <t-option key="engineering" value="engineering" label="工学" />
            <t-option key="literature" value="literature" label="文学" />
            <t-option key="economics" value="economics" label="经济学" />
            <t-option key="management" value="management" label="管理学" />
            <t-option key="law" value="law" label="法学" />
          </t-select>
        </t-form-item>
        <t-form-item label="成立时间" name="foundTime">
          <t-date-picker v-model="majorDialog.formData.foundTime" placeholder="请选择成立时间" format="YYYY-MM-DD" />
        </t-form-item>
        <t-form-item label="排序号" name="sort">
          <t-input-number v-model="majorDialog.formData.sort" min="0" />
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="majorDialog.formData.remark"
            placeholder="请输入备注"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </t-form-item>
        <t-form-item label="状态">
          <t-switch v-model="majorDialog.formData.status" />
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
      <p>确定要删除专业"{{ deleteDialog.majorName }}"吗？删除后不可恢复。</p>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import type { PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

interface College {
  id: string;
  name: string;
  code: string;
}

interface Major {
  id: string;
  code: string;
  name: string;
  enName: string;
  shortName: string;
  collegeId: string;
  studyYears: string;
  degreeType: string;
  foundTime: string;
  sort: number;
  status: boolean;
  remark: string;
  createTime: string;
  updateTime: string;
}

interface MajorFormData {
  id?: string;
  code: string;
  name: string;
  enName: string;
  shortName: string;
  collegeId: string;
  studyYears: string;
  degreeType: string;
  foundTime: string;
  sort: number;
  status: boolean;
  remark: string;
}

// 学位类型映射
const degreeTypeMap = {
  science: '理学',
  engineering: '工学',
  literature: '文学',
  economics: '经济学',
  management: '管理学',
  law: '法学',
};

// 搜索关键字
const searchKey = ref('');
// 学院筛选
const collegeFilter = ref('');

// 表单引用
const majorForm = ref();

// 加载状态
const loading = ref(false);

// 表格列配置
const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'code', title: '专业代码', width: 120 },
  { colKey: 'name', title: '专业名称', width: 160 },
  { colKey: 'shortName', title: '简称', width: 100 },
  { colKey: 'collegeName', title: '所属学院', width: 160 },
  { colKey: 'studyYears', title: '学制', width: 80,
    cell: ({ row }) => {
      if (!row) return '';
      return `${(row as Major).studyYears}年`;
    }
  },
  { colKey: 'degreeType', title: '学位类型', width: 100,
    cell: ({ row }) => {
      if (!row) return '';
      const type = (row as Major).degreeType;
      return degreeTypeMap[type as keyof typeof degreeTypeMap] || '';
    }
  },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'updateTime', title: '更新时间', width: 160 },
  { colKey: 'operation', title: '操作', width: 120, fixed: 'right' as const },
];

// 表格数据
const majorList = ref<Major[]>([]);
const allMajorList = ref<Major[]>([]);
const collegeList = ref<College[]>([]);

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

// 专业信息对话框
const majorDialog = reactive({
  visible: false,
  isEdit: false,
  loading: false,
  formData: {
    code: '',
    name: '',
    enName: '',
    shortName: '',
    collegeId: '',
    studyYears: '4',
    degreeType: '',
    foundTime: '',
    sort: 0,
    status: true,
    remark: '',
  } as MajorFormData,
});

// 专业表单校验规则
const majorFormRules = {
  collegeId: [{ required: true, message: '请选择所属学院', type: 'error' as const }],
  code: [{ required: true, message: '请输入专业代码', type: 'error' as const }],
  name: [{ required: true, message: '请输入专业名称', type: 'error' as const }],
  studyYears: [{ required: true, message: '请选择学制', type: 'error' as const }],
  degreeType: [{ required: true, message: '请选择学位类型', type: 'error' as const }],
};

// 删除对话框
const deleteDialog = reactive({
  visible: false,
  loading: false,
  majorId: '',
  majorName: '',
});

// 获取学院名称
const getCollegeName = (collegeId: string) => {
  const college = collegeList.value.find(item => item.id === collegeId);
  return college ? college.name : '';
};

// 获取专业列表
const fetchMajorList = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    
    // 模拟学院数据
    const mockCollegeData: College[] = [
      { id: '1', code: 'CS', name: '计算机科学与工程学院' },
      { id: '2', code: 'EE', name: '电子工程学院' },
      { id: '3', code: 'MA', name: '数学与统计学院' },
      { id: '4', code: 'ME', name: '机械工程学院' },
      { id: '5', code: 'FL', name: '外国语学院' },
    ];
    
    // 模拟专业数据
    const mockMajorData: Major[] = [
      {
        id: '1',
        code: '080901',
        name: '计算机科学与技术',
        enName: 'Computer Science and Technology',
        shortName: '计科',
        collegeId: '1',
        studyYears: '4',
        degreeType: 'engineering',
        foundTime: '1985-09-01',
        sort: 1,
        status: true,
        remark: '计算机领域核心专业',
        createTime: '2023-01-15 08:30:00',
        updateTime: '2023-03-20 14:22:30',
      },
      {
        id: '2',
        code: '080902',
        name: '软件工程',
        enName: 'Software Engineering',
        shortName: '软工',
        collegeId: '1',
        studyYears: '4',
        degreeType: 'engineering',
        foundTime: '1998-09-01',
        sort: 2,
        status: true,
        remark: '软件开发与工程管理专业',
        createTime: '2023-01-16 10:20:00',
        updateTime: '2023-02-28 11:30:45',
      },
      {
        id: '3',
        code: '080903',
        name: '网络工程',
        enName: 'Network Engineering',
        shortName: '网工',
        collegeId: '1',
        studyYears: '4',
        degreeType: 'engineering',
        foundTime: '2002-09-01',
        sort: 3,
        status: true,
        remark: '计算机网络技术专业',
        createTime: '2023-01-18 13:45:00',
        updateTime: '2023-03-15 16:42:10',
      },
      {
        id: '4',
        code: '080701',
        name: '电子信息工程',
        enName: 'Electronic Information Engineering',
        shortName: '电信',
        collegeId: '2',
        studyYears: '4',
        degreeType: 'engineering',
        foundTime: '1980-09-01',
        sort: 1,
        status: true,
        remark: '电子信息技术专业',
        createTime: '2023-02-01 09:20:00',
        updateTime: '2023-03-10 09:15:25',
      },
      {
        id: '5',
        code: '080702',
        name: '通信工程',
        enName: 'Communication Engineering',
        shortName: '通信',
        collegeId: '2',
        studyYears: '4',
        degreeType: 'engineering',
        foundTime: '1982-09-01',
        sort: 2,
        status: true,
        remark: '通信技术专业',
        createTime: '2023-02-05 11:30:00',
        updateTime: '2023-03-05 10:20:15',
      },
      {
        id: '6',
        code: '070101',
        name: '数学与应用数学',
        enName: 'Mathematics and Applied Mathematics',
        shortName: '数学',
        collegeId: '3',
        studyYears: '4',
        degreeType: 'science',
        foundTime: '1960-09-01',
        sort: 1,
        status: true,
        remark: '数学理论与应用专业',
        createTime: '2023-02-10 14:25:00',
        updateTime: '2023-03-18 09:30:15',
      },
      {
        id: '7',
        code: '080201',
        name: '机械工程',
        enName: 'Mechanical Engineering',
        shortName: '机械',
        collegeId: '4',
        studyYears: '4',
        degreeType: 'engineering',
        foundTime: '1958-09-01',
        sort: 1,
        status: true,
        remark: '机械设计与制造专业',
        createTime: '2023-02-15 10:15:00',
        updateTime: '2023-03-22 14:10:25',
      },
      {
        id: '8',
        code: '050201',
        name: '英语',
        enName: 'English',
        shortName: '英语',
        collegeId: '5',
        studyYears: '4',
        degreeType: 'literature',
        foundTime: '1962-09-01',
        sort: 1,
        status: true,
        remark: '英语语言文学专业',
        createTime: '2023-02-20 11:45:00',
        updateTime: '2023-03-25 16:20:30',
      },
    ];

    collegeList.value = mockCollegeData;
    allMajorList.value = mockMajorData;
    updateDisplayList();
  } catch (error) {
    MessagePlugin.error('获取专业信息列表失败');
    console.error('获取专业信息列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 更新显示的列表数据（分页和搜索）
const updateDisplayList = () => {
  // 根据搜索条件过滤
  let filteredList = allMajorList.value;
  
  // 按学院筛选
  if (collegeFilter.value) {
    filteredList = filteredList.filter(item => item.collegeId === collegeFilter.value);
  }
  
  // 按关键字搜索
  if (searchKey.value) {
    const keyword = searchKey.value.toLowerCase();
    filteredList = filteredList.filter(
      item => item.name.toLowerCase().includes(keyword) || 
             item.code.toLowerCase().includes(keyword) ||
             item.shortName.toLowerCase().includes(keyword)
    );
  }
  
  // 计算分页
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  
  // 更新分页数据
  majorList.value = filteredList.slice(start, end);
  pagination.total = filteredList.length;
};

// 处理搜索
const handleSearch = () => {
  pagination.current = 1;
  updateDisplayList();
};

// 处理新增专业
const handleAddMajor = () => {
  majorDialog.isEdit = false;
  majorDialog.formData = {
    code: '',
    name: '',
    enName: '',
    shortName: '',
    collegeId: '',
    studyYears: '4',
    degreeType: '',
    foundTime: '',
    sort: allMajorList.value.length + 1,
    status: true,
    remark: '',
  };
  majorDialog.visible = true;
};

// 处理编辑专业
const handleEditMajor = (row: Major) => {
  majorDialog.isEdit = true;
  majorDialog.formData = {
    id: row.id,
    code: row.code,
    name: row.name,
    enName: row.enName,
    shortName: row.shortName,
    collegeId: row.collegeId,
    studyYears: row.studyYears,
    degreeType: row.degreeType,
    foundTime: row.foundTime,
    sort: row.sort,
    status: row.status,
    remark: row.remark,
  };
  majorDialog.visible = true;
};

// 处理确认专业表单
const handleConfirmMajor = async () => {
  const valid = await majorForm.value?.validate();
  if (!valid) return;
  
  majorDialog.loading = true;
  try {
    // 模拟API调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
    
    // 处理数据更新
    const newMajor: Major = {
      id: majorDialog.isEdit ? majorDialog.formData.id as string : `${Date.now()}`,
      ...majorDialog.formData,
      createTime: majorDialog.isEdit ? '' : new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    
    if (majorDialog.isEdit) {
      // 更新现有专业
      const index = allMajorList.value.findIndex(item => item.id === newMajor.id);
      if (index !== -1) {
        allMajorList.value[index] = { ...allMajorList.value[index], ...newMajor };
      }
      MessagePlugin.success('专业信息更新成功');
    } else {
      // 添加新专业
      allMajorList.value.unshift(newMajor);
      MessagePlugin.success('专业信息添加成功');
    }
    
    majorDialog.visible = false;
    updateDisplayList();
  } catch (error) {
    MessagePlugin.error('操作失败，请重试');
    console.error('专业操作失败:', error);
  } finally {
    majorDialog.loading = false;
  }
};

// 处理删除专业
const handleDeleteMajor = (row: Major) => {
  deleteDialog.majorId = row.id;
  deleteDialog.majorName = row.name;
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
    const index = allMajorList.value.findIndex(item => item.id === deleteDialog.majorId);
    if (index !== -1) {
      allMajorList.value.splice(index, 1);
    }
    
    MessagePlugin.success('专业信息删除成功');
    deleteDialog.visible = false;
    updateDisplayList();
  } catch (error) {
    MessagePlugin.error('删除失败，请重试');
    console.error('删除专业失败:', error);
  } finally {
    deleteDialog.loading = false;
  }
};

// 初始化
onMounted(() => {
  fetchMajorList();
});
</script>

<script lang="ts">
export default {
  name: 'MajorInfo',
};
</script>

<style lang="less" scoped>
.major-info-container {
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