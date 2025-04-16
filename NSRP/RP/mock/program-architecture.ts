import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';

// 定义架构模块接口
interface ArchitectureModule {
  id: string;
  name: string;
  description: string;
  type: string;
  required: boolean;
  order: number;
  minCredits?: number;
  maxCredits?: number;
  defaultCredits?: number;
}

// 定义架构模板接口
interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isDefault: boolean;
  modules: ArchitectureModule[];
  createTime: string;
  updateTime: string;
}

// 定义专业架构配置接口
interface ProgramArchitecture {
  id: string;
  name: string;
  description: string;
  majorCode: string;
  majorName: string;
  departmentName: string;
  templateId: string;
  modules: ArchitectureModule[];
  isActive: boolean;
  createTime: string;
  updateTime: string;
}

// 生成架构模块数据
const generateModules = (templateType: string): ArchitectureModule[] => {
  const commonModules: ArchitectureModule[] = [
    {
      id: 'module_basic_info',
      name: '专业基本信息',
      description: '包含专业代码、名称、学科门类等基本信息',
      type: 'basic_info',
      required: true,
      order: 1
    },
    {
      id: 'module_introduction',
      name: '专业简介',
      description: '对专业的基本介绍',
      type: 'introduction',
      required: true,
      order: 2
    },
    {
      id: 'module_training_objectives',
      name: '培养目标',
      description: '专业培养目标描述',
      type: 'objectives',
      required: true,
      order: 3
    },
    {
      id: 'module_training_requirements',
      name: '培养要求',
      description: '专业总体培养要求',
      type: 'requirements',
      required: true,
      order: 4
    },
    {
      id: 'module_graduation_requirements',
      name: '毕业要求及授予学位类型',
      description: '毕业生的基本要求和学位类型',
      type: 'graduation',
      required: true,
      order: 5
    },
    {
      id: 'module_core_courses',
      name: '专业核心课程',
      description: '专业核心课程列表',
      type: 'core_courses',
      required: true,
      order: 6
    },
    {
      id: 'module_practice',
      name: '主要实践教学环节',
      description: '包括实验、实习、毕业设计等实践环节',
      type: 'practice',
      required: true,
      order: 7
    },
    {
      id: 'module_curriculum',
      name: '课程体系设置',
      description: '课程体系的总体设置',
      type: 'curriculum',
      required: true,
      order: 8
    },
    {
      id: 'module_credit_statistics',
      name: '学分统计表',
      description: '各类课程学分统计',
      type: 'credits',
      required: true,
      order: 9
    }
  ];

  // 根据模板类型添加特定模块
  switch (templateType) {
    case 'standard_undergraduate':
      return [
        ...commonModules,
        {
          id: 'module_curriculum_topo',
          name: '课程体系拓扑图',
          description: '课程之间的关系拓扑图',
          type: 'topo',
          required: false,
          order: 10
        }
      ];
    case 'innovation_entrepreneurship':
      return [
        ...commonModules,
        {
          id: 'module_innovation_courses',
          name: '创新创业课程',
          description: '创新创业相关特色课程',
          type: 'innovation',
          required: true,
          order: 10
        },
        {
          id: 'module_curriculum_topo',
          name: '课程体系拓扑图',
          description: '课程之间的关系拓扑图',
          type: 'topo',
          required: false,
          order: 11
        }
      ];
    case 'international':
      return [
        ...commonModules,
        {
          id: 'module_international_features',
          name: '国际化特色',
          description: '培养方案的国际化特色',
          type: 'international',
          required: true,
          order: 10
        },
        {
          id: 'module_foreign_language',
          name: '外语强化要求',
          description: '外语能力的特殊要求',
          type: 'language',
          required: true,
          order: 11
        },
        {
          id: 'module_curriculum_topo',
          name: '课程体系拓扑图',
          description: '课程之间的关系拓扑图',
          type: 'topo',
          required: false,
          order: 12
        }
      ];
    case 'excellent_engineer':
      return [
        ...commonModules,
        {
          id: 'module_industry_requirements',
          name: '行业需求对接',
          description: '与行业需求的对接情况',
          type: 'industry',
          required: true,
          order: 10
        },
        {
          id: 'module_engineering_practice',
          name: '工程实践强化',
          description: '工程实践能力培养的强化措施',
          type: 'engineering',
          required: true,
          order: 11
        },
        {
          id: 'module_curriculum_topo',
          name: '课程体系拓扑图',
          description: '课程之间的关系拓扑图',
          type: 'topo',
          required: false,
          order: 12
        }
      ];
    case 'normal_education':
      return [
        ...commonModules,
        {
          id: 'module_teaching_ability',
          name: '教学能力培养',
          description: '教学能力培养的特殊要求',
          type: 'teaching',
          required: true,
          order: 10
        },
        {
          id: 'module_educational_practice',
          name: '教育实习环节',
          description: '教育实习相关环节设置',
          type: 'edu_practice',
          required: true,
          order: 11
        },
        {
          id: 'module_curriculum_topo',
          name: '课程体系拓扑图',
          description: '课程之间的关系拓扑图',
          type: 'topo',
          required: false,
          order: 12
        }
      ];
    case 'engineering_certification':
      return [
        ...commonModules,
        {
          id: 'module_certification_requirements',
          name: '工程认证要求对照',
          description: '与工程教育认证标准的对照',
          type: 'certification',
          required: true,
          order: 10
        },
        {
          id: 'module_graduation_matrix',
          name: '课程体系支撑毕业要求矩阵',
          description: '课程与毕业要求的支撑关系矩阵',
          type: 'matrix',
          required: true,
          order: 11
        },
        {
          id: 'module_curriculum_topo',
          name: '课程体系拓扑图',
          description: '课程之间的关系拓扑图',
          type: 'topo',
          required: false,
          order: 12
        }
      ];
    default:
      return commonModules;
  }
};

