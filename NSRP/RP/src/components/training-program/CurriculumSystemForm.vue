<template>
  <div class="curriculum-system-form">
    <t-form
      ref="formRef"
      :data="formData"
      :rules="rules"
      :label-width="100"
      @reset="onReset"
      @submit="onSubmit"
    >
      <!-- 基本信息 -->
      <t-card title="基本信息" class="mb-4">
        <t-row :gutter="[16, 24]">
          <t-col :span="12">
            <t-form-item label="模板名称" name="name">
              <t-input v-model="formData.name" placeholder="请输入课程体系模板名称" />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="模板类型" name="majorType">
              <t-select v-model="formData.majorType" placeholder="请选择模板类型">
                <t-option value="engineering" label="工科类" />
                <t-option value="science" label="理科类" />
                <t-option value="arts" label="文科类" />
                <t-option value="economics_management" label="经管类" />
                <t-option value="medicine" label="医学类" />
                <t-option value="education" label="教育类" />
                <t-option value="art" label="艺术类" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="学位类型" name="degreeType">
              <t-select v-model="formData.degreeType" placeholder="请选择学位类型">
                <t-option value="bachelor" label="学士" />
                <t-option value="master" label="硕士" />
                <t-option value="doctor" label="博士" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="是否默认" name="isDefault">
              <t-switch v-model="formData.isDefault" />
            </t-form-item>
          </t-col>
        </t-row>
      </t-card>

      <!-- 课程体系模块 -->
      <t-card title="课程体系模块" class="mb-4">
        <template #actions>
          <t-button theme="primary" variant="text" @click="addModule">
            <template #icon><t-icon name="add" /></template>添加模块
          </t-button>
        </template>
        
        <!-- 添加学分统计区域 -->
        <div class="credit-summary mb-4">
          <t-table :data="statData" size="small" bordered stripe :pagination="pagination" :columns="statColumns" />
        </div>
        
        <div v-if="formData.modules.length === 0" class="empty-modules">
          <t-empty description="暂无课程体系模块，请点击右上角'添加模块'按钮添加" />
        </div>
        
        <div v-for="(module, index) in formData.modules" :key="index" class="module-form-item">
          <div class="module-header">
            <h3 class="module-title">模块 {{ index + 1 }}: {{ module.name || '未命名模块' }}</h3>
            <div class="module-actions">
              <t-tooltip content="上移">
                <t-button 
                  theme="default" 
                  variant="text" 
                  shape="square" 
                  size="small"
                  :disabled="index === 0"
                  @click="moveModuleUp(index)"
                >
                  <template #icon><t-icon name="arrow-up" /></template>
                </t-button>
              </t-tooltip>
              <t-tooltip content="下移">
                <t-button 
                  theme="default" 
                  variant="text" 
                  shape="square" 
                  size="small"
                  :disabled="index === formData.modules.length - 1"
                  @click="moveModuleDown(index)"
                >
                  <template #icon><t-icon name="arrow-down" /></template>
                </t-button>
              </t-tooltip>
              <t-tooltip content="删除模块">
                <t-button 
                  theme="danger" 
                  variant="text" 
                  shape="square" 
                  size="small"
                  @click="removeModule(index)"
                >
                  <template #icon><t-icon name="delete" /></template>
                </t-button>
              </t-tooltip>
            </div>
          </div>
          
          <t-row :gutter="[16, 24]" class="module-row">
            <t-col :span="12">
              <t-form-item :label="'模块名称'" :name="`modules[${index}].name`">
                <t-input v-model="module.name" placeholder="请输入模块名称" />
              </t-form-item>
            </t-col>
            <t-col :span="12">
              <t-form-item :label="'模块类型'" :name="`modules[${index}].type`">
                <t-select v-model="module.type" placeholder="请选择模块类型" @change="handleModuleTypeChange(index)">
                  <t-option 
                    v-for="typeOption in moduleTypeOptions" 
                    :key="typeOption.moduleType" 
                    :value="typeOption.moduleType" 
                    :label="typeOption.name" 
                  />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="24">
              <t-form-item :label="'模块子类'" :name="`modules[${index}].courseCategories`">
                <t-select
                  v-model="module.courseCategories"
                  placeholder="请选择模块子类"
                  multiple
                  filterable
                  :tag-props="{ maxWidth: 150 }"
                >
                  <t-option
                    v-for="option in getFilteredCategoryOptions(module.type)"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                  />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="12">
              <t-form-item :label="'是否必修'" :name="`modules[${index}].required`">
                <t-switch v-model="module.required" />
              </t-form-item>
            </t-col>
            <t-col :span="12">
              <t-form-item :label="'排序'" :name="`modules[${index}].order`">
                <t-input-number v-model="module.order" :min="1" />
              </t-form-item>
            </t-col>
            <t-col :span="8">
              <t-form-item :label="'最低学分'" :name="`modules[${index}].minCredits`">
                <t-input-number v-model="module.minCredits" :min="0" :step="0.5" />
              </t-form-item>
            </t-col>
            <t-col :span="8">
              <t-form-item :label="'最高学分'" :name="`modules[${index}].maxCredits`">
                <t-input-number v-model="module.maxCredits" :min="0" :step="0.5" />
              </t-form-item>
            </t-col>
            <t-col :span="8">
              <t-form-item :label="'建议学分'" :name="`modules[${index}].recommendedCredits`">
                <t-input-number v-model="module.recommendedCredits" :min="0" :step="0.5" />
              </t-form-item>
            </t-col>
            <t-col :span="12">
              <t-form-item :label="'必修课数量'" :name="`modules[${index}].requiredCourseCount`">
                <t-input-number v-model="module.requiredCourseCount" :min="0" :step="1" />
              </t-form-item>
            </t-col>
            <t-col :span="12">
              <t-form-item :label="'选修课数量'" :name="`modules[${index}].electiveCourseCount`">
                <t-input-number v-model="module.electiveCourseCount" :min="0" :step="1" />
              </t-form-item>
            </t-col>
            
            <!-- 课程选择按钮 -->
            <t-col :span="24" class="mb-2">
              <t-space>
                <t-button size="small" @click="openCategoryCoursesDialog(index)">
                  <template #icon><t-icon name="folder-open" /></template>
                  从模块类别导入课程
                </t-button>
                <t-button size="small" @click="openCourseLibraryDialog(index)">
                  <template #icon><t-icon name="books" /></template>
                  从课程库添加
                </t-button>
              </t-space>
            </t-col>
            
            <!-- 课程列表 -->
            <t-col :span="24">
              <t-table
                :data="getAllCourses(module)"
                :columns="courseColumns"
                :bordered="true"
                size="small"
                :pagination="{ pageSize: 5 }"
                :empty="'暂无课程'"
                row-key="id"
                @cell-click="onCellClick"
                :editable="{ validator: onEdit }"
              >
                <template #semester="{ row }">
                  <t-select
                    v-model="row.semester"
                    size="small"
                    placeholder="选择学期"
                    @change="(val) => updateCourseSemester(index, row.id, val, row.required)"
                  >
                    <t-option v-for="sem in semesterOptions" :key="sem.value" :value="sem.value" :label="sem.label" />
                  </t-select>
                </template>
                <template #required="{ row }">
                  <t-tag theme="primary" variant="light" v-if="row.required">必修</t-tag>
                  <t-tag theme="warning" variant="light" v-else>选修</t-tag>
                </template>
                <template #moduleType="{ row }">
                  {{ getModuleTypeName(module.type) }}
                </template>
                <template #moduleSubcategory="{ row }">
                  {{ row.moduleSubcategory || '-' }}
                </template>
                <template #hours="{ row }">
                  {{ row.hours || 0 }}
                </template>
                <template #operation="{ row }">
                  <t-space>
                    <t-button
                      theme="danger"
                      variant="text"
                      size="small"
                      @click="removeCourse(index, row.id, row.required)"
                    >
                      删除
                    </t-button>
                  </t-space>
                </template>
              </t-table>
            </t-col>
          </t-row>
          <t-divider v-if="index !== formData.modules.length - 1" />
        </div>
      </t-card>

      <!-- 表单操作 -->
      <t-card>
        <div class="form-actions">
          <t-space size="small">
            <t-button theme="default" variant="base" @click="onReset">重置</t-button>
            <t-button theme="primary" type="submit">保存</t-button>
          </t-space>
        </div>
      </t-card>
    </t-form>
  </div>
  
  <!-- 模块类别课程选择对话框 -->
  <t-dialog
    v-model:visible="showCategoryCoursesDialog"
    header="从模块类别选择课程"
    :width="800"
    :footer="false"
  >
    <template #body>
      <div class="course-select-dialog">
        <t-alert
          theme="info"
          message="请从当前模块类别中选择需要添加的课程"
          class="mb-4"
        />
        
        <t-table
          :data="categoryCoursesData"
          :columns="dialogCourseColumns"
          :bordered="true"
          :loading="categoryCoursesDialogLoading"
          :empty="'暂无课程数据'"
          :select-on-row-click="true"
          :pagination="{ pageSize: 8 }"
          row-key="id"
          v-model:selectedRowKeys="selectedCategoryCoursesIds"
        >
          <template #property="{ row }">
            <t-tag theme="primary" variant="light" v-if="row.property === 'required'">必修</t-tag>
            <t-tag theme="warning" variant="light" v-else>选修</t-tag>
          </template>
        </t-table>
        
        <div class="dialog-footer">
          <t-space>
            <t-button theme="default" @click="showCategoryCoursesDialog = false">取消</t-button>
            <t-button theme="primary" @click="addSelectedCategoryCourses">确定添加</t-button>
          </t-space>
        </div>
      </div>
    </template>
  </t-dialog>
  
  <!-- 课程库选择对话框 -->
  <t-dialog
    v-model:visible="showCourseLibraryDialog"
    header="从课程库选择课程"
    :width="800"
    :footer="false"
  >
    <template #body>
      <div class="course-select-dialog">
        <t-alert
          theme="info"
          message="请从课程库中选择需要添加的课程"
          class="mb-4"
        />
        
        <t-input
          v-model="courseSearchKeyword"
          placeholder="搜索课程名称或代码"
          clearable
          prefix-icon="search"
          class="mb-4"
        />
        
        <t-table
          :data="filteredCourseLibraryData"
          :columns="dialogCourseColumns"
          :bordered="true"
          :loading="courseLibraryLoading"
          :empty="'暂无匹配课程'"
          :select-on-row-click="true"
          :pagination="{ pageSize: 8 }"
          row-key="id"
          v-model:selectedRowKeys="selectedCourseLibraryIds"
        >
          <template #property="{ row }">
            <t-tag theme="primary" variant="light" v-if="row.property === 'required'">必修</t-tag>
            <t-tag theme="warning" variant="light" v-else>选修</t-tag>
          </template>
        </t-table>
        
        <!-- 添加模块子类别选择 -->
        <div class="subcategory-select-area mt-4">
          <t-form layout="inline">
            <t-form-item label="选择模块子类别">
              <t-select
                v-model="selectedSubcategory"
                placeholder="请选择模块子类别"
                :options="getCurrentModuleSubcategoryOptions()"
                clearable
              />
            </t-form-item>
          </t-form>
          <div class="hint-text">仅显示当前模块类型下的子类别</div>
        </div>
        
        <div class="dialog-footer">
          <t-space>
            <t-button theme="default" @click="showCourseLibraryDialog = false">取消</t-button>
            <t-button theme="primary" @click="addSelectedLibraryCourses">确定添加</t-button>
          </t-space>
        </div>
      </div>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch, onMounted, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getUniqueId } from '@/utils/index';
