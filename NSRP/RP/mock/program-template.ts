import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';

// 定义课程体系模板接口
interface CurriculumSystemTemplate {
  id: string;
  name: string;
  description: string;
  majorType: string;
  degreeType: string;
  isDefault: boolean;
  modules: CurriculumModule[];
  creditRequirements: CreditRequirement[];
  createTime: string;
  updateTime: string;
  createdBy: string;
  updatedBy: string;
}

// 定义课程体系模块接口
interface CurriculumModule {
  id: string;
  name: string;
  description: string;
  type: string;
  required: boolean;
  order: number;
  minCredits: number;
  maxCredits: number;
  recommendedCredits: number;
  courseCategories: string[];
  requiredCourses?: Course[];
  electiveCourses?: Course[];
}

// 定义课程接口
interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  hours: number;
  required: boolean;
  semester?: string;
  moduleType?: string;
  moduleSubcategory?: string;
}

// 定义学分要求接口
interface CreditRequirement {
  id: string;
  category: string;
  minCredits: number;
  maxCredits: number;
  recommendedCredits: number;
  requiredCourseCount: number;
  electiveCourseCount: number;
  description: string;
}

// 生成模拟课程数据
const generateModuleCourses = (moduleType: string, courseCategories: string[]): { requiredCourses: Course[], electiveCourses: Course[] } => {
  const requiredCourses: Course[] = [];
  const electiveCourses: Course[] = [];
  
  // 为每个课程类别生成课程
  courseCategories.forEach((category, categoryIndex) => {
    // 生成必修课程
    for (let i = 0; i < 2; i++) {
      const courseId = `${moduleType}_req_${category}_${i}`;
      const coursePrefix = category.substring(0, 2).toUpperCase();
      const courseNumber = 1000 + (categoryIndex * 100) + i;
      
      requiredCourses.push({
        id: courseId,
        code: `${coursePrefix}${courseNumber}`,
        name: `${category}必修课程${i + 1}`,
        credits: 2 + (i % 2), // 2-3学分
        hours: (2 + (i % 2)) * 16, // 学时 = 学分 * 16
        required: true,
        semester: `${1 + Math.floor(i / 2)}-${1 + (i % 2)}`, // 学期安排
        moduleType: moduleType,
        moduleSubcategory: category
      });
    }
    
    // 生成选修课程
    for (let i = 0; i < 1; i++) {
      const courseId = `${moduleType}_elec_${category}_${i}`;
      const coursePrefix = category.substring(0, 2).toUpperCase();
      const courseNumber = 2000 + (categoryIndex * 100) + i;
      
      electiveCourses.push({
        id: courseId,
        code: `${coursePrefix}${courseNumber}`,
        name: `${category}选修课程${i + 1}`,
        credits: 1 + (i % 2), // 1-2学分
        hours: (1 + (i % 2)) * 16, // 学时 = 学分 * 16
        required: false,
        semester: `${2 + Math.floor(i / 2)}-${1 + (i % 2)}`, // 学期安排
        moduleType: moduleType,
        moduleSubcategory: category
      });
    }
  });
  
  return { requiredCourses, electiveCourses };
};