// 生成架构模板数据
const architectureTemplates: ArchitectureTemplate[] = [
  {
    id: 'template_standard',
    name: '标准本科培养方案模板',
    description: '适用于大多数普通本科专业的标准培养方案模板',
    category: 'standard',
    isDefault: true,
    modules: generateModules('standard_undergraduate'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'template_innovation',
    name: '创新创业培养方案模板',
    description: '侧重创新创业能力培养的方案模板',
    category: 'special',
    isDefault: false,
    modules: generateModules('innovation_entrepreneurship'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'template_international',
    name: '国际化培养方案模板',
    description: '具有国际化特色的培养方案模板',
    category: 'special',
    isDefault: false,
    modules: generateModules('international'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'template_engineer',
    name: '卓越工程师培养方案模板',
    description: '适用于卓越工程师培养计划的方案模板',
    category: 'engineering',
    isDefault: false,
    modules: generateModules('excellent_engineer'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'template_normal',
    name: '师范类培养方案模板',
    description: '适用于师范类专业的培养方案模板',
    category: 'normal',
    isDefault: false,
    modules: generateModules('normal_education'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'template_engineering_cert',
    name: '工程教育认证培养方案模板',
    description: '符合工程教育认证要求的培养方案模板',
    category: 'certification',
    isDefault: false,
    modules: generateModules('engineering_certification'),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  }
];

// 生成专业架构配置样例
const programArchitectures: ProgramArchitecture[] = [
  {
    id: 'arch_1',
    name: '计算机科学与技术专业架构',
    description: '计算机科学与技术专业培养方案架构配置',
    majorCode: '080901',
    majorName: '计算机科学与技术',
    departmentName: '计算机学院',
    templateId: 'template_engineering_cert',
    modules: generateModules('engineering_certification'),
    isActive: true,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'arch_2',
    name: '软件工程专业架构',
    description: '软件工程专业培养方案架构配置',
    majorCode: '080902',
    majorName: '软件工程',
    departmentName: '计算机学院',
    templateId: 'template_engineering_cert',
    modules: generateModules('engineering_certification'),
    isActive: true,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'arch_3',
    name: '英语专业架构',
    description: '英语专业培养方案架构配置',
    majorCode: '050201',
    majorName: '英语',
    departmentName: '外国语学院',
    templateId: 'template_normal',
    modules: generateModules('normal_education'),
    isActive: true,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'arch_4',
    name: '机械工程专业架构',
    description: '机械工程专业培养方案架构配置',
    majorCode: '080201',
    majorName: '机械工程',
    departmentName: '机械学院',
    templateId: 'template_engineer',
    modules: generateModules('excellent_engineer'),
    isActive: true,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  }
];

// 生成专业列表数据
const majorList = [
  { code: '080901', name: '计算机科学与技术', department: '计算机学院', category: '工学' },
  { code: '080902', name: '软件工程', department: '计算机学院', category: '工学' },
  { code: '080903', name: '网络工程', department: '计算机学院', category: '工学' },
  { code: '080904K', name: '信息安全', department: '计算机学院', category: '工学' },
  { code: '080905', name: '物联网工程', department: '计算机学院', category: '工学' },
  { code: '080202', name: '机械设计制造及其自动化', department: '机械学院', category: '工学' },
  { code: '080207', name: '车辆工程', department: '机械学院', category: '工学' },
  { code: '080203', name: '材料成型及控制工程', department: '机械学院', category: '工学' },
  { code: '080201', name: '机械工程', department: '机械学院', category: '工学' },
  { code: '080601', name: '电气工程及其自动化', department: '电气学院', category: '工学' },
  { code: '080701', name: '电子信息工程', department: '电子信息学院', category: '工学' },
  { code: '080703', name: '通信工程', department: '电子信息学院', category: '工学' },
  { code: '120201K', name: '工商管理', department: '管理学院', category: '管理学' },
  { code: '120203K', name: '会计学', department: '管理学院', category: '管理学' },
  { code: '120102', name: '信息管理与信息系统', department: '管理学院', category: '管理学' },
  { code: '050201', name: '英语', department: '外国语学院', category: '文学' },
  { code: '050207', name: '日语', department: '外国语学院', category: '文学' },
  { code: '070101', name: '数学与应用数学', department: '理学院', category: '理学' },
  { code: '070201', name: '物理学', department: '理学院', category: '理学' },
  { code: '070301', name: '化学', department: '理学院', category: '理学' }
];

export default [
  // 获取架构模板列表
  {
    url: '/api/program/architecture/templates',
    method: 'get',
    response: ({ query }) => {
      const { category = '' } = query;
      
      let filteredTemplates = [...architectureTemplates];
      
      if (category) {
        filteredTemplates = filteredTemplates.filter(item => item.category === category);
      }
      
      return {
        code: 0,
        data: {
          list: filteredTemplates,
          total: filteredTemplates.length
        },
        message: 'ok'
      };
    }
  },
  
  // 获取架构模板详情
  {
    url: '/api/program/architecture/template/:id',
    method: 'get',
    response: ({ params }) => {
      const { id } = params;
      
      const template = architectureTemplates.find(item => item.id === id);
      
      if (!template) {
        return {
          code: 404,
          message: '架构模板不存在',
          data: null
        };
      }
      
      return {
        code: 0,
        data: template,
        message: 'ok'
      };
    }
  },
  
  // 新增架构模板
  {
    url: '/api/program/architecture/template/add',
    method: 'post',
    response: ({ body }) => {
      const { name, description, category, modules } = body;
      
      if (!name || !description || !category || !modules) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null
        };
      }
      
      const newTemplate: ArchitectureTemplate = {
        id: `template_${Mock.Random.guid().substring(0, 8)}`,
        name,
        description,
        category,
        isDefault: false,
        modules,
        createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
      };
      
      architectureTemplates.push(newTemplate);
      
      return {
        code: 0,
        data: newTemplate,
        message: '新增架构模板成功'
      };
    }
  },
  
  // 更新架构模板
  {
    url: '/api/program/architecture/template/update',
    method: 'post',
    response: ({ body }) => {
      const { id, name, description, category, modules } = body;
      
      if (!id || !name || !description || !category || !modules) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null
        };
      }
      
      const index = architectureTemplates.findIndex(item => item.id === id);
      
      if (index === -1) {
        return {
          code: 404,
          message: '架构模板不存在',
          data: null
        };
      }
      
      const updatedTemplate = {
        ...architectureTemplates[index],
        name,
        description,
        category,
        modules,
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
      };
      
      architectureTemplates[index] = updatedTemplate;
      
      return {
        code: 0,
        data: updatedTemplate,
        message: '更新架构模板成功'
      };
    }
  },
  
  // 获取专业架构配置列表
  {
    url: '/api/program/architecture/list',
    method: 'get',
    response: ({ query }) => {
      const { majorName = '', departmentName = '', templateId = '' } = query;
      
      let filteredArchitectures = [...programArchitectures];
      
      if (majorName) {
        filteredArchitectures = filteredArchitectures.filter(item => 
          item.majorName.includes(majorName)
        );
      }
      
      if (departmentName) {
        filteredArchitectures = filteredArchitectures.filter(item => 
          item.departmentName === departmentName
        );
      }
      
      if (templateId) {
        filteredArchitectures = filteredArchitectures.filter(item => 
          item.templateId === templateId
        );
      }
      
      return {
        code: 0,
        data: {
          list: filteredArchitectures,
          total: filteredArchitectures.length
        },
        message: 'ok'
      };
    }
  },
  
  // 获取专业架构配置详情
  {
    url: '/api/program/architecture/:id',
    method: 'get',
    response: ({ params }) => {
      const { id } = params;
      
      const architecture = programArchitectures.find(item => item.id === id);
      
      if (!architecture) {
        return {
          code: 404,
          message: '架构配置不存在',
          data: null
        };
      }
      
      return {
        code: 0,
        data: architecture,
        message: 'ok'
      };
    }
  },
  
  // 新增专业架构配置
  {
    url: '/api/program/architecture/add',
    method: 'post',
    response: ({ body }) => {
      const { name, description, majorCode, majorName, departmentName, templateId, modules } = body;
      
      if (!name || !majorCode || !majorName || !departmentName || !templateId || !modules) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null
        };
      }
      
      const newArchitecture: ProgramArchitecture = {
        id: `arch_${Mock.Random.guid().substring(0, 8)}`,
        name,
        description: description || '',
        majorCode,
        majorName,
        departmentName,
        templateId,
        modules,
        isActive: true,
        createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
      };
      
      programArchitectures.push(newArchitecture);
      
      return {
        code: 0,
        data: newArchitecture,
        message: '新增架构配置成功'
      };
    }
  },
  
  // 更新专业架构配置
  {
    url: '/api/program/architecture/update',
    method: 'post',
    response: ({ body }) => {
      const { id, name, description, modules, isActive } = body;
      
      if (!id || !name || modules === undefined) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null
        };
      }
      
      const index = programArchitectures.findIndex(item => item.id === id);
      
      if (index === -1) {
        return {
          code: 404,
          message: '架构配置不存在',
          data: null
        };
      }
      
      const updatedArchitecture = {
        ...programArchitectures[index],
        name,
        description: description || programArchitectures[index].description,
        modules,
        isActive: isActive !== undefined ? isActive : programArchitectures[index].isActive,
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
      };
      
      programArchitectures[index] = updatedArchitecture;
      
      return {
        code: 0,
        data: updatedArchitecture,
        message: '更新架构配置成功'
      };
    }
  },
  
  // 批量配置专业架构
  {
    url: '/api/program/architecture/batch',
    method: 'post',
    response: ({ body }) => {
      const { majorCodes, templateId } = body;
      
      if (!majorCodes || !majorCodes.length || !templateId) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null
        };
      }
      
      // 查找模板
      const template = architectureTemplates.find(item => item.id === templateId);
      if (!template) {
        return {
          code: 404,
          message: '架构模板不存在',
          data: null
        };
      }
      
      // 批量创建架构配置
      const createdArchitectures: ProgramArchitecture[] = [];
      for (const majorCode of majorCodes) {
        const major = majorList.find(item => item.code === majorCode);
        if (!major) continue;
        
        const newArchitecture: ProgramArchitecture = {
          id: `arch_${Mock.Random.guid().substring(0, 8)}`,
          name: `${major.name}专业架构`,
          description: `${major.name}专业培养方案架构配置`,
          majorCode: major.code,
          majorName: major.name,
          departmentName: major.department,
          templateId,
          modules: [...template.modules],
          isActive: true,
          createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
        };
        
        programArchitectures.push(newArchitecture);
        createdArchitectures.push(newArchitecture);
      }
      
      return {
        code: 0,
        data: {
          list: createdArchitectures,
          total: createdArchitectures.length
        },
        message: '批量配置专业架构成功'
      };
    }
  },
  
  // 获取专业列表
  {
    url: '/api/program/majors',
    method: 'get',
    response: ({ query }) => {
      const { name = '', department = '', category = '' } = query;
      
      let filteredMajors = [...majorList];
      
      if (name) {
        filteredMajors = filteredMajors.filter(item => 
          item.name.includes(name) || item.code.includes(name)
        );
      }
      
      if (department) {
        filteredMajors = filteredMajors.filter(item => 
          item.department === department
        );
      }
      
      if (category) {
        filteredMajors = filteredMajors.filter(item => 
          item.category === category
        );
      }
      
      return {
        code: 0,
        data: {
          list: filteredMajors,
          total: filteredMajors.length
        },
        message: 'ok'
      };
    }
  }
] as MockMethod[]; 