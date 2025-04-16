import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';

// 定义AI导入服务配置接口
interface AIImportConfig {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  apiKey: string;
  endpoint: string;
  isDefault: boolean;
  maxRetries: number;
  timeout: number;
  createTime: string;
  updateTime: string;
  createdBy: string;
  updatedBy: string;
  status: 'active' | 'inactive';
  settings: AIImportSettings;
}

// 定义AI导入设置接口
interface AIImportSettings {
  modelName: string;
  temperature: number;
  maxTokens: number;
  supportedFileTypes: string[];
  outputFormat: 'json' | 'structured';
  enablePreProcessing: boolean;
  languageSupport: string[];
  fieldMappings: AIImportFieldMapping[];
}

// 定义AI导入字段映射接口
interface AIImportFieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  validationRules: string;
  defaultValue: string;
}

// 定义导入任务接口
interface ImportTask {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result: any;
  message: string;
  createTime: string;
  completeTime: string;
  createdBy: string;
}

// 生成默认的AI导入设置
const generateDefaultSettings = (serviceType: string): AIImportSettings => {
  const baseSettings: AIImportSettings = {
    modelName: 'gpt-4',
    temperature: 0.2,
    maxTokens: 8192,
    supportedFileTypes: ['docx', 'pdf', 'xlsx', 'csv'],
    outputFormat: 'json',
    enablePreProcessing: true,
    languageSupport: ['zh-CN', 'en-US'],
    fieldMappings: []
  };

  // 根据服务类型生成不同的字段映射
  switch (serviceType) {
    case 'deepseek':
      return {
        ...baseSettings,
        modelName: 'deepseek-chat',
        fieldMappings: [
          {
            id: 'field_map_1',
            sourceField: '课程名称',
            targetField: 'courseName',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:50',
            defaultValue: ''
          },
          {
            id: 'field_map_2',
            sourceField: '课程代码',
            targetField: 'courseCode',
            dataType: 'string',
            required: true,
            validationRules: 'pattern:^[A-Z0-9]{6,10}$',
            defaultValue: ''
          },
          {
            id: 'field_map_3',
            sourceField: '学分',
            targetField: 'credits',
            dataType: 'number',
            required: true,
            validationRules: 'min:0.5,max:20',
            defaultValue: '0'
          },
          {
            id: 'field_map_4',
            sourceField: '课程类型',
            targetField: 'courseType',
            dataType: 'string',
            required: true,
            validationRules: '',
            defaultValue: '专业课'
          },
          {
            id: 'field_map_5',
            sourceField: '课程模块',
            targetField: 'moduleType',
            dataType: 'string',
            required: true,
            validationRules: '',
            defaultValue: 'professional_core'
          }
        ]
      };
    case 'openai':
      return {
        ...baseSettings,
        modelName: 'gpt-4',
        fieldMappings: [
          {
            id: 'field_map_1',
            sourceField: 'Course Name',
            targetField: 'courseName',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:50',
            defaultValue: ''
          },
          {
            id: 'field_map_2',
            sourceField: 'Course Code',
            targetField: 'courseCode',
            dataType: 'string',
            required: true,
            validationRules: 'pattern:^[A-Z0-9]{6,10}$',
            defaultValue: ''
          },
          {
            id: 'field_map_3',
            sourceField: 'Credits',
            targetField: 'credits',
            dataType: 'number',
            required: true,
            validationRules: 'min:0.5,max:20',
            defaultValue: '0'
          },
          {
            id: 'field_map_4',
            sourceField: 'Course Type',
            targetField: 'courseType',
            dataType: 'string',
            required: true,
            validationRules: '',
            defaultValue: 'Professional'
          },
          {
            id: 'field_map_5',
            sourceField: 'Module',
            targetField: 'moduleType',
            dataType: 'string',
            required: true,
            validationRules: '',
            defaultValue: 'professional_core'
          }
        ]
      };
    default:
      return baseSettings;
  }
};