import type { FormRule, FormRules, SubmitContext } from 'tdesign-vue-next';
import type { TableRowData, TdPaginationProps, PrimaryTableCol } from 'tdesign-vue-next';

const props = defineProps({
  template: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  }
});

const emit = defineEmits(['submit', 'cancel']);

const formRef = ref(null);

// 课程类别选项
interface CategoryOption {
  value: string;
  label: string;
}

const courseCategoryOptions = ref<CategoryOption[]>([]);

// 模块类型到子类别的映射
const moduleTypeToCategories: Record<string, string[]> = {};

// 模块类型选项
const moduleTypeOptions = ref<{ moduleType: string; name: string }[]>([]);

// 获取模块类型选项
const fetchModuleTypes = () => {
  // 调用 API 获取模块类型数据
  fetch('/api/program/module-types')
    .then(response => response.json())
    .then(res => {
      if (res.code === 0) {
        // 转换数据格式
        moduleTypeOptions.value = res.data.map((type: any) => ({
          name: type.name,
          moduleType: type.moduleType || type.code
        }));
        
        // 获取模块类型子类别映射
        return fetch('/api/program/module-categories');
      }
    })
    .then(response => response?.json())
    .then(res => {
      if (res && res.code === 0) {
        // 更新 moduleTypeToCategories 对象
        res.data.forEach((item: any) => {
          moduleTypeToCategories[item.parentType] = item.categories || [];
        });
        
        // 获取子类别列表
        return fetch('/api/program/module-subtypes');
      }
    })
    .then(response => response?.json())
    .then(res => {
      if (res && res.code === 0) {
        // 转换子类别为选项格式
        courseCategoryOptions.value = res.data.map((subtype: any) => ({
          value: subtype.id,
          label: subtype.name,
          typeId: subtype.typeId
        }));
      }
    })
    .catch(error => {
      console.error('Error loading module types:', error);
    });
};

