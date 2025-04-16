<template>
  <div class="module-type-manager">
    <t-card title="模块类型管理" bordered>
      <div class="type-manager__header">
        <div class="type-manager__tools">
          <t-button theme="primary" @click="openAddTypeDialog">
            <template #icon><t-icon name="add" /></template>添加模块类型
          </t-button>
        </div>
      </div>
      
      <t-tabs v-model="activeTab" class="type-tabs">
        <t-tab-panel 
          v-for="type in moduleTypes" 
          :key="type.id" 
          :value="type.id" 
          :label="type.name"
        >
          <div class="type-panel">
            <div class="type-header">
              <h3 class="type-name">{{ type.name }}</h3>
              <div class="type-actions">
                <t-tooltip content="编辑类型">
                  <t-button theme="primary" variant="text" shape="square" @click="editType(type)">
                    <template #icon><t-icon name="edit" /></template>
                  </t-button>
                </t-tooltip>
                <t-tooltip content="删除类型">
                  <t-button theme="danger" variant="text" shape="square" @click="confirmDeleteType(type)">
                    <template #icon><t-icon name="delete" /></template>
                  </t-button>
                </t-tooltip>
              </div>
            </div>
            
            <div class="subtype-section">
              <div class="section-header">
                <h4 class="section-title">模块子类</h4>
                <t-button size="small" theme="primary" @click="openAddSubtypeDialog(type)">
                  <template #icon><t-icon name="add" /></template>添加子类
                </t-button>
              </div>
              
              <div class="subtype-list">
                <t-loading :loading="loading">
                  <t-table
                    :data="getTypeSubtypes(type)"
                    row-key="id"
                    size="medium"
                    :columns="subtypeColumns"
                    :empty="{ description: '暂无子类型数据' }"
                  >
                    <template #operation="{ row }">
                      <t-space>
                        <t-button theme="primary" variant="text" shape="square" @click="editSubtype(row)">
                          <template #icon><t-icon name="edit" /></template>
                        </t-button>
                        <t-button theme="danger" variant="text" shape="square" @click="confirmDeleteSubtype(row)">
                          <template #icon><t-icon name="delete" /></template>
                        </t-button>
                        <t-button theme="primary" variant="text" shape="square" @click="openCourseListDialog(row)">
                          <template #icon><t-icon name="browse" /></template>
                        </t-button>
                        <t-button theme="primary" variant="text" shape="square" @click="openAddCourseDialog(row)">
                          <template #icon><t-icon name="link" /></template>
                        </t-button>
                      </t-space>
                    </template>
                  </t-table>
                </t-loading>
              </div>
            </div>
          </div>
        </t-tab-panel>
      </t-tabs>
    </t-card>
    
    <!-- 添加/编辑模块类型对话框 -->
    <t-dialog
      v-model:visible="typeDialogVisible"
      :header="editingType ? '编辑模块类型' : '添加模块类型'"
      :confirm-btn="{ content: editingType ? '更新' : '添加', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="submitTypeForm"
      @cancel="typeDialogVisible = false"
    >
      <t-form :data="typeForm" ref="typeFormRef" :rules="typeRules">
        <t-form-item label="类型名称" name="name">
          <t-input v-model="typeForm.name" placeholder="请输入模块类型名称" />
        </t-form-item>
        <t-form-item label="模块类型键" name="moduleType">
          <t-input v-model="typeForm.moduleType" placeholder="请输入模块类型键（如general_education）" />
        </t-form-item>
      </t-form>
    </t-dialog>
    
    <!-- 添加/编辑子类型对话框 -->
    <t-dialog
      v-model:visible="subtypeDialogVisible"
      :header="editingSubtype ? '编辑模块子类' : '添加模块子类'"
      :confirm-btn="{ content: editingSubtype ? '更新' : '添加', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="submitSubtypeForm"
      @cancel="subtypeDialogVisible = false"
    >
      <t-form :data="subtypeForm" ref="subtypeFormRef" :rules="subtypeRules">
        <t-form-item label="所属类型" name="typeId">
          <t-select v-model="subtypeForm.typeId" placeholder="请选择所属类型">
            <t-option v-for="type in moduleTypes" :key="type.id" :value="type.id" :label="type.name" />
          </t-select>
        </t-form-item>
        <t-form-item label="子类名称" name="name">
          <t-input v-model="subtypeForm.name" placeholder="请输入模块子类名称" />
        </t-form-item>
      </t-form>
    </t-dialog>
    
    <!-- 删除确认对话框 -->
    <t-dialog
      v-model:visible="deleteDialogVisible"
      header="确认删除"
      @confirm="deleteCallback"
      @cancel="deleteDialogVisible = false"
    >
      <p>{{ deleteMessage }}</p>
    </t-dialog>
    
    <!-- 课程添加对话框 -->
    <t-dialog
      v-model:visible="courseDialogVisible"
      header="添加课程到类型"
      :confirm-btn="{ content: '保存', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="saveCourseSelection"
      @cancel="courseDialogVisible = false"
      width="900px"
    >
      <div class="add-course-container">
        <t-alert
          theme="info"
          message="从课程库中选择课程添加到当前类型，可设置开课学期和学分等信息"
          class="mb-4"
        />
        
        <div class="search-area mb-4">
          <t-row :gutter="[16, 16]">
            <t-col :span="8">
              <t-input 
                v-model="courseSearchParams.keyword" 
                placeholder="搜索课程"
                clearable
                @enter="searchCourses"
              >
                <template #suffix-icon>
                  <t-icon name="search" @click="searchCourses" />
                </template>
              </t-input>
            </t-col>
            <t-col :span="6">
              <t-select 
                v-model="courseSearchParams.nature" 
                placeholder="课程性质"
                clearable
              >
                <t-option v-for="option in courseNatureOptions" :key="option.value" :value="option.value" :label="option.label" />
              </t-select>
            </t-col>
            <t-col :span="6">
              <t-select 
                v-model="courseSearchParams.creditMin" 
                placeholder="最低学分"
                clearable
              >
                <t-option v-for="item in [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]" :key="item" :value="item" :label="`${item}学分`" />
              </t-select>
            </t-col>
            <t-col :span="4">
              <t-button theme="primary" @click="searchCourses">搜索</t-button>
            </t-col>
          </t-row>
        </div>
        
        <div class="course-select-area">
          <t-loading :loading="coursesLoading">
            <t-table
              :data="availableCourses"
              :max-height="350"
              :pagination="{
                current: coursePagination.current,
                pageSize: coursePagination.pageSize,
                total: coursePagination.total,
                showJumper: true,
                showTotal: true,
                totalContent: (total) => `共 ${total} 条数据`,
                pageSizeOptions: [5, 10, 20, 50],
                onChange: coursePagination.onChange,
                onPageSizeChange: coursePagination.onPageSizeChange
              }"
              :columns="courseColumns"
              row-key="id"
              size="medium"
            >
              <template #operation="{ row }">
                <t-space>
                  <t-button theme="primary" variant="text" shape="square" @click="selectCourse(row)">
                    选择
                  </t-button>
                </t-space>
              </template>
            </t-table>
          </t-loading>
        </div>
        
        <t-divider />
        
        <div class="selected-courses mb-4">
          <h3 class="mb-2">已选课程</h3>
          <t-table
            :data="selectedCourses"
            :columns="selectedCourseColumns"
            row-key="id"
            size="medium"
            empty="暂无选择的课程"
          >
            <template #term="{ row }">
              <t-select v-model="row.term" placeholder="学期" style="width: 120px">
                <t-option-group label="第一学年">
                  <t-option value="1-1" label="第一学期" />
                  <t-option value="1-2" label="第二学期" />
                </t-option-group>
                <t-option-group label="第二学年">
                  <t-option value="2-1" label="第一学期" />
                  <t-option value="2-2" label="第二学期" />
                </t-option-group>
                <t-option-group label="第三学年">
                  <t-option value="3-1" label="第一学期" />
                  <t-option value="3-2" label="第二学期" />
                </t-option-group>
                <t-option-group label="第四学年">
                  <t-option value="4-1" label="第一学期" />
                  <t-option value="4-2" label="第二学期" />
                </t-option-group>
              </t-select>
            </template>
            <template #isRequired="{ row }">
              <t-switch v-model="row.isRequired" />
            </template>
            <template #operation="{ row }">
              <t-button theme="danger" variant="text" shape="square" @click="removeSelectedCourse(row)">
                <template #icon><t-icon name="close" /></template>
              </t-button>
            </template>
          </t-table>
        </div>
        
        <div class="credit-summary">
          <p>总课程数: {{ selectedCourses.length }} 门</p>
          <p>总学分: {{ getTotalCredits() }}</p>
        </div>
      </div>
    </t-dialog>

    <!-- 类型课程列表对话框 -->
    <t-dialog
      v-model:visible="courseListDialogVisible"
      :header="`${currentSubtype?.name || ''} - 课程列表`"
      :confirm-btn="{ content: '关闭', theme: 'primary' }"
      @confirm="courseListDialogVisible = false"
      width="900px"
    >
      <div class="course-list-container">
        <div class="course-info-summary mb-4">
          <t-row :gutter="[16, 16]">
            <t-col :span="8">
              <t-statistic title="课程数量" :value="typeCourses.length" />
            </t-col>
            <t-col :span="8">
              <t-statistic title="总学分" :value="getTypeCourseCredits()" />
            </t-col>
            <t-col :span="8">
              <t-statistic title="必修课程" :value="typeCourses.filter(c => c.isRequired).length" />
            </t-col>
          </t-row>
        </div>
        
        <t-table
          :data="typeCourses"
          :columns="typeCourseColumns"
          row-key="id"
          size="medium"
          empty="该类型暂无课程"
          :pagination="{
            current: typeCoursePagination.current,
            pageSize: typeCoursePagination.pageSize,
            total: typeCoursePagination.total,
            showJumper: true,
            showTotal: true,
            totalContent: (total) => `共 ${total} 条数据`,
            pageSizeOptions: [5, 10, 20, 50],
            onChange: typeCoursePagination.onChange,
            onPageSizeChange: typeCoursePagination.onPageSizeChange
          }"
        >
          <template #term="{ row }">
            {{ formatTerm(row.term) }}
          </template>
          <template #isRequired="{ row }">
            <t-tag v-if="row.isRequired" theme="success">必修</t-tag>
            <t-tag v-else theme="warning">选修</t-tag>
          </template>
          <template #operation="{ row }">
            <t-space>
              <t-button theme="primary" variant="text" shape="square" @click="editTypeCourse(row)">
                <template #icon><t-icon name="edit" /></template>
              </t-button>
              <t-button theme="danger" variant="text" shape="square" @click="removeTypeCourse(row)">
                <template #icon><t-icon name="delete" /></template>
              </t-button>
            </t-space>
          </template>
        </t-table>
      </div>
    </t-dialog>

    <!-- 课程编辑对话框 -->
    <t-dialog
      v-model:visible="courseEditDialogVisible"
      header="编辑课程信息"
      :confirm-btn="{ content: '保存', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="saveCourseEdit"
      @cancel="courseEditDialogVisible = false"
    >
      <t-form :data="courseEditForm" ref="courseEditFormRef">
        <t-form-item label="课程名称">
          <t-input v-model="courseEditForm.name" disabled />
        </t-form-item>
        <t-form-item label="开课学期">
          <t-select v-model="courseEditForm.term" placeholder="学期">
            <t-option-group label="第一学年">
              <t-option value="1-1" label="第一学期" />
              <t-option value="1-2" label="第二学期" />
            </t-option-group>
            <t-option-group label="第二学年">
              <t-option value="2-1" label="第一学期" />
              <t-option value="2-2" label="第二学期" />
            </t-option-group>
            <t-option-group label="第三学年">
              <t-option value="3-1" label="第一学期" />
              <t-option value="3-2" label="第二学期" />
            </t-option-group>
            <t-option-group label="第四学年">
              <t-option value="4-1" label="第一学期" />
              <t-option value="4-2" label="第二学期" />
            </t-option-group>
          </t-select>
        </t-form-item>
        <t-form-item label="是否必修">
          <t-switch v-model="courseEditForm.isRequired" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getUniqueId } from '@/utils/index';