// 生成AI导入配置数据
const aiImportConfigList: AIImportConfig[] = [
  {
    id: '1',
    name: 'DeepSeek AI导入服务',
    description: '使用DeepSeek AI服务进行培养方案文档识别与导入',
    serviceType: 'deepseek',
    apiKey: 'sk-44f7f084251542718d10cec938537985',
    endpoint: 'https://api.deepseek.com/v1',
    isDefault: true,
    maxRetries: 3,
    timeout: 30000,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createdBy: 'admin',
    updatedBy: 'admin',
    status: 'active',
    settings: generateDefaultSettings('deepseek')
  },
  {
    id: '2',
    name: 'OpenAI导入服务',
    description: '使用OpenAI服务进行培养方案文档识别与导入',
    serviceType: 'openai',
    apiKey: 'sk-openai-sample-key',
    endpoint: 'https://api.openai.com/v1',
    isDefault: false,
    maxRetries: 3,
    timeout: 20000,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createdBy: 'admin',
    updatedBy: 'admin',
    status: 'active',
    settings: generateDefaultSettings('openai')
  }
];

// 导入任务列表
const importTaskList: ImportTask[] = [];

// 模拟从Word文档中提取的课程数据
const generateMockCourseData = () => {
  const courseCategories = [
    '公共基础课', '数学与自然科学基础课', '专业基础课', '专业核心课', 
    '专业选修课', '通识教育课', '创新创业与实践课'
  ];
  
  const courseTypes = ['必修课', '选修课', '限选课'];
  
  const courseModuleTypes = [
    'public_basic', 'discipline_basic', 'professional_core', 
    'professional_elective', 'general_education', 'practice'
  ];
  
  const courses = [];
  
  // 生成20-30门课程
  const courseCount = Mock.Random.integer(20, 30);
  
  for (let i = 0; i < courseCount; i++) {
    const categoryIndex = Mock.Random.integer(0, courseCategories.length - 1);
    const typeIndex = Mock.Random.integer(0, courseTypes.length - 1);
    const moduleIndex = Math.min(categoryIndex, courseModuleTypes.length - 1);
    
    // 生成课程代码前缀，模拟不同学科
    const prefixes = ['CS', 'EE', 'MA', 'PH', 'EN', 'EC'];
    const prefix = prefixes[Mock.Random.integer(0, prefixes.length - 1)];
    
    courses.push({
      courseName: Mock.Random.ctitle(4, 10),
      courseCode: `${prefix}${Mock.Random.integer(1000, 9999)}`,
      credits: parseFloat(Mock.Random.float(0.5, 6, 0, 1).toFixed(1)),
      hours: Mock.Random.integer(16, 96),
      courseCategory: courseCategories[categoryIndex],
      courseType: courseTypes[typeIndex],
      moduleType: courseModuleTypes[moduleIndex],
      term: `${Mock.Random.integer(1, 4)}-${Mock.Random.integer(1, 2)}`,
      description: Mock.Random.cparagraph(1, 3)
    });
  }
  
  return courses;
};