// 模块接口定义
interface Module {
  id: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  minCredits: number;
  maxCredits: number;
  recommendedCredits: number;
  requiredCourseCount: number;
  electiveCourseCount: number;
  courseCategories: string[];
  requiredCourses?: Course[];
  electiveCourses?: Course[];
}

// 课程接口定义
interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  category: string;
  semester?: string;
  required?: boolean;
  moduleType?: string;
  moduleSubcategory?: string;
  hours?: number;
  property?: 'required' | 'elective';
}

// 根据模块类型获取过滤后的子类别选项
const getFilteredCategoryOptions = (moduleType: string): CategoryOption[] => {
  if (!moduleType) {
    return courseCategoryOptions.value;
  }
  
  const categories = moduleTypeToCategories[moduleType] || [];
  return courseCategoryOptions.value.filter(option => categories.includes(option.value));
};

// 处理模块类型变更，清空不相关的子类别
const handleModuleTypeChange = (index: number): void => {
  const module = formData.modules[index];
  const type = module.type;
  const validCategories = moduleTypeToCategories[type] || [];
  
  // 过滤掉当前模块类型不支持的子类别
  module.courseCategories = module.courseCategories.filter((category: string) => 
    validCategories.includes(category)
  );
  
  // 如果没有子类别或所有子类别都被过滤掉了，尝试添加默认子类别
  if (module.courseCategories.length === 0 && validCategories.length > 0) {
    // 可以选择添加一个默认的子类别
    module.courseCategories = [validCategories[0]];
  }
};

