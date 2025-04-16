<template>
  <div class="system-preview">
    <div class="system-preview__header">
      <h2 class="system-preview__title">{{ template.name }}</h2>
      <div class="system-preview__info">
        <t-tag v-if="template.isDefault" theme="success" variant="light">默认模板</t-tag>
        <t-tag theme="primary" variant="light">{{ getMajorTypeText(template.majorType) }}</t-tag>
        <t-tag theme="warning" variant="light">{{ getDegreeTypeText(template.degreeType) }}</t-tag>
      </div>
    </div>

    <div class="system-preview__content">
      <t-tabs default-value="modules" class="preview-tabs">
        <t-tab-panel value="modules" label="课程体系模块">
          <div class="modules-preview">
            <t-card v-for="module in template.modules" :key="module.id" :title="module.name" bordered class="module-card">
              <div class="module-info">
                <div class="module-info__item">
                  <span class="module-info__label">模块类型：</span>
                  <span class="module-info__value">{{ getModuleTypeText(module.type) }}</span>
                </div>
                <div class="module-info__item">
                  <span class="module-info__label">学分要求：</span>
                  <span class="module-info__value">{{ module.minCredits }}-{{ module.maxCredits }} 学分 (建议 {{ module.recommendedCredits }} 学分)</span>
                </div>
                <div class="module-info__item module-info__item--full">
                  <span class="module-info__label">关联模块子类别：</span>
                  <div class="module-categories">
                    <t-tag v-for="(category, index) in module.courseCategories" :key="index" theme="default" variant="light" size="small">
                      {{ category }}
                    </t-tag>
                  </div>
                </div>
              </div>
            </t-card>
          </div>
        </t-tab-panel>
        
        <t-tab-panel value="credits" label="学分要求">
          <div class="credits-preview">
            <t-table 
              :data="actualCreditRequirements" 
              :columns="creditColumns" 
              bordered 
              size="medium" 
              row-key="id"
              stripe
            >
              <template #credits="{ row }">
                <div class="credits-cell">
                  <div>{{ row.minCredits }}-{{ row.maxCredits }} 学分</div>
                  <div class="recommended-credits">(建议 {{ row.recommendedCredits }} 学分)</div>
                </div>
              </template>
              <template #courses="{ row }">
                <div class="courses-cell">
                  <div>必修：{{ row.requiredCourseCount }} 门</div>
                  <div>选修：{{ row.electiveCourseCount }} 门</div>
                </div>
              </template>
            </t-table>
          </div>
        </t-tab-panel>
        
        <t-tab-panel value="structure" label="体系结构图">
          <div class="structure-preview">
            <div class="structure-diagram">
              <div class="structure-header">
                <div class="structure-box structure-box--title">{{ template.name }}</div>
              </div>
              <div class="structure-body">
                <div class="structure-modules">
                  <div 
                    v-for="module in sortedModules" 
                    :key="module.id" 
                    class="structure-box structure-box--module"
                    :class="{ 'structure-box--required': module.required }"
                  >
                    <div class="structure-module__header">
                      <span class="structure-module__name">{{ module.name }}</span>
                      <span class="structure-module__credits">{{ module.recommendedCredits }}学分</span>
                    </div>
                    <div class="structure-module__categories">
                      <div 
                        v-for="(category, index) in module.courseCategories" 
                        :key="index" 
                        class="structure-box structure-box--category"
                      >
                        {{ category }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="structure-footer">
                <div class="structure-box structure-box--total">
                  总学分：{{ totalCredits }} 学分
                </div>
              </div>
            </div>
          </div>
        </t-tab-panel>

        <t-tab-panel value="courses" label="课程总览">
          <div class="courses-overview">
            <t-table 
              :data="allCoursesData" 
              :columns="courseColumns" 
              bordered 
              size="medium" 
              row-key="id"
              stripe
              :pagination="{ pageSize: 10 }"
            >
              <template #required="{ row }">
                <t-tag theme="primary" variant="light" v-if="row.required">必修</t-tag>
                <t-tag theme="warning" variant="light" v-else>选修</t-tag>
              </template>
            </t-table>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  template: {
    type: Object,
    required: true
  }
});