// 生成课程体系模块数据
const generateCurriculumModules = (templateType: string): CurriculumModule[] => {
  const baseModules: CurriculumModule[] = [
    {
      id: 'module_public_basic',
      name: '公共基础课程模块',
      description: '包含思政、英语、体育等公共课程',
      type: 'public_basic',
      required: true,
      order: 1,
      minCredits: 35,
      maxCredits: 45,
      recommendedCredits: 40,
      courseCategories: ['思想政治', '大学英语', '体育', '计算机基础', '高等数学'],
      ...generateModuleCourses('public_basic', ['思想政治', '大学英语', '体育', '计算机基础', '高等数学'])
    },
    {
      id: 'module_discipline_basic',
      name: '学科基础课程模块',
      description: '包含该学科领域基础理论和技能的课程',
      type: 'discipline_basic',
      required: true,
      order: 2,
      minCredits: 25,
      maxCredits: 35,
      recommendedCredits: 30,
      courseCategories: ['学科基础', '专业基础'],
      ...generateModuleCourses('discipline_basic', ['学科基础', '专业基础'])
    },
    {
      id: 'module_professional_core',
      name: '专业核心课程模块',
      description: '包含该专业核心理论和技能的课程',
      type: 'professional_core',
      required: true,
      order: 3,
      minCredits: 20,
      maxCredits: 30,
      recommendedCredits: 25,
      courseCategories: ['专业核心'],
      ...generateModuleCourses('professional_core', ['专业核心'])
    },
    {
      id: 'module_professional_elective',
      name: '专业选修课程模块',
      description: '拓展专业知识面的选修课程',
      type: 'professional_elective',
      required: true,
      order: 4,
      minCredits: 15,
      maxCredits: 25,
      recommendedCredits: 20,
      courseCategories: ['专业选修'],
      ...generateModuleCourses('professional_elective', ['专业选修'])
    },
    {
      id: 'module_general_education',
      name: '通识教育课程模块',
      description: '培养学生综合素质的通识课程',
      type: 'general_education',
      required: true,
      order: 5,
      minCredits: 10,
      maxCredits: 20,
      recommendedCredits: 15,
      courseCategories: ['人文社科', '自然科学', '艺术鉴赏', '创新创业'],
      ...generateModuleCourses('general_education', ['人文社科', '自然科学', '艺术鉴赏', '创新创业'])
    },
    {
      id: 'module_practice',
      name: '实践教学模块',
      description: '各类实验、实习、实训等实践课程',
      type: 'practice',
      required: true,
      order: 6,
      minCredits: 20,
      maxCredits: 30,
      recommendedCredits: 25,
      courseCategories: ['实验', '实习', '实训', '毕业设计'],
      ...generateModuleCourses('practice', ['实验', '实习', '实训', '毕业设计'])
    }
  ];

  // 根据不同类型的模板添加特定模块
  switch (templateType) {
    case 'engineering':
      return [
        ...baseModules,
        {
          id: 'module_engineering_practice',
          name: '工程实践强化模块',
          description: '强化工程实践能力的课程和项目',
          type: 'engineering_practice',
          required: true,
          order: 7,
          minCredits: 10,
          maxCredits: 15,
          recommendedCredits: 12,
          courseCategories: ['工程实践', '工程训练', '工程项目'],
          ...generateModuleCourses('engineering_practice', ['工程实践', '工程训练', '工程项目'])
        }
      ];
    case 'science':
      return [
        ...baseModules,
        {
          id: 'module_research_methodology',
          name: '科研方法模块',
          description: '科学研究方法和科研能力培养课程',
          type: 'research',
          required: true,
          order: 7,
          minCredits: 8,
          maxCredits: 12,
          recommendedCredits: 10,
          courseCategories: ['科研方法', '学术写作', '科学实验'],
          ...generateModuleCourses('research', ['科研方法', '学术写作', '科学实验'])
        }
      ];
    case 'arts':
      return [
        ...baseModules,
        {
          id: 'module_artistic_expression',
          name: '艺术表达模块',
          description: '艺术表达和审美能力培养课程',
          type: 'artistic_expression',
          required: true,
          order: 7,
          minCredits: 8,
          maxCredits: 15,
          recommendedCredits: 12,
          courseCategories: ['艺术表达', '设计实践', '作品展示'],
          ...generateModuleCourses('artistic_expression', ['艺术表达', '设计实践', '作品展示'])
        }
      ];
    case 'economics_management':
      return [
        ...baseModules,
        {
          id: 'module_business_practice',
          name: '商业实践模块',
          description: '商业实践和管理能力培养课程',
          type: 'business_practice',
          required: true,
          order: 7,
          minCredits: 10,
          maxCredits: 15,
          recommendedCredits: 12,
          courseCategories: ['商业案例', '创业实践', '管理能力'],
          ...generateModuleCourses('business_practice', ['商业案例', '创业实践', '管理能力'])
        }
      ];
    default:
      return baseModules;
  }
};