// 统计表格列定义
const statColumns = [
  {
    colKey: 'minCredits',
    title: '最低学分总和',
    width: '16.66%',
  },
  {
    colKey: 'maxCredits',
    title: '最高学分总和',
    width: '16.66%',
  },
  {
    colKey: 'recommendedCredits',
    title: '建议学分总和',
    width: '16.66%',
  },
  {
    colKey: 'requiredCourses',
    title: '必修课程总数',
    width: '16.66%',
  },
  {
    colKey: 'electiveCourses',
    title: '选修课程总数',
    width: '16.66%',
  },
  {
    colKey: 'totalCourses',
    title: '课程总数',
    width: '16.66%',
  }
];

// 使用计算属性动态更新统计表格数据
const statData = computed((): TableRowData[] => [{
  id: 'total-row',
  minCredits: calculateTotalCredits('minCredits'),
  maxCredits: calculateTotalCredits('maxCredits'),
  recommendedCredits: calculateTotalCredits('recommendedCredits'),
  requiredCourses: calculateTotalCourses('requiredCourseCount'),
  electiveCourses: calculateTotalCourses('electiveCourseCount'),
  totalCourses: calculateTotalCoursesAll()
}]);

// 统计表格分页设置
const pagination = null as TdPaginationProps;

// 初始空模块模板
const getEmptyModule = (): Module => ({
  id: getUniqueId(),
  name: '',
  type: '',
  required: true,
  order: 1,
  minCredits: 0,
  maxCredits: 0,
  recommendedCredits: 0,
  requiredCourseCount: 0,
  electiveCourseCount: 0,
  courseCategories: [],
  requiredCourses: [],
  electiveCourses: []
});

// 初始表单数据
const formData = reactive({
  id: '',
  name: '',
  majorType: '',
  degreeType: 'bachelor',
  isDefault: false,
  modules: [] as Module[]
});

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入模板名称', type: 'error' }],
  majorType: [{ required: true, message: '请选择模板类型', type: 'error' }],
  degreeType: [{ required: true, message: '请选择学位类型', type: 'error' }],
  'modules[].name': [{ required: true, message: '请输入模块名称', type: 'error' }],
  'modules[].type': [{ required: true, message: '请选择模块类型', type: 'error' }],
  'modules[].minCredits': [{ required: true, message: '请输入最低学分', type: 'error' }],
  'modules[].maxCredits': [{ required: true, message: '请输入最高学分', type: 'error' }],
  'modules[].recommendedCredits': [{ required: true, message: '请输入建议学分', type: 'error' }]
};

// 监听模板数据变化
watch(() => props.template, (newVal) => {
  if (newVal) {
    // 深拷贝模板数据
    formData.name = newVal.name || '';
    formData.majorType = newVal.majorType || 'engineering';
    formData.degreeType = newVal.degreeType || 'bachelor';
    formData.isDefault = newVal.isDefault || false;
    formData.modules = newVal.modules ? JSON.parse(JSON.stringify(newVal.modules)) : [];
  }
}, { immediate: true });

// 创建默认模块
const createDefaultModule = (): Module => {
  return {
    id: getUniqueId(),
    name: '',
    type: 'public_basic',
    required: true,
    order: formData.modules.length + 1,
    minCredits: 0,
    maxCredits: 0,
    recommendedCredits: 0,
    requiredCourseCount: 0,
    electiveCourseCount: 0,
    courseCategories: [],
    requiredCourses: [],
    electiveCourses: []
  };
};