// 定义模块类型和子类型接口
interface ModuleType {
  id: string;
  name: string;
  moduleType: string;
}

interface ModuleSubtype {
  id: string;
  typeId: string;
  name: string;
}

// 定义课程接口
interface Course {
  id: string;
  code: string;
  name: string;
  credit: number;
  hours: number;
  nature: string; // 课程性质
  category: string; // 课程类别
  department: string; // 开课部门
}

// 定义模块类型课程接口
interface TypeCourse extends Course {
  term: string; // 学期，如 "1-1" 表示第一学年第一学期
  isRequired: boolean; // 是否必修
  subtypeId: string; // 所属子类型ID
}

// 状态和引用
const loading = ref(false);
const activeTab = ref('');
const moduleTypes = ref<ModuleType[]>([]);
const subtypes = ref<ModuleSubtype[]>([]);
const typeFormRef = ref(null);
const subtypeFormRef = ref(null);
const courseEditFormRef = ref(null);

// 课程相关状态
const availableCourses = ref<Course[]>([]);
const selectedCourses = ref<TypeCourse[]>([]);
const typeCourses = ref<TypeCourse[]>([]);
const allTypeCourses = ref<TypeCourse[]>([]); // 所有类型类别的课程
const coursesLoading = ref(false);
const currentSubtype = ref<ModuleSubtype | null>(null);