// 生成学分要求数据
const generateCreditRequirements = (templateType: string): CreditRequirement[] => {
  const baseRequirements: CreditRequirement[] = [
    {
      id: 'credit_req_total',
      category: '总学分要求',
      minCredits: 135,
      maxCredits: 170,
      recommendedCredits: 155,
      requiredCourseCount: 30,
      electiveCourseCount: 15,
      description: '毕业所需的最低总学分要求'
    },
    {
      id: 'credit_req_required',
      category: '必修课学分要求',
      minCredits: 90,
      maxCredits: 120,
      recommendedCredits: 105,
      requiredCourseCount: 30,
      electiveCourseCount: 0,
      description: '必修课程的学分要求'
    },
    {
      id: 'credit_req_elective',
      category: '选修课学分要求',
      minCredits: 35,
      maxCredits: 60,
      recommendedCredits: 50,
      requiredCourseCount: 0,
      electiveCourseCount: 15,
      description: '选修课程的学分要求'
    },
    {
      id: 'credit_req_theory',
      category: '理论课学分要求',
      minCredits: 85,
      maxCredits: 110,
      recommendedCredits: 95,
      requiredCourseCount: 20,
      electiveCourseCount: 10,
      description: '理论课程的学分要求'
    },
    {
      id: 'credit_req_practice',
      category: '实践课学分要求',
      minCredits: 40,
      maxCredits: 70,
      recommendedCredits: 60,
      requiredCourseCount: 10,
      electiveCourseCount: 5,
      description: '实践课程的学分要求'
    }
  ];

  // 根据不同类型模板添加特定学分要求
  switch (templateType) {
    case 'engineering':
      return [
        ...baseRequirements,
        {
          id: 'credit_req_engineering',
          category: '工程实践学分要求',
          minCredits: 15,
          maxCredits: 25,
          recommendedCredits: 20,
          requiredCourseCount: 5,
          electiveCourseCount: 2,
          description: '工程实践课程的学分要求'
        }
      ];
    case 'science':
      return [
        ...baseRequirements,
        {
          id: 'credit_req_research',
          category: '科研学分要求',
          minCredits: 10,
          maxCredits: 20,
          recommendedCredits: 15,
          requiredCourseCount: 3,
          electiveCourseCount: 2,
          description: '科研相关课程的学分要求'
        }
      ];
    default:
      return baseRequirements;
  }
};