// 添加模块
const addModule = () => {
  formData.modules.push(createDefaultModule());
};

// 移除模块
const removeModule = (index: number) => {
  formData.modules.splice(index, 1);
  
  // 重新排序
  formData.modules.forEach((module, idx) => {
    module.order = idx + 1;
  });
};

// 上移模块
const moveModuleUp = (index: number) => {
  if (index === 0) return;
  
  const temp = formData.modules[index];
  formData.modules[index] = formData.modules[index - 1];
  formData.modules[index - 1] = temp;
  
  // 更新排序
  formData.modules[index].order = index + 1;
  formData.modules[index - 1].order = index;
};

// 下移模块
const moveModuleDown = (index: number) => {
  if (index === formData.modules.length - 1) return;
  
  const temp = formData.modules[index];
  formData.modules[index] = formData.modules[index + 1];
  formData.modules[index + 1] = temp;
  
  // 更新排序
  formData.modules[index].order = index + 1;
  formData.modules[index + 1].order = index + 2;
};

// 重置表单
const onReset = () => {
  formData.id = '';
  formData.name = '';
  formData.majorType = '';
  formData.degreeType = 'bachelor';
  formData.isDefault = false;
  formData.modules = [];
};

// 表单提交
const onSubmit = async (context: SubmitContext) => {
  if (context.validateResult === true) {
    // 组装提交数据
    const submitData = {
      id: props.mode === 'edit' && props.template?.id ? props.template.id : '',
      name: formData.name,
      majorType: formData.majorType,
      degreeType: formData.degreeType,
      isDefault: formData.isDefault,
      modules: formData.modules
    };
    
    // 调用父组件提交方法
    emit('submit', submitData);
  } else {
    console.warn('表单校验失败:', context.firstError);
    MessagePlugin.warning(context.firstError?.toString() || '表单校验失败');
  }
};

// 添加计算总学分的函数
const calculateTotalCredits = (creditType: 'minCredits' | 'maxCredits' | 'recommendedCredits') => {
  if (!formData.modules || formData.modules.length === 0) {
    return 0;
  }
  
  const total = formData.modules.reduce((sum, module) => {
    return sum + (Number(module[creditType]) || 0);
  }, 0);
  
  return total.toFixed(1);
};

// 计算总课程数
const calculateTotalCourses = (countType: 'requiredCourseCount' | 'electiveCourseCount') => {
  if (!formData.modules || formData.modules.length === 0) {
    return 0;
  }
  
  const total = formData.modules.reduce((sum, module) => {
    return sum + (Number(module[countType]) || 0);
  }, 0);
  
  return total;
};

// 计算所有课程总数
const calculateTotalCoursesAll = () => {
  if (!formData.modules || formData.modules.length === 0) {
    return 0;
  }
  
  const total = formData.modules.reduce((sum, module) => {
    const required = Number(module.requiredCourseCount) || 0;
    const elective = Number(module.electiveCourseCount) || 0;
    return sum + required + elective;
  }, 0);
  
  return total;
};

// 组件挂载时初始化
onMounted(() => {
  initForm();
  fetchModuleTypes(); // 获取模块类型
});

// 表单初始化
const initForm = () => {
  if (!props.template && props.mode === 'create') {
    // 新建模式，初始化一些默认值
    addModule();
  }
};

// 课程表格列定义
const courseColumns = [
  { colKey: 'moduleType', title: '模块类型', width: '12%' },
  { colKey: 'moduleSubcategory', title: '模块子类别', width: '12%' },
  { colKey: 'code', title: '课程代码', width: '10%' },
  { colKey: 'name', title: '课程名称', width: '15%' },
  { colKey: 'required', title: '课程性质', width: '8%' },
  { colKey: 'credits', title: '学分', width: '6%' },
  { colKey: 'hours', title: '学时', width: '8%', edit: { component: 't-input-number' } },
  { colKey: 'semester', title: '学年学期', width: '12%' },
  { colKey: 'operation', title: '操作', width: '9%' }
];

// 学期选项
const semesterOptions = [
  { value: '1-1', label: '第一学年第一学期' },
  { value: '1-2', label: '第一学年第二学期' },
  { value: '2-1', label: '第二学年第一学期' },
  { value: '2-2', label: '第二学年第二学期' },
  { value: '3-1', label: '第三学年第一学期' },
  { value: '3-2', label: '第三学年第二学期' },
  { value: '4-1', label: '第四学年第一学期' },
  { value: '4-2', label: '第四学年第二学期' },
];

// 当前活动的课程标签页
const courseTabs = ref('required');