// 课程搜索参数
const courseSearchParams = reactive({
  keyword: '',
  nature: '',
  creditMin: undefined as number | undefined,
  pageIndex: 1,
  pageSize: 10
});

// 课程分页
const coursePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (pageInfo: { current: number, pageSize: number }) => {
    coursePagination.current = pageInfo.current;
    coursePagination.pageSize = pageInfo.pageSize;
    searchCourses();
  },
  onPageSizeChange: (pageSize: number) => {
    coursePagination.pageSize = pageSize;
    searchCourses();
  }
});

// 类型课程分页
const typeCoursePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (pageInfo: { current: number, pageSize: number }) => {
    typeCoursePagination.current = pageInfo.current;
    typeCoursePagination.pageSize = pageInfo.pageSize;
    
    // 获取当前子类型下的所有课程
    if (currentSubtype.value) {
      const allSubtypeCourses = allTypeCourses.value.filter(course => course.subtypeId === currentSubtype.value.id);
      
      // 计算当前页应该显示的课程
      const startIndex = (pageInfo.current - 1) * typeCoursePagination.pageSize;
      const endIndex = Math.min(startIndex + typeCoursePagination.pageSize, allSubtypeCourses.length);
      
      // 只显示当前页的数据
      typeCourses.value = allSubtypeCourses.slice(startIndex, endIndex);
    }
  },
  onPageSizeChange: (pageSize: number) => {
    typeCoursePagination.pageSize = pageSize;
    
    // 获取当前子类型下的所有课程
    if (currentSubtype.value) {
      const allSubtypeCourses = allTypeCourses.value.filter(course => course.subtypeId === currentSubtype.value.id);
      
      // 计算当前页应该显示的课程
      const startIndex = (typeCoursePagination.current - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, allSubtypeCourses.length);
      
      // 只显示当前页的数据
      typeCourses.value = allSubtypeCourses.slice(startIndex, endIndex);
    }
  }
});

// 课程编辑表单
const courseEditForm = reactive({
  id: '',
  name: '',
  term: '',
  isRequired: true
});

// 对话框状态
const typeDialogVisible = ref(false);
const subtypeDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const courseDialogVisible = ref(false);
const courseListDialogVisible = ref(false);
const courseEditDialogVisible = ref(false);
const deleteMessage = ref('');
const deleteWarning = ref('');
const deleteCallback = ref(() => {});

// 监听课程列表变化，自动更新分页信息
watch(typeCourses, (newVal) => {
  typeCoursePagination.total = newVal.length;
}, { deep: true });

// 编辑状态
const editingType = ref<ModuleType | null>(null);
const editingSubtype = ref<ModuleSubtype | null>(null);

// 表单数据
const typeForm = reactive({
  name: '',
  moduleType: '',
});

const subtypeForm = reactive({
  typeId: '',
  name: '',
});

// 表单验证规则
const typeRules = {
  name: [{ required: true, message: '请输入类型名称', type: 'error' }],
  moduleType: [{ required: true, message: '请输入模块类型键', type: 'error' }],
};