// 生成课程体系模板数据
const templateList: CurriculumSystemTemplate[] = [
  {
    id: '1',
    name: '工科类专业课程体系标准模板',
    description: '适用于计算机、自动化、机械等工科类专业的课程体系模板',
    majorType: 'engineering',
    degreeType: 'bachelor',
    isDefault: true,
    modules: generateCurriculumModules('engineering'),
    creditRequirements: generateCreditRequirements('engineering'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    name: '理科类专业课程体系标准模板',
    description: '适用于数学、物理、化学等理科类专业的课程体系模板',
    majorType: 'science',
    degreeType: 'bachelor',
    isDefault: false,
    modules: generateCurriculumModules('science'),
    creditRequirements: generateCreditRequirements('science'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    name: '文科类专业课程体系标准模板',
    description: '适用于文学、历史、哲学等文科类专业的课程体系模板',
    majorType: 'arts',
    degreeType: 'bachelor',
    isDefault: false,
    modules: generateCurriculumModules('arts'),
    creditRequirements: generateCreditRequirements('arts'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '4',
    name: '经管类专业课程体系标准模板',
    description: '适用于经济学、管理学等经管类专业的课程体系模板',
    majorType: 'economics_management',
    degreeType: 'bachelor',
    isDefault: false,
    modules: generateCurriculumModules('economics_management'),
    creditRequirements: generateCreditRequirements('economics_management'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

export default [
  // 获取课程体系模板列表
  {
    url: '/api/program/template/list',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { name = '', majorType = '', pageSize = 10, pageIndex = 1 } = query;
      
      let filteredList = [...templateList];
      
      // 筛选
      if (name) {
        filteredList = filteredList.filter(item => item.name.includes(name));
      }
      if (majorType) {
        filteredList = filteredList.filter(item => item.majorType === majorType);
      }
      
      // 分页
      const start = (pageIndex - 1) * pageSize;
      const end = pageIndex * pageSize;
      const list = filteredList.slice(start, end);
      
      return {
        code: 0,
        data: {
          list,
          total: filteredList.length,
        },
        message: 'ok',
      };
    },
  },
  
  // 获取课程体系模板详情
  {
    url: '/api/program/template/detail/:id',
    method: 'get',
    response: ({ query, params }: { query: any, params?: { id: string } }) => {
      // 检查params是否存在
      if (!params) {
        return {
          code: 1,
          data: null,
          message: '参数错误：缺少ID',
        };
      }
      
      const { id } = params;
      const template = templateList.find(item => item.id === id);
      
      if (!template) {
        return {
          code: 1,
          data: null,
          message: '找不到该模板',
        };
      }
      
      return {
        code: 0,
        data: template,
        message: 'ok',
      };
    },
  },
  
  // 创建课程体系模板
  {
    url: '/api/program/template/create',
    method: 'post',
    response: ({ body }: { body: Partial<CurriculumSystemTemplate> }) => {
      const { name } = body;
      
      // 检查是否存在同名模板
      const existingTemplate = templateList.find(item => item.name === name);
      if (existingTemplate) {
        return {
          code: 1,
          data: null,
          message: '已存在同名模板',
        };
      }
      
      // 生成新模板
      const newTemplate: CurriculumSystemTemplate = {
        id: String(templateList.length + 1),
        name: body.name || '新建课程体系模板',
        description: body.description || '',
        majorType: body.majorType || 'engineering',
        degreeType: body.degreeType || 'bachelor',
        isDefault: body.isDefault || false,
        modules: body.modules || generateCurriculumModules(body.majorType || 'engineering'),
        creditRequirements: body.creditRequirements || generateCreditRequirements(body.majorType || 'engineering'),
        createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        createdBy: 'admin',
        updatedBy: 'admin'
      };
      
      templateList.push(newTemplate);
      
      return {
        code: 0,
        data: newTemplate,
        message: 'ok',
      };
    },
  },
  
  // 更新课程体系模板
  {
    url: '/api/program/template/update/:id',
    method: 'put',
    response: ({ params, body }: { params?: { id: string }, body: Partial<CurriculumSystemTemplate> }) => {
      // 检查params是否存在
      if (!params) {
        return {
          code: 1,
          data: null,
          message: '参数错误：缺少ID',
        };
      }
      
      const { id } = params;
      const templateIndex = templateList.findIndex(item => item.id === id);
      
      if (templateIndex === -1) {
        return {
          code: 1,
          data: null,
          message: '找不到该模板',
        };
      }
      
      // 更新模板
      const updatedTemplate = {
        ...templateList[templateIndex],
        ...body,
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updatedBy: 'admin'
      };
      
      templateList[templateIndex] = updatedTemplate;
      
      return {
        code: 0,
        data: updatedTemplate,
        message: 'ok',
      };
    },
  },
  
  // 删除课程体系模板
  {
    url: '/api/program/template/delete/:id',
    method: 'delete',
    response: ({ params }: { params?: { id: string } }) => {
      // 检查params是否存在
      if (!params) {
        return {
          code: 1,
          data: null,
          message: '参数错误：缺少ID',
        };
      }
      
      const { id } = params;
      const templateIndex = templateList.findIndex(item => item.id === id);
      
      if (templateIndex === -1) {
        return {
          code: 1,
          data: null,
          message: '找不到该模板',
        };
      }
      
      // 检查是否为默认模板
      if (templateList[templateIndex].isDefault) {
        return {
          code: 1,
          data: null,
          message: '默认模板不能删除',
        };
      }
      
      // 删除模板
      templateList.splice(templateIndex, 1);
      
      return {
        code: 0,
        data: null,
        message: 'ok',
      };
    },
  },
  
  // 设置默认课程体系模板
  {
    url: '/api/program/template/set-default/:id',
    method: 'put',
    response: ({ params }: { params?: { id: string } }) => {
      // 检查params是否存在
      if (!params) {
        return {
          code: 1,
          data: null,
          message: '参数错误：缺少ID',
        };
      }
      
      const { id } = params;
      const templateIndex = templateList.findIndex(item => item.id === id);
      
      if (templateIndex === -1) {
        return {
          code: 1,
          data: null,
          message: '找不到该模板',
        };
      }
      
      // 重置所有模板的默认状态
      templateList.forEach(item => {
        item.isDefault = false;
      });
      
      // 设置新的默认模板
      templateList[templateIndex].isDefault = true;
      templateList[templateIndex].updateTime = Mock.Random.datetime('yyyy-MM-dd HH:mm:ss');
      
      return {
        code: 0,
        data: templateList[templateIndex],
        message: 'ok',
      };
    },
  }
] as MockMethod[]; 