// 课程类别对话框相关
const showCategoryCoursesDialog = ref(false);
const currentModuleIndex = ref(0);
const categoryCoursesDialogLoading = ref(false);
const categoryCoursesData = ref<Course[]>([]);
const selectedCategoryCoursesIds = ref<string[]>([]);

// 课程库对话框相关
const showCourseLibraryDialog = ref(false);
const courseLibraryData = ref<Course[]>([]);
const courseLibraryLoading = ref(false);
const selectedCourseLibraryIds = ref<string[]>([]);

// 课程库搜索关键词
const courseSearchKeyword = ref('');

// 对话框中的课程表格列定义
const dialogCourseColumns = [
  { colKey: 'row-select', type: 'multiple' as const, width: 50 },
  { colKey: 'code', title: '课程代码', width: 100 },
  { colKey: 'name', title: '课程名称', width: 160 },
  { colKey: 'credits', title: '学分', width: 60 },
  { colKey: 'hours', title: '学时', width: 60 },
  { colKey: 'property', title: '课程性质', width: 100 }
];

// 选择的模块子类别
const selectedSubcategory = ref('');

// 获取当前模块可用的子类别选项
const getCurrentModuleSubcategoryOptions = () => {
  const moduleIndex = currentModuleIndex.value;
  if (moduleIndex < 0 || moduleIndex >= formData.modules.length) {
    return [];
  }
  
  const module = formData.modules[moduleIndex];
  const validCategories = moduleTypeToCategories[module.type] || [];
  
  return validCategories.map(category => ({
    label: category,
    value: category
  }));
};

// 过滤后的课程库数据
const filteredCourseLibraryData = computed(() => {
  if (!courseSearchKeyword.value) {
    return courseLibraryData.value;
  }
  
  const keyword = courseSearchKeyword.value.toLowerCase();
  return courseLibraryData.value.filter(course => 
    course.name.toLowerCase().includes(keyword) || 
    course.code.toLowerCase().includes(keyword)
  );
});

// 打开模块类别课程对话框
const openCategoryCoursesDialog = (moduleIndex: number) => {
  currentModuleIndex.value = moduleIndex;
  const module = formData.modules[moduleIndex];
  
  // 应该从服务器加载对应类别的课程，这里使用模拟数据
  categoryCoursesDialogLoading.value = true;
  setTimeout(() => {
    // 模拟数据
    categoryCoursesData.value = generateMockCourses(module.courseCategories);
    categoryCoursesDialogLoading.value = false;
  }, 500);
  
  selectedCategoryCoursesIds.value = [];
  showCategoryCoursesDialog.value = true;
};

// 打开课程库对话框
const openCourseLibraryDialog = (moduleIndex: number) => {
  currentModuleIndex.value = moduleIndex;
  
  // 从课程库加载课程，这里使用模拟数据
  courseLibraryLoading.value = true;
  setTimeout(() => {
    // 模拟所有课程库数据
    courseLibraryData.value = generateMockCourses(['all']);
    courseLibraryLoading.value = false;
  }, 500);
  
  selectedCourseLibraryIds.value = [];
  selectedSubcategory.value = ''; // 重置子类别选择
  showCourseLibraryDialog.value = true;
};

// 修改从模块类别添加选中的课程
const addSelectedCategoryCourses = () => {
  if (selectedCategoryCoursesIds.value.length === 0) {
    MessagePlugin.warning('请至少选择一门课程');
    return;
  }
  
  const moduleIndex = currentModuleIndex.value;
  const module = formData.modules[moduleIndex];
  
  // 获取选中的课程
  const selectedCourses = categoryCoursesData.value.filter(
    course => selectedCategoryCoursesIds.value.includes(course.id)
  );
  
  // 初始化课程数组
  if (!module.requiredCourses) module.requiredCourses = [];
  if (!module.electiveCourses) module.electiveCourses = [];
  
  // 添加课程到对应列表
  for (const course of selectedCourses) {
    // 根据课程列表中已指定的课程性质决定是必修还是选修
    const isRequired = course.property === 'required';
    
    // 避免重复添加
    const targetList = isRequired ? module.requiredCourses : module.electiveCourses;
    const existingIndex = targetList.findIndex(c => c.id === course.id);
    
    if (existingIndex === -1) {
      // 为模块类别课程，使用课程的category作为moduleSubcategory
      const moduleSubcategory = course.category || 
        (module.courseCategories.length > 0 ? module.courseCategories[0] : '');
      
      targetList.push({
        ...course,
        required: isRequired,
        semester: '1-1', // 默认为第一学年第一学期
        moduleType: module.type, // 添加模块类型
        moduleSubcategory: moduleSubcategory, // 使用课程类别作为模块子类别
        hours: course.hours || course.credits * 16 // 设置默认学时
      });
    }
  }
  
  // 更新课程计数
  updateCourseCount(moduleIndex);
  
  // 关闭对话框
  showCategoryCoursesDialog.value = false;
  MessagePlugin.success(`成功添加${selectedCourses.length}门课程`);
};