const subtypeRules = {
  typeId: [{ required: true, message: '请选择所属类型', type: 'error' }],
  name: [{ required: true, message: '请输入子类名称', type: 'error' }],
};

// 子类型表格列定义
const subtypeColumns = [
  {
    colKey: 'name',
    title: '名称',
    width: 180,
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 200,
    fixed: 'right',
    cell: 'operation',
  },
];

// 课程表格列定义
const courseColumns = [
  {
    colKey: 'code',
    title: '课程代码',
    width: 120,
  },
  {
    colKey: 'name',
    title: '课程名称',
    width: 200,
  },
  {
    colKey: 'credit',
    title: '学分',
    width: 80,
  },
  {
    colKey: 'hours',
    title: '学时',
    width: 80,
  },
  {
    colKey: 'nature',
    title: '课程性质',
    width: 120,
  },
  {
    colKey: 'department',
    title: '开课部门',
    width: 150,
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 100,
    cell: 'operation',
  },
];

// 已选课程表格列定义
const selectedCourseColumns = [
  {
    colKey: 'code',
    title: '课程代码',
    width: 120,
  },
  {
    colKey: 'name',
    title: '课程名称',
    width: 200,
  },
  {
    colKey: 'credit',
    title: '学分',
    width: 80,
  },
  {
    colKey: 'term',
    title: '学期',
    width: 120,
    cell: 'term',
  },
  {
    colKey: 'isRequired',
    title: '是否必修',
    width: 100,
    cell: 'isRequired',
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 80,
    cell: 'operation',
  },
];

// 类型课程表格列定义
const typeCourseColumns = [
  {
    colKey: 'code',
    title: '课程代码',
    width: 120,
  },
  {
    colKey: 'name',
    title: '课程名称',
    width: 200,
  },
  {
    colKey: 'credit',
    title: '学分',
    width: 80,
  },
  {
    colKey: 'term',
    title: '学期',
    width: 100,
    cell: 'term',
  },
  {
    colKey: 'isRequired',
    title: '是否必修',
    width: 100,
    cell: 'isRequired',
  },
  {
    colKey: 'department',
    title: '开课部门',
    width: 150,
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 120,
    cell: 'operation',
  },
];

// 计算获取特定类型的子类型
const getTypeSubtypes = (type: ModuleType) => {
  return subtypes.value
    .filter(item => item.typeId === type.id)
};

// 生命周期钩子
onMounted(() => {
  fetchModuleTypes();
  initMockData(); // 添加初始化模拟数据
});

// 初始化模拟数据
const initMockData = () => {
  // 添加模拟的模块类型
  if (moduleTypes.value.length === 0) {
    moduleTypes.value = [
      { id: 'type1', name: '公共基础类', moduleType: 'general_education' },
      { id: 'type2', name: '专业必修类', moduleType: 'major_required' },
      { id: 'type3', name: '专业选修类', moduleType: 'major_elective' }
    ];
    activeTab.value = 'type1';
  }
  
  // 添加模拟的子类型
  if (subtypes.value.length === 0) {
    subtypes.value = [
      { id: 'subtype1', typeId: 'type1', name: '大学英语' },
      { id: 'subtype2', typeId: 'type1', name: '高等数学' },
      { id: 'subtype3', typeId: 'type1', name: '计算机基础' },
      { id: 'subtype4', typeId: 'type2', name: '专业核心课' },
      { id: 'subtype5', typeId: 'type3', name: '专业选修课' }
    ];
  }
  
  // 添加模拟课程
  if (allTypeCourses.value.length === 0) {
    const mockCourses = [
      {
        id: '2001',
        code: 'MATH201',
        name: '高等数学B',
        credit: 4,
        hours: 64,
        nature: 'required',
        category: '数学类',
        department: '数学学院'
      },
      {
        id: '2002',
        code: 'PHYS201',
        name: '大学物理II',
        credit: 3.5,
        hours: 56,
        nature: 'required',
        category: '物理类',
        department: '物理学院'
      },
      {
        id: '2003',
        code: 'ENG101',
        name: '大学英语I',
        credit: 3,
        hours: 48,
        nature: 'required',
        category: '语言类',
        department: '外国语学院'
      },
      {
        id: '2004',
        code: 'CS101',
        name: '计算机导论',
        credit: 2,
        hours: 32,
        nature: 'elective',
        category: '计算机类',
        department: '计算机学院'
      },
      {
        id: '2005',
        code: 'CHEM101',
        name: '基础化学',
        credit: 3,
        hours: 48,
        nature: 'elective',
        category: '化学类',
        department: '化学学院'
      }
    ];
    
    // 为所有子类型添加一些课程
    subtypes.value.forEach(subtype => {
      mockCourses.forEach((course, index) => {
        allTypeCourses.value.push({
          ...course,
          id: `${course.id}-${subtype.id}`,
          term: `${Math.ceil((index + 1) / 2)}-${index % 2 + 1}`, // 分配不同学期
          isRequired: index < 3, // 前三个课程为必修
          subtypeId: subtype.id
        });
      });
    });
  }
};

// 获取模块类型数据
const fetchModuleTypes = async () => {
  loading.value = true;
  try {
    // 获取模块类型
    const typeRes = await fetch('/api/program/module-types');
    const typeData = await typeRes.json();
    
    if (typeData.code === 0) {
      moduleTypes.value = typeData.data;
      if (moduleTypes.value.length > 0) {
        activeTab.value = moduleTypes.value[0].id;
      }
    }
    
    // 获取子类型
    const subtypeRes = await fetch('/api/program/module-subtypes');
    const subtypeData = await subtypeRes.json();
    
    if (subtypeData.code === 0) {
      subtypes.value = subtypeData.data;
    }
    
    // 获取课程数据
    fetchAllTypeCourses();
    
  } catch (error) {
    console.error('Failed to fetch module types:', error);
    MessagePlugin.error('获取模块类型数据失败');
  } finally {
    loading.value = false;
  }
};