// 生成模拟导入结果
const generateMockImportResult = (fileType: string) => {
  const courses = generateMockCourseData();
  
  // 将课程按模块类型分组
  const coursesByModule: Record<string, any[]> = {};
  
  courses.forEach(course => {
    if (!coursesByModule[course.moduleType]) {
      coursesByModule[course.moduleType] = [];
    }
    coursesByModule[course.moduleType].push(course);
  });
  
  // 生成课程体系模块数据
  const modules = Object.keys(coursesByModule).map((moduleType, index) => {
    const moduleCourses = coursesByModule[moduleType];
    const requiredCourses = moduleCourses.filter(c => c.courseType === '必修课');
    const electiveCourses = moduleCourses.filter(c => c.courseType !== '必修课');
    
    // 计算模块总学分
    const totalCredits = moduleCourses.reduce((sum, course) => sum + course.credits, 0);
    
    // 模块类型映射到名称
    const moduleNames = {
      public_basic: '公共基础课程模块',
      discipline_basic: '学科基础课程模块',
      professional_core: '专业核心课程模块',
      professional_elective: '专业选修课程模块',
      general_education: '通识教育课程模块',
      practice: '实践课程模块'
    };
    
    return {
      id: `module_${moduleType}`,
      name: moduleNames[moduleType] || `模块${index + 1}`,
      description: `包含${moduleCourses.length}门课程，总学分${totalCredits.toFixed(1)}`,
      type: moduleType,
      required: true,
      order: index + 1,
      minCredits: Math.max(5, Math.floor(totalCredits * 0.8)),
      maxCredits: Math.ceil(totalCredits * 1.2),
      recommendedCredits: Math.round(totalCredits),
      courseCategories: [...new Set(moduleCourses.map(c => c.courseCategory))],
      requiredCourses: requiredCourses.map(c => ({
        id: Mock.Random.guid(),
        code: c.courseCode,
        name: c.courseName,
        credits: c.credits,
        hours: c.hours,
        property: '必修',
        term: c.term,
        required: true
      })),
      electiveCourses: electiveCourses.map(c => ({
        id: Mock.Random.guid(),
        code: c.courseCode,
        name: c.courseName,
        credits: c.credits,
        hours: c.hours,
        property: c.courseType === '限选课' ? '限选' : '选修',
        term: c.term,
        required: false
      }))
    };
  });
  
  return {
    templateName: `来自${fileType}文件的课程体系`,
    description: '通过AI导入自动生成的课程体系模板',
    majorType: 'engineering',
    degreeType: 'bachelor',
    modules: modules,
    creditRequirements: [
      {
        category: '总学分',
        minCredits: modules.reduce((sum, m) => sum + m.minCredits, 0),
        maxCredits: modules.reduce((sum, m) => sum + m.maxCredits, 0),
        recommendedCredits: modules.reduce((sum, m) => sum + m.recommendedCredits, 0),
        minCourses: modules.reduce((sum, m) => sum + (m.requiredCourses?.length || 0) + (m.electiveCourses?.length || 0), 0),
      },
      {
        category: '必修课学分',
        minCredits: modules.reduce((sum, m) => sum + (m.requiredCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        maxCredits: modules.reduce((sum, m) => sum + (m.requiredCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        recommendedCredits: modules.reduce((sum, m) => sum + (m.requiredCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        minCourses: modules.reduce((sum, m) => sum + (m.requiredCourses?.length || 0), 0),
      },
      {
        category: '选修课学分',
        minCredits: modules.reduce((sum, m) => sum + (m.electiveCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        maxCredits: modules.reduce((sum, m) => sum + (m.electiveCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        recommendedCredits: modules.reduce((sum, m) => sum + (m.electiveCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        minCourses: modules.reduce((sum, m) => sum + (m.electiveCourses?.length || 0), 0),
      }
    ]
  };
};

export default [
  // 获取AI导入服务配置列表
  {
    url: '/api/program/ai-import/list',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { name = '', serviceType = '', status = '', pageSize = 10, pageIndex = 1 } = query;
      
      let filteredList = [...aiImportConfigList];
      
      // 筛选
      if (name) {
        filteredList = filteredList.filter(item => item.name.includes(name));
      }
      if (serviceType) {
        filteredList = filteredList.filter(item => item.serviceType === serviceType);
      }
      if (status) {
        filteredList = filteredList.filter(item => item.status === status);
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
  
  // 获取AI导入服务配置详情
  {
    url: '/api/program/ai-import/detail/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const { id } = params;
      const config = aiImportConfigList.find(item => item.id === id);
      
      if (!config) {
        return {
          code: 1,
          data: null,
          message: '找不到该AI导入服务配置',
        };
      }
      
      return {
        code: 0,
        data: config,
        message: 'ok',
      };
    },
  },
  
  // 创建AI导入服务配置
  {
    url: '/api/program/ai-import/create',
    method: 'post',
    response: ({ body }: { body: Partial<AIImportConfig> }) => {
      const { name, serviceType } = body;
      
      // 检查是否存在同名配置
      const existingConfig = aiImportConfigList.find(item => item.name === name);
      if (existingConfig) {
        return {
          code: 1,
          data: null,
          message: '已存在同名AI导入服务配置',
        };
      }
      
      // 生成新配置
      const newConfig: AIImportConfig = {
        id: String(aiImportConfigList.length + 1),
        name: body.name || '新建AI导入服务配置',
        description: body.description || '',
        serviceType: body.serviceType || 'deepseek',
        apiKey: body.apiKey || `${body.serviceType || 'default'}_api_key_${Mock.Random.string('number', 6)}`,
        endpoint: body.endpoint || 'https://example.com/ai/api',
        isDefault: body.isDefault || false,
        maxRetries: body.maxRetries || 3,
        timeout: body.timeout || 30000,
        createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        createdBy: 'admin',
        updatedBy: 'admin',
        status: body.status || 'active',
        settings: body.settings || generateDefaultSettings(body.serviceType || 'deepseek')
      };
      
      aiImportConfigList.push(newConfig);
      
      return {
        code: 0,
        data: newConfig,
        message: 'ok',
      };
    },
  },
  
  // 更新AI导入服务配置
  {
    url: '/api/program/ai-import/update/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }, body: Partial<AIImportConfig> }) => {
      const { id } = params;
      const configIndex = aiImportConfigList.findIndex(item => item.id === id);
      
      if (configIndex === -1) {
        return {
          code: 1,
          data: null,
          message: '找不到该AI导入服务配置',
        };
      }
      
      // 更新配置
      const updatedConfig = {
        ...aiImportConfigList[configIndex],
        ...body,
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updatedBy: 'admin'
      };
      
      aiImportConfigList[configIndex] = updatedConfig;
      
      return {
        code: 0,
        data: updatedConfig,
        message: 'ok',
      };
    },
  },
  
  // 删除AI导入服务配置
  {
    url: '/api/program/ai-import/delete/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      const { id } = params;
      const configIndex = aiImportConfigList.findIndex(item => item.id === id);
      
      if (configIndex === -1) {
        return {
          code: 1,
          data: null,
          message: '找不到该AI导入服务配置',
        };
      }
      
      // 检查是否为默认配置
      if (aiImportConfigList[configIndex].isDefault) {
        return {
          code: 1,
          data: null,
          message: '默认AI导入服务配置不能删除',
        };
      }
      
      // 删除配置
      aiImportConfigList.splice(configIndex, 1);
      
      return {
        code: 0,
        data: null,
        message: 'ok',
      };
    },
  },
  
  // 设置默认AI导入服务配置
  {
    url: '/api/program/ai-import/set-default/:id',
    method: 'put',
    response: ({ params }: { params: { id: string } }) => {
      const { id } = params;
      const configIndex = aiImportConfigList.findIndex(item => item.id === id);
      
      if (configIndex === -1) {
        return {
          code: 1,
          data: null,
          message: '找不到该AI导入服务配置',
        };
      }
      
      // 检查状态
      if (aiImportConfigList[configIndex].status !== 'active') {
        return {
          code: 1,
          data: null,
          message: '只有激活状态的AI导入服务配置才能设为默认',
        };
      }
      
      // 重置所有配置的默认状态
      aiImportConfigList.forEach(item => {
        item.isDefault = false;
      });
      
      // 设置新的默认配置
      aiImportConfigList[configIndex].isDefault = true;
      aiImportConfigList[configIndex].updateTime = Mock.Random.datetime('yyyy-MM-dd HH:mm:ss');
      
      return {
        code: 0,
        data: aiImportConfigList[configIndex],
        message: 'ok',
      };
    },
  },
  
  // 测试AI导入服务配置
  {
    url: '/api/program/ai-import/test',
    method: 'post',
    response: ({ body }: { body: { id: string } }) => {
      const { id } = body;
      const config = aiImportConfigList.find(item => item.id === id);
      
      if (!config) {
        return {
          code: 1,
          data: null,
          message: '找不到该AI导入服务配置',
        };
      }
      
      // 模拟测试结果
      const testResult = {
        success: true,
        message: 'AI导入服务连接成功',
        responseTime: Mock.Random.integer(100, 500),
        engineResponse: {
          status: 'ok',
          requestId: Mock.Random.guid(),
          timestamp: Date.now()
        }
      };
      
      return {
        code: 0,
        data: testResult,
        message: 'ok',
      };
    },
  },

  // 文件上传（模拟）
  {
    url: '/api/program/ai-import/upload',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const { fileName, fileSize, fileType } = body;
      
      // 创建导入任务
      const newTask: ImportTask = {
        id: Mock.Random.guid(),
        fileName: fileName || `curriculum_system_${Mock.Random.datetime('yyyyMMdd')}.${fileType || 'docx'}`,
        fileSize: fileSize || Mock.Random.integer(100 * 1024, 5 * 1024 * 1024),
        fileType: fileType || 'docx',
        status: 'pending',
        progress: 0,
        result: null,
        message: '上传成功，等待处理',
        createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        completeTime: '',
        createdBy: 'admin'
      };
      
      importTaskList.unshift(newTask);
      
      return {
        code: 0,
        data: {
          taskId: newTask.id,
          fileName: newTask.fileName,
          status: newTask.status
        },
        message: 'ok',
      };
    },
  },

  // 获取任务状态
  {
    url: '/api/program/ai-import/task/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const { id } = params;
      const task = importTaskList.find(item => item.id === id);
      
      if (!task) {
        return {
          code: 1,
          data: null,
          message: '找不到该导入任务',
        };
      }
      
      // 模拟任务进度更新
      if (task.status === 'pending') {
        task.status = 'processing';
        task.progress = 10;
        task.message = '正在处理文件...';
      } else if (task.status === 'processing') {
        task.progress += Mock.Random.integer(10, 30);
        
        if (task.progress >= 100) {
          task.progress = 100;
          task.status = 'completed';
          task.completeTime = Mock.Random.datetime('yyyy-MM-dd HH:mm:ss');
          task.message = '导入完成';
          task.result = generateMockImportResult(task.fileType);
        }
      }
      
      return {
        code: 0,
        data: {
          taskId: task.id,
          fileName: task.fileName,
          status: task.status,
          progress: task.progress,
          message: task.message,
          result: task.result,
          createTime: task.createTime,
          completeTime: task.completeTime
        },
        message: 'ok',
      };
    },
  },

  // 获取导入任务列表
  {
    url: '/api/program/ai-import/task-list',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { pageSize = 10, pageIndex = 1 } = query;
      
      // 分页
      const start = (pageIndex - 1) * pageSize;
      const end = pageIndex * pageSize;
      const list = importTaskList.slice(start, end);
      
      return {
        code: 0,
        data: {
          list,
          total: importTaskList.length,
        },
        message: 'ok',
      };
    },
  },

  // 应用导入结果创建课程体系模板
  {
    url: '/api/program/ai-import/apply',
    method: 'post',
    response: ({ body }: { body: { taskId: string, templateData: any } }) => {
      const { taskId, templateData } = body;
      const task = importTaskList.find(item => item.id === taskId);
      
      if (!task) {
        return {
          code: 1,
          data: null,
          message: '找不到该导入任务',
        };
      }
      
      if (task.status !== 'completed') {
        return {
          code: 1,
          data: null,
          message: '导入任务尚未完成',
        };
      }
      
      // 模拟创建模板的结果
      const newTemplateId = Mock.Random.guid();
      
      return {
        code: 0,
        data: {
          templateId: newTemplateId,
          templateName: templateData?.templateName || task.result.templateName,
          message: '课程体系模板创建成功'
        },
        message: 'ok',
      };
    },
  }
] as MockMethod[]; 