// 修改从课程库添加选中的课程
const addSelectedLibraryCourses = () => {
  if (selectedCourseLibraryIds.value.length === 0) {
    MessagePlugin.warning('请至少选择一门课程');
    return;
  }
  
  const moduleIndex = currentModuleIndex.value;
  const module = formData.modules[moduleIndex];
  
  // 获取选中的课程
  const selectedCourses = courseLibraryData.value.filter(
    course => selectedCourseLibraryIds.value.includes(course.id)
  );
  
  // 初始化课程数组
  if (!module.requiredCourses) module.requiredCourses = [];
  if (!module.electiveCourses) module.electiveCourses = [];
  
  // 添加课程到对应列表
  for (const course of selectedCourses) {
    // 根据课程列表中已指定的课程性质决定是必修还是选修
    const isRequired = course.property === 'required';
    
    // 避免重复添加
    const targetList = isRequired ? module.requiredCourses : module.electiveCourses;
    const existingIndex = targetList.findIndex(c => c.id === course.id);
    
    if (existingIndex === -1) {
      // 使用选择的子类别，如果未选择则使用默认值
      const moduleSubcategory = selectedSubcategory.value || 
        (module.courseCategories.length > 0 ? module.courseCategories[0] : '');
      
      targetList.push({
        ...course,
        required: isRequired,
        semester: '1-1', // 默认为第一学年第一学期
        moduleType: module.type, // 添加模块类型
        moduleSubcategory: moduleSubcategory, // 使用选择的模块子类别
        hours: course.hours || course.credits * 16 // 设置默认学时
      });
    }
  }
  
  // 更新课程计数
  updateCourseCount(moduleIndex);
  
  // 重置选择的子类别
  selectedSubcategory.value = '';
  
  // 关闭对话框
  showCourseLibraryDialog.value = false;
  MessagePlugin.success(`成功添加${selectedCourses.length}门课程`);
};

// 生成模拟课程数据
const generateMockCourses = (categories: string[]): Course[] => {
  const result: Course[] = [];
  
  // 如果是"all"类别，返回所有可能类别的课程
  if (categories.includes('all')) {
    return generateMockCourses(Object.values(moduleTypeToCategories).flat());
  }
  
  // 根据传入的类别生成课程
  for (const category of categories) {
    // 每个类别生成3-5门课程
    const count = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < count; i++) {
      // 生成随机课程代码
      const codePrefix = category.length > 0 ? category.substring(0, 2).toUpperCase() : 'XX';
      const codeNumber = Math.floor(Math.random() * 9000) + 1000;
      const credits = Math.floor(Math.random() * 3) + 1; // 1-3学分
      const hours = credits * 16; // 默认学时为学分的16倍
      // 随机决定课程性质
      const property = Math.random() > 0.5 ? 'required' : 'elective';
      
      result.push({
        id: getUniqueId(),
        code: `${codePrefix}${codeNumber}`,
        name: `${category}课程${i + 1}`,
        credits: credits,
        category: category,
        hours: hours,
        property: property
      });
    }
  }
  
  return result;
};

// 更新课程学期
const updateCourseSemester = (moduleIndex: number, courseId: string, semester: any, isRequired: boolean) => {
  const module = formData.modules[moduleIndex];
  const courseList = isRequired ? module.requiredCourses : module.electiveCourses;
  
  if (courseList) {
    const courseIndex = courseList.findIndex(c => c.id === courseId);
    if (courseIndex !== -1 && semester !== undefined) {
      courseList[courseIndex].semester = String(semester);
    }
  }
};

// 移除课程
const removeCourse = (moduleIndex: number, courseId: string, isRequired: boolean) => {
  const module = formData.modules[moduleIndex];
  const courseList = isRequired ? module.requiredCourses : module.electiveCourses;
  
  if (courseList) {
    const courseIndex = courseList.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      courseList.splice(courseIndex, 1);
      
      // 更新课程计数
      updateCourseCount(moduleIndex);
    }
  }
};

// 更新课程计数
const updateCourseCount = (moduleIndex: number) => {
  const module = formData.modules[moduleIndex];
  
  // 更新必修课程计数
  module.requiredCourseCount = module.requiredCourses ? module.requiredCourses.length : 0;
  
  // 更新选修课程计数
  module.electiveCourseCount = module.electiveCourses ? module.electiveCourses.length : 0;
};

// 获取模块内所有课程（合并必修和选修）
const getAllCourses = (module: Module): Course[] => {
  const allCourses: Course[] = [];
  
  if (module.requiredCourses) {
    allCourses.push(...module.requiredCourses);
  }
  
  if (module.electiveCourses) {
    allCourses.push(...module.electiveCourses);
  }
  
  // 根据模块子类别排序
  allCourses.sort((a, b) => {
    // 首先按模块子类别排序
    const subcategoryA = (a.moduleSubcategory || '') as string;
    const subcategoryB = (b.moduleSubcategory || '') as string;
    
    if (subcategoryA !== subcategoryB) {
      return subcategoryA.localeCompare(subcategoryB);
    }
    
    // 其次按课程性质排序（必修在前，选修在后）
    if (a.required !== b.required) {
      return a.required ? -1 : 1;
    }
    
    // 最后按课程名称排序
    return ((a.name || '') as string).localeCompare((b.name || '') as string);
  });
  
  return allCourses;
};

// 获取模块类型名称
const getModuleTypeName = (typeValue: string): string => {
  const moduleTypeMap: Record<string, string> = {
    'public_basic': '公共基础类',
    'discipline_basic': '学科基础类',
    'professional_core': '专业核心类',
    'professional_elective': '专业选修类',
    'general_education': '通识教育类',
    'practice': '实践教学类',
    'engineering_practice': '工程实践类',
    'research': '科研方法类',
    'artistic_expression': '艺术表达类',
    'business_practice': '商业实践类'
  };
  
  return moduleTypeMap[typeValue] || typeValue;
};

// 获取模块子类别文本
const getModuleCategoryText = (module: Module): string => {
  if (!module.courseCategories || module.courseCategories.length === 0) {
    return '-';
  }
  
  if (module.courseCategories.length <= 2) {
    return module.courseCategories.join('、');
  }
  
  return `${module.courseCategories[0]}、${module.courseCategories[1]}等${module.courseCategories.length}个`;
};

// 获取单个课程的模块子类别
const getCourseSubcategory = (course: Course): string => {
  return course.moduleSubcategory || '-';
};

// 处理表格单元格点击
const onCellClick = (context: any) => {
  const { col } = context;
  // 只有学时列支持直接点击编辑
  if (col.colKey === 'hours') {
    // 自动触发编辑
  }
};

// 处理表格编辑
const onEdit = (context: any) => {
  const { row, col, value } = context;
  
  // 只处理学时列的编辑
  if (col.colKey === 'hours') {
    // 验证输入是否为正数
    if (typeof value === 'number' && value >= 0) {
      // 更新学时
      updateCourseHours(row, value);
      return true;
    } else {
      MessagePlugin.warning('学时必须是非负数');
      return false;
    }
  }
  
  return true;
};

// 更新课程学时
const updateCourseHours = (course: Course, hours: number) => {
  const modules = formData.modules;
  
  // 遍历所有模块查找课程
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    
    // 检查必修课程
    if (module.requiredCourses) {
      const courseIndex = module.requiredCourses.findIndex(c => c.id === course.id);
      if (courseIndex !== -1) {
        module.requiredCourses[courseIndex].hours = hours;
        return;
      }
    }
    
    // 检查选修课程
    if (module.electiveCourses) {
      const courseIndex = module.electiveCourses.findIndex(c => c.id === course.id);
      if (courseIndex !== -1) {
        module.electiveCourses[courseIndex].hours = hours;
        return;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.curriculum-system-form {
  .mb-4 {
    margin-bottom: 16px;
  }
  
  .mb-2 {
    margin-bottom: 8px;
  }
  
  .credit-summary {
    margin-bottom: 20px;
    
    :deep(.t-table) {
      .t-table__header {
        th {
          background-color: var(--td-brand-color-light);
          padding: 6px;
          font-size: 13px;
          text-align: center;
        }
      }
      
      .t-table__body {
        td {
          padding: 6px;
          font-size: 16px;
          font-weight: 600;
          text-align: center;
          background-color: var(--td-bg-color-container);
        }
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }
  
  .module-form-item {
    margin-bottom: 16px;
  }
  
  .module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .module-title {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
  }
  
  .module-actions {
    display: flex;
    gap: 8px;
  }
  
  .empty-modules {
    padding: 32px 0;
  }
  
  .module-row {
    padding-left: 16px;
  }
}

// 课程选择对话框样式
.course-select-dialog {
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--td-border-level-1-color);
  }
  
  :deep(.t-table) {
    .t-table__row--selected {
      background-color: var(--td-brand-color-light-hover);
    }
  }
}

// 课程类型选择对话框样式
.course-type-dialog {
  .course-type-options {
    margin-bottom: 16px;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--td-border-level-1-color);
  }
}
</style> 