// 计算模块排序
const sortedModules = computed(() => {
  return [...props.template.modules].sort((a, b) => a.order - b.order);
});

// 计算总学分 - 现在按照实际课程体系统计
const totalCredits = computed(() => {
  let total = 0;
  
  props.template.modules.forEach(module => {
    // 计算必修课学分
    if (module.requiredCourses && module.requiredCourses.length > 0) {
      total += module.requiredCourses.reduce((sum, course) => sum + (course.credits || 0), 0);
    }
    
    // 如果没有课程，则使用推荐学分
    if ((!module.requiredCourses || module.requiredCourses.length === 0) && 
        (!module.electiveCourses || module.electiveCourses.length === 0)) {
      total += module.recommendedCredits || 0;
    }
  });
  
  return total.toFixed(1);
});

// 实际课程体系统计的学分要求
const actualCreditRequirements = computed(() => {
  const requirements = [];
  
  // 为每个模块创建学分要求条目
  props.template.modules.forEach(module => {
    let requiredCredits = 0;
    let requiredCourseCount = module.requiredCourses?.length || 0;
    let electiveCourseCount = module.electiveCourses?.length || 0;
    
    // 计算必修课学分总和
    if (module.requiredCourses && module.requiredCourses.length > 0) {
      requiredCredits = module.requiredCourses.reduce((sum, course) => sum + (course.credits || 0), 0);
    }
    
    // 创建学分要求条目
    requirements.push({
      id: module.id,
      category: module.name,
      minCredits: module.minCredits,
      maxCredits: module.maxCredits,
      recommendedCredits: requiredCredits || module.recommendedCredits,
      requiredCourseCount,
      electiveCourseCount
    });
  });
  
  // 添加总计
  const totalRequiredCourseCount = props.template.modules.reduce(
    (sum, module) => sum + (module.requiredCourses?.length || 0), 0
  );
  const totalElectiveCourseCount = props.template.modules.reduce(
    (sum, module) => sum + (module.electiveCourses?.length || 0), 0
  );
  
  requirements.push({
    id: 'total',
    category: '总学分要求',
    minCredits: props.template.modules.reduce((sum, module) => sum + module.minCredits, 0),
    maxCredits: props.template.modules.reduce((sum, module) => sum + module.maxCredits, 0),
    recommendedCredits: Number(totalCredits.value),
    requiredCourseCount: totalRequiredCourseCount,
    electiveCourseCount: totalElectiveCourseCount
  });
  
  return requirements;
});

// 收集所有课程用于课程总览
const allCoursesData = computed(() => {
  const allCourses = [];
  
  props.template.modules.forEach(module => {
    // 添加必修课
    if (module.requiredCourses) {
      module.requiredCourses.forEach(course => {
        allCourses.push({
          ...course,
          moduleName: module.name,
          moduleType: getModuleTypeText(module.type)
        });
      });
    }
    
    // 添加选修课
    if (module.electiveCourses) {
      module.electiveCourses.forEach(course => {
        allCourses.push({
          ...course,
          moduleName: module.name,
          moduleType: getModuleTypeText(module.type)
        });
      });
    }
  });
  
  // 按模块子类别排序
  return allCourses.sort((a, b) => {
    // 首先按模块子类别排序
    const subcategoryA = (a.moduleSubcategory || '');
    const subcategoryB = (b.moduleSubcategory || '');
    
    if (subcategoryA !== subcategoryB) {
      return subcategoryA.localeCompare(subcategoryB);
    }
    
    // 其次按课程性质排序（必修在前，选修在后）
    if (a.required !== b.required) {
      return a.required ? -1 : 1;
    }
    
    // 最后按课程名称排序
    return (a.name || '').localeCompare(b.name || '');
  });
});

// 学分要求表格列定义
const creditColumns = [
  {
    colKey: 'category',
    title: '学分类别',
    width: 180,
  },
  {
    colKey: 'credits',
    title: '学分要求',
    width: 180,
    cell: 'credits',
  },
  {
    colKey: 'courses',
    title: '课程数量',
    width: 120,
    cell: 'courses',
  }
];