// 获取所有类型课程
const fetchAllTypeCourses = async () => {
  try {
    // 实际应用中应该有API获取所有课程
    // allTypeCourses.value = []; // 模拟数据，实际项目中应通过API获取
    // 初始化时不清空数据，保留模拟数据
  } catch (error) {
    console.error('Failed to fetch all type courses:', error);
  }
};

// 打开添加模块类型对话框
const openAddTypeDialog = () => {
  editingType.value = null;
  typeForm.name = '';
  typeForm.moduleType = '';
  typeDialogVisible.value = true;
};

// 打开编辑模块类型对话框
const editType = (type: ModuleType) => {
  editingType.value = type;
  typeForm.name = type.name;
  typeForm.moduleType = type.moduleType || '';
  typeDialogVisible.value = true;
};

// 确认删除模块类型
const confirmDeleteType = (type: ModuleType) => {
  deleteMessage.value = `确定要删除模块类型"${type.name}"吗？`;
  deleteWarning.value = '注意：删除此类型将同时删除其所有子类型及相关课程数据，此操作不可恢复。';
  deleteCallback.value = () => deleteType(type.id);
  deleteDialogVisible.value = true;
};

// 删除模块类型
const deleteType = async (id: string) => {
  try {
    const res = await fetch(`/api/program/module-types/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    
    if (data.code === 0) {
      // 更新本地数据
      moduleTypes.value = moduleTypes.value.filter(item => item.id !== id);
      subtypes.value = subtypes.value.filter(item => item.typeId !== id);
      
      // 更新选中的tab
      if (moduleTypes.value.length > 0) {
        activeTab.value = moduleTypes.value[0].id;
      } else {
        activeTab.value = '';
      }
      
      MessagePlugin.success('模块类型删除成功');
    } else {
      MessagePlugin.error(data.message || '删除失败');
    }
  } catch (error) {
    console.error('Failed to delete module type:', error);
    MessagePlugin.error('删除模块类型失败');
  }
};

// 提交模块类型表单
const submitTypeForm = async () => {
  const formEl = typeFormRef.value as any;
  if (formEl) {
    const valid = await formEl.validate();
    if (!valid) return;
    
    try {
      if (editingType.value) {
        // 更新模块类型
        const res = await fetch(`/api/program/module-types/${editingType.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: typeForm.name,
            moduleType: typeForm.moduleType,
          })
        });
        const data = await res.json();
        
        if (data.code === 0) {
          // 更新本地数据
          const index = moduleTypes.value.findIndex(item => item.id === editingType.value!.id);
          if (index !== -1) {
            moduleTypes.value[index] = {
              ...moduleTypes.value[index],
              name: typeForm.name,
              moduleType: typeForm.moduleType,
            };
          }
          
          MessagePlugin.success('模块类型更新成功');
        } else {
          MessagePlugin.error(data.message || '更新失败');
        }
      } else {
        // 添加新模块类型
        const res = await fetch('/api/program/module-types', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: typeForm.name,
            moduleType: typeForm.moduleType,
          })
        });
        const data = await res.json();
        
        if (data.code === 0) {
          // 更新本地数据
          moduleTypes.value.push(data.data);
          activeTab.value = data.data.id;
          
          MessagePlugin.success('模块类型添加成功');
        } else {
          MessagePlugin.error(data.message || '添加失败');
        }
      }
      
      typeDialogVisible.value = false;
    } catch (error) {
      console.error('Failed to submit module type:', error);
      MessagePlugin.error('保存模块类型失败');
    }
  }
};

// 打开添加子类型对话框
const openAddSubtypeDialog = (type: ModuleType) => {
  editingSubtype.value = null;
  subtypeForm.typeId = type.id;
  subtypeForm.name = '';
  subtypeDialogVisible.value = true;
};

// 打开编辑子类型对话框
const editSubtype = (subtype: ModuleSubtype) => {
  editingSubtype.value = subtype;
  subtypeForm.typeId = subtype.typeId;
  subtypeForm.name = subtype.name;
  subtypeDialogVisible.value = true;
};

// 确认删除子类型
const confirmDeleteSubtype = (subtype: ModuleSubtype) => {
  deleteMessage.value = `确定要删除子类型"${subtype.name}"吗？`;
  deleteWarning.value = '注意：删除此子类型将同时删除其关联的所有课程数据，此操作不可恢复。';
  deleteCallback.value = () => deleteSubtype(subtype.id);
  deleteDialogVisible.value = true;
};

// 删除子类型
const deleteSubtype = async (id: string) => {
  try {
    const res = await fetch(`/api/program/module-subtypes/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    
    if (data.code === 0 || data.code === 200) { // 有些API可能返回200作为成功码
      // 更新本地数据
      subtypes.value = subtypes.value.filter(item => item.id !== id);
      // 同时移除关联的课程
      allTypeCourses.value = allTypeCourses.value.filter(course => course.subtypeId !== id);
      
      MessagePlugin.success('子类型删除成功');
    } else {
      MessagePlugin.error(data.message || '删除失败');
    }
  } catch (error) {
    console.error('Failed to delete module subtype:', error);
    // 模拟前端删除，实际项目中应正确处理API错误
    subtypes.value = subtypes.value.filter(item => item.id !== id);
    MessagePlugin.success('子类型删除成功（模拟）');
  }
};

// 提交子类型表单
const submitSubtypeForm = async () => {
  const formEl = subtypeFormRef.value as any;
  if (formEl) {
    const valid = await formEl.validate();
    if (!valid) return;
    
    try {
      if (editingSubtype.value) {
        // 更新子类型
        const res = await fetch(`/api/program/module-subtypes/${editingSubtype.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            typeId: subtypeForm.typeId,
            name: subtypeForm.name,
          })
        });
        
        // 处理响应
        let success = false;
        try {
          const data = await res.json();
          success = data.code === 0 || data.code === 200;
        } catch {
          // 如果API尚未实现，模拟成功响应
          success = true;
        }
        
        if (success) {
          // 更新本地数据
          const index = subtypes.value.findIndex(item => item.id === editingSubtype.value!.id);
          if (index !== -1) {
            subtypes.value[index] = {
              ...subtypes.value[index],
              typeId: subtypeForm.typeId,
              name: subtypeForm.name,
            };
          }
          MessagePlugin.success('子类型更新成功');
        } else {
          MessagePlugin.error('更新失败');
        }
      } else {
        // 添加新子类型
        const res = await fetch('/api/program/module-subtypes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            typeId: subtypeForm.typeId,
            name: subtypeForm.name,
          })
        });
        
        // 处理响应
        let newSubtype = null;
        try {
          const data = await res.json();
          if (data.code === 0 || data.code === 200) {
            newSubtype = data.data;
          }
        } catch {
          // 如果API尚未实现，创建模拟数据
          newSubtype = {
            id: getUniqueId(),
            typeId: subtypeForm.typeId,
            name: subtypeForm.name,
          };
        }
        
        if (newSubtype) {
          // 更新本地数据
          subtypes.value.push(newSubtype);
          MessagePlugin.success('子类型添加成功');
        } else {
          MessagePlugin.error('添加失败');
        }
      }
      
      subtypeDialogVisible.value = false;
    } catch (error) {
      console.error('Failed to submit module subtype:', error);
      // 模拟前端操作，实际项目中应正确处理API错误
      if (editingSubtype.value) {
        // 更新现有子类型
        const index = subtypes.value.findIndex(item => item.id === editingSubtype.value!.id);
        if (index !== -1) {
          subtypes.value[index] = {
            ...editingSubtype.value,
            typeId: subtypeForm.typeId,
            name: subtypeForm.name,
          };
          MessagePlugin.success('子类型更新成功（模拟）');
        }
      } else {
        // 添加新子类型
        const newSubtype: ModuleSubtype = {
          id: getUniqueId(),
          typeId: subtypeForm.typeId,
          name: subtypeForm.name,
        };
        subtypes.value.push(newSubtype);
        MessagePlugin.success('子类型添加成功（模拟）');
      }
      
      subtypeDialogVisible.value = false;
    }
  }
};

// 课程相关操作
// 打开添加课程对话框
const openAddCourseDialog = (subtype: ModuleSubtype) => {
  currentSubtype.value = subtype;
  selectedCourses.value = [];
  courseSearchParams.keyword = '';
  courseSearchParams.nature = '';
  courseSearchParams.creditMin = undefined;
  coursePagination.current = 1;
  
  courseDialogVisible.value = true;
  searchCourses();
};

// 打开课程列表对话框
const openCourseListDialog = (subtype: ModuleSubtype) => {
  currentSubtype.value = subtype;
  // 获取该子类型的所有课程
  const allSubtypeCourses = allTypeCourses.value.filter(course => course.subtypeId === subtype.id);
  
  // 重置分页信息
  typeCoursePagination.current = 1;
  typeCoursePagination.total = allSubtypeCourses.length;
  
  // 只显示第一页数据
  const startIndex = 0;
  const endIndex = Math.min(typeCoursePagination.pageSize, allSubtypeCourses.length);
  typeCourses.value = allSubtypeCourses.slice(startIndex, endIndex);
  
  courseListDialogVisible.value = true;
  
  console.log('课程列表初始化', {
    subtypeId: subtype.id, 
    totalCourses: allSubtypeCourses.length,
    pageSize: typeCoursePagination.pageSize,
    displayedCourses: typeCourses.value.length
  });
};

// 搜索课程
const searchCourses = () => {
  coursesLoading.value = true;
  
  // 模拟从API获取课程数据
  setTimeout(() => {
    // 模拟搜索逻辑
    const mockCourses: Course[] = [
      {
        id: '2001',
        code: 'MATH201',
        name: '高等数学B',
        credit: 4,
        hours: 64,
        nature: 'required',
        category: '数学类',
        department: '数学学院'
      },
      {
        id: '2002',
        code: 'PHYS201',
        name: '大学物理II',
        credit: 3.5,
        hours: 56,
        nature: 'required',
        category: '物理类',
        department: '物理学院'
      },
      {
        id: '2003',
        code: 'ENG101',
        name: '大学英语I',
        credit: 3,
        hours: 48,
        nature: 'required',
        category: '语言类',
        department: '外国语学院'
      },
      {
        id: '2004',
        code: 'CS101',
        name: '计算机导论',
        credit: 2,
        hours: 32,
        nature: 'elective',
        category: '计算机类',
        department: '计算机学院'
      },
      {
        id: '2005',
        code: 'CHEM101',
        name: '基础化学',
        credit: 3,
        hours: 48,
        nature: 'elective',
        category: '化学类',
        department: '化学学院'
      },
      // 添加更多模拟数据以测试分页
      {
        id: '2006',
        code: 'BIO101',
        name: '基础生物学',
        credit: 3,
        hours: 48,
        nature: 'elective',
        category: '生物类',
        department: '生物学院'
      },
      {
        id: '2007',
        code: 'ECON101',
        name: '经济学原理',
        credit: 3,
        hours: 48,
        nature: 'elective',
        category: '经济类',
        department: '经济学院'
      },
      {
        id: '2008',
        code: 'HIST101',
        name: '中国历史',
        credit: 2,
        hours: 32,
        nature: 'elective',
        category: '历史类',
        department: '历史学院'
      },
      {
        id: '2009',
        code: 'ART101',
        name: '艺术鉴赏',
        credit: 2,
        hours: 32,
        nature: 'elective',
        category: '艺术类',
        department: '艺术学院'
      },
      {
        id: '2010',
        code: 'PE101',
        name: '体育与健康',
        credit: 1,
        hours: 32,
        nature: 'required',
        category: '体育类',
        department: '体育学院'
      },
      {
        id: '2011',
        code: 'PHIL101',
        name: '哲学导论',
        credit: 2,
        hours: 32,
        nature: 'elective',
        category: '哲学类',
        department: '哲学院'
      },
      {
        id: '2012',
        code: 'SOC101',
        name: '社会学概论',
        credit: 2,
        hours: 32,
        nature: 'elective',
        category: '社会学类',
        department: '社会学院'
      }
    ];
    
    // 根据搜索条件过滤
    let filteredCourses = [...mockCourses];
    
    if (courseSearchParams.keyword) {
      const keyword = courseSearchParams.keyword.toLowerCase();
      filteredCourses = filteredCourses.filter(
        course => course.name.toLowerCase().includes(keyword) || 
                course.code.toLowerCase().includes(keyword) ||
                course.department.toLowerCase().includes(keyword)
      );
    }
    
    if (courseSearchParams.nature) {
      filteredCourses = filteredCourses.filter(course => course.nature === courseSearchParams.nature);
    }
    
    if (courseSearchParams.creditMin !== undefined) {
      filteredCourses = filteredCourses.filter(course => course.credit >= courseSearchParams.creditMin!);
    }
    
    // 排除已经在当前子类型中的课程
    const existingCourseIds = allTypeCourses.value
      .filter(course => course.subtypeId === currentSubtype.value?.id)
      .map(course => course.id);
    
    filteredCourses = filteredCourses.filter(course => !existingCourseIds.includes(course.id));
    
    // 设置分页数据
    const total = filteredCourses.length;
    coursePagination.total = total;
    
    // 如果当前页超出范围，则回到第一页
    const totalPages = Math.ceil(total / coursePagination.pageSize);
    if (total > 0 && coursePagination.current > totalPages) {
      coursePagination.current = 1;
    }
    
    // 计算当前页应该显示的课程
    const startIndex = (coursePagination.current - 1) * coursePagination.pageSize;
    const endIndex = Math.min(startIndex + coursePagination.pageSize, total);
    
    // 只显示当前页的数据
    availableCourses.value = filteredCourses.slice(startIndex, endIndex);
    
    console.log('课程搜索结果', {
      totalCourses: total,
      currentPage: coursePagination.current,
      pageSize: coursePagination.pageSize,
      displayedCourses: availableCourses.value.length
    });
    
    coursesLoading.value = false;
  }, 500);
};

// 选择课程
const selectCourse = (course: Course) => {
  const existingIndex = selectedCourses.value.findIndex(c => c.id === course.id);
  
  if (existingIndex === -1) {
    // 添加到已选课程，默认设置为第一学年第一学期必修课
    selectedCourses.value.push({
      ...course,
      term: '1-1',
      isRequired: true,
      subtypeId: currentSubtype.value?.id || ''
    });
  } else {
    MessagePlugin.warning('该课程已添加');
  }
};

// 移除已选课程
const removeSelectedCourse = (course: TypeCourse) => {
  const index = selectedCourses.value.findIndex(c => c.id === course.id);
  if (index !== -1) {
    selectedCourses.value.splice(index, 1);
  }
};

// 保存课程选择
const saveCourseSelection = () => {
  if (selectedCourses.value.length === 0) {
    MessagePlugin.warning('请至少选择一门课程');
    return;
  }
  
  // 将选中的课程添加到子类型
  selectedCourses.value.forEach(course => {
    // 检查是否已存在相同的课程
    const existingIndex = allTypeCourses.value.findIndex(
      c => c.id === course.id && c.subtypeId === currentSubtype.value?.id
    );
    
    if (existingIndex === -1) {
      allTypeCourses.value.push(course);
    }
  });
  
  // 更新类型课程列表，以防当前正在查看该子类型的课程列表
  if (courseListDialogVisible.value && currentSubtype.value) {
    const allSubtypeCourses = allTypeCourses.value.filter(
      course => course.subtypeId === currentSubtype.value?.id
    );
    
    // 更新分页信息
    typeCoursePagination.total = allSubtypeCourses.length;
    
    // 计算当前页应该显示的课程
    const startIndex = (typeCoursePagination.current - 1) * typeCoursePagination.pageSize;
    const endIndex = Math.min(startIndex + typeCoursePagination.pageSize, allSubtypeCourses.length);
    
    // 只显示当前页的数据
    typeCourses.value = allSubtypeCourses.slice(startIndex, endIndex);
  }
  
  MessagePlugin.success(`成功添加 ${selectedCourses.value.length} 门课程到 ${currentSubtype.value?.name}`);
  courseDialogVisible.value = false;
};

// 编辑类型课程
const editTypeCourse = (course: TypeCourse) => {
  courseEditForm.id = course.id;
  courseEditForm.name = course.name;
  courseEditForm.term = course.term;
  courseEditForm.isRequired = course.isRequired;
  
  courseEditDialogVisible.value = true;
};

// 保存课程编辑
const saveCourseEdit = () => {
  const index = allTypeCourses.value.findIndex(
    course => course.id === courseEditForm.id && course.subtypeId === currentSubtype.value?.id
  );
  
  if (index !== -1) {
    allTypeCourses.value[index] = {
      ...allTypeCourses.value[index],
      term: courseEditForm.term,
      isRequired: courseEditForm.isRequired
    };
    
    // 重新获取当前子类型下的所有课程
    if (currentSubtype.value) {
      const allSubtypeCourses = allTypeCourses.value.filter(
        course => course.subtypeId === currentSubtype.value.id
      );
      
      // 更新分页信息
      typeCoursePagination.total = allSubtypeCourses.length;
      
      // 计算当前页应该显示的课程
      const startIndex = (typeCoursePagination.current - 1) * typeCoursePagination.pageSize;
      const endIndex = Math.min(startIndex + typeCoursePagination.pageSize, allSubtypeCourses.length);
      
      // 只显示当前页的数据
      typeCourses.value = allSubtypeCourses.slice(startIndex, endIndex);
    }
    
    MessagePlugin.success('课程信息更新成功');
    courseEditDialogVisible.value = false;
  }
};

// 移除类型课程
const removeTypeCourse = (course: TypeCourse) => {
  deleteMessage.value = `确定要从类型"${currentSubtype.value?.name}"中移除课程"${course.name}"吗？`;
  deleteWarning.value = '';
  deleteCallback.value = () => {
    // 从类型课程中移除
    const index = allTypeCourses.value.findIndex(
      c => c.id === course.id && c.subtypeId === currentSubtype.value?.id
    );
    
    if (index !== -1) {
      allTypeCourses.value.splice(index, 1);
      
      // 重新获取当前子类型下的所有课程
      if (currentSubtype.value) {
        const allSubtypeCourses = allTypeCourses.value.filter(
          c => c.subtypeId === currentSubtype.value.id
        );
        
        // 更新分页信息
        typeCoursePagination.total = allSubtypeCourses.length;
        
        // 如果当前页没有数据了，且不是第一页，则回到上一页
        if (allSubtypeCourses.length === 0) {
          typeCoursePagination.current = 1;
        } else if ((typeCoursePagination.current - 1) * typeCoursePagination.pageSize >= allSubtypeCourses.length) {
          typeCoursePagination.current = Math.max(1, Math.ceil(allSubtypeCourses.length / typeCoursePagination.pageSize));
        }
        
        // 计算当前页应该显示的课程
        const startIndex = (typeCoursePagination.current - 1) * typeCoursePagination.pageSize;
        const endIndex = Math.min(startIndex + typeCoursePagination.pageSize, allSubtypeCourses.length);
        
        // 只显示当前页的数据
        typeCourses.value = allSubtypeCourses.slice(startIndex, endIndex);
      }
      
      MessagePlugin.success('课程已从类型中移除');
    }
  };
  
  deleteDialogVisible.value = true;
};

// 获取类型课程的总学分
const getTypeCourseCredits = () => {
  return typeCourses.value.reduce((sum, course) => sum + course.credit, 0).toFixed(1);
};

// 获取已选课程的总学分
const getTotalCredits = () => {
  return selectedCourses.value.reduce((sum, course) => sum + course.credit, 0).toFixed(1);
};

// 格式化学期显示
const formatTerm = (term: string) => {
  if (!term) return '';
  
  const [year, semester] = term.split('-');
  return `第${year}学年第${semester}学期`;
};
</script>

<style lang="less" scoped>
.module-type-manager {
  .type-manager__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .type-manager__tools {
    display: flex;
    gap: 10px;
  }
  
  .type-tabs {
    margin-top: 16px;
  }
  
  .type-panel {
    padding: 16px 0;
  }
  
  .type-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .type-name {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
  
  .type-actions {
    display: flex;
    gap: 8px;
  }
  
  .subtype-section {
    margin-top: 20px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 15px;
    font-weight: 500;
    margin: 0;
  }
  
  .subtype-list {
    margin-top: 20px;
  }
  
  .drag-handle {
    cursor: move;
    color: var(--td-text-color-secondary);
  }
  
  .draggable-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
  }
  
  .delete-warning {
    color: var(--td-error-color);
    margin-top: 8px;
  }
  
  .dragging-ghost {
    background-color: var(--td-bg-color-container-hover);
    opacity: 0.8;
  }
  
  .mb-4 {
    margin-bottom: 16px;
  }
  
  .mb-2 {
    margin-bottom: 8px;
  }
  
  .add-course-container,
  .course-list-container {
    .search-area {
      background-color: var(--td-bg-color-container-hover);
      padding: 16px;
      border-radius: 6px;
    }
    
    .course-info-summary {
      background-color: var(--td-bg-color-container-hover);
      padding: 16px;
      border-radius: 6px;
    }
    
    .course-select-area {
      margin-bottom: 16px;
    }
    
    .selected-courses {
      border: 1px solid var(--td-component-stroke);
      border-radius: 6px;
      padding: 16px;
    }
    
    .credit-summary {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background-color: var(--td-brand-color-light);
      border-radius: 6px;
      font-weight: 500;
    }
  }
}
</style> 