// 课程总览表格列定义
const courseColumns = [
  {
    colKey: 'moduleType',
    title: '模块类型',
    width: 120,
  },
  {
    colKey: 'moduleSubcategory',
    title: '模块子类',
    width: 120,
  },
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
    colKey: 'required',
    title: '课程性质',
    width: 100,
    cell: 'required',
  },
  {
    colKey: 'credits',
    title: '学分',
    width: 80,
  },
  {
    colKey: 'hours',
    title: '学时',
    width: 80,
  },
  {
    colKey: 'semester',
    title: '学年学期',
    width: 120,
  }
];

// 专业类型文本转换
const getMajorTypeText = (type) => {
  const types = {
    engineering: '工科类',
    science: '理科类',
    arts: '文科类',
    economics_management: '经管类',
    medicine: '医学类',
    education: '教育类',
    art: '艺术类'
  };
  return types[type] || type;
};

// 学位类型文本转换
const getDegreeTypeText = (type) => {
  const types = {
    bachelor: '学士学位',
    master: '硕士学位',
    doctor: '博士学位'
  };
  return types[type] || type;
};

// 模块类型文本转换
const getModuleTypeText = (type) => {
  const types = {
    public_basic: '公共基础类',
    discipline_basic: '学科基础类',
    professional_core: '专业核心类',
    professional_elective: '专业选修类',
    general_education: '通识教育类',
    practice: '实践教学类',
    engineering_practice: '工程实践类',
    research: '科研方法类',
    artistic_expression: '艺术表达类',
    business_practice: '商业实践类'
  };
  return types[type] || type;
};
</script>

<style lang="less" scoped>
.system-preview {
  &__header {
    margin-bottom: 24px;
  }
  
  &__title {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 600;
  }
  
  &__info {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  &__content {
    min-height: 400px;
  }
}

.preview-tabs {
  margin-top: 16px;
}

.modules-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.module-card {
  height: 100%;
  
  .t-card__title {
    font-size: 15px;
    font-weight: 600;
  }
}

.module-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  &__item {
    display: flex;
    flex-direction: column;
    
    &--full {
      grid-column: span 2;
    }
  }
  
  &__label {
    font-size: 13px;
    color: var(--td-text-color-secondary);
    margin-bottom: 4px;
  }
  
  &__value {
    font-size: 14px;
    color: var(--td-text-color-primary);
  }
}

.module-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.credits-preview {
  margin-top: 16px;
}

.credits-cell {
  .recommended-credits {
    font-size: 13px;
    color: var(--td-text-color-secondary);
    margin-top: 4px;
  }
}

.courses-cell {
  line-height: 1.5;
}

.structure-preview {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.structure-diagram {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.structure-header,
.structure-footer {
  display: flex;
  justify-content: center;
}

.structure-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.structure-modules {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.structure-box {
  padding: 12px;
  border-radius: 4px;
  background-color: var(--td-bg-color-container);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  
  &--title {
    background-color: var(--td-brand-color);
    color: white;
    font-weight: 600;
    padding: 12px 24px;
    text-align: center;
    font-size: 16px;
  }
  
  &--module {
    border: 1px solid var(--td-component-stroke);
    
    &.structure-box--required {
      border-color: var(--td-brand-color-light);
      background-color: var(--td-brand-color-light-hover);
    }
  }
  
  &--category {
    margin-top: 8px;
    padding: 8px;
    font-size: 13px;
    background-color: #f7f7f7;
  }
  
  &--total {
    background-color: var(--td-success-color-1);
    color: var(--td-success-color);
    font-weight: 600;
    padding: 12px 24px;
    text-align: center;
  }
}

.structure-module {
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  &__name {
    font-weight: 600;
  }
  
  &__credits {
    color: var(--td-warning-color);
    font-weight: 500;
  }
  
  &__categories {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

/* 新增课程总览样式 */
.courses-overview {
  margin-top: 16px;
}
</style> 