import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';

// 定义OCR参数配置接口
interface OCRConfig {
  id: string;
  name: string;
  description: string;
  engineType: string;
  apiKey: string;
  secretKey: string;
  endpoint: string;
  templateId: string;
  isDefault: boolean;
  maxRetries: number;
  timeout: number;
  accuracyThreshold: number;
  createTime: string;
  updateTime: string;
  createdBy: string;
  updatedBy: string;
  status: 'active' | 'inactive';
  settings: OCRSettings;
}

// 定义OCR设置接口
interface OCRSettings {
  recognitionMode: 'auto' | 'template' | 'structure';
  outputFormat: 'json' | 'text' | 'xml';
  languageSupport: string[];
  enableTextCorrection: boolean;
  enableTableRecognition: boolean;
  enableImagePreprocessing: boolean;
  imagePreprocessingParams: {
    denoise: boolean;
    deskew: boolean;
    contrast: number;
    brightness: number;
  };
  fieldMappings: OCRFieldMapping[];
}

// 定义OCR字段映射接口
interface OCRFieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  validationRules: string;
  defaultValue: string;
}

// 生成默认的OCR设置
const generateDefaultSettings = (engineType: string): OCRSettings => {
  const baseSettings: OCRSettings = {
    recognitionMode: 'auto',
    outputFormat: 'json',
    languageSupport: ['zh-CN', 'en-US'],
    enableTextCorrection: true,
    enableTableRecognition: true,
    enableImagePreprocessing: true,
    imagePreprocessingParams: {
      denoise: true,
      deskew: true,
      contrast: 0,
      brightness: 0
    },
    fieldMappings: []
  };

  // 根据引擎类型生成不同的字段映射
  switch (engineType) {
    case 'tencent':
      return {
        ...baseSettings,
        fieldMappings: [
          {
            id: 'field_map_1',
            sourceField: 'Title',
            targetField: 'programName',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:50',
            defaultValue: ''
          },
          {
            id: 'field_map_2',
            sourceField: 'Department',
            targetField: 'department',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:30',
            defaultValue: ''
          },
          {
            id: 'field_map_3',
            sourceField: 'MajorCode',
            targetField: 'majorCode',
            dataType: 'string',
            required: true,
            validationRules: 'pattern:^[A-Z0-9]{6,10}$',
            defaultValue: ''
          },
          {
            id: 'field_map_4',
            sourceField: 'MajorName',
            targetField: 'majorName',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:30',
            defaultValue: ''
          },
          {
            id: 'field_map_5',
            sourceField: 'Credits',
            targetField: 'totalCredits',
            dataType: 'number',
            required: true,
            validationRules: 'min:1,max:300',
            defaultValue: '0'
          }
        ]
      };
    case 'baidu':
      return {
        ...baseSettings,
        fieldMappings: [
          {
            id: 'field_map_1',
            sourceField: 'program_name',
            targetField: 'programName',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:50',
            defaultValue: ''
          },
          {
            id: 'field_map_2',
            sourceField: 'department_name',
            targetField: 'department',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:30',
            defaultValue: ''
          },
          {
            id: 'field_map_3',
            sourceField: 'major_code',
            targetField: 'majorCode',
            dataType: 'string',
            required: true,
            validationRules: 'pattern:^[A-Z0-9]{6,10}$',
            defaultValue: ''
          },
          {
            id: 'field_map_4',
            sourceField: 'major_name',
            targetField: 'majorName',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:30',
            defaultValue: ''
          },
          {
            id: 'field_map_5',
            sourceField: 'total_credits',
            targetField: 'totalCredits',
            dataType: 'number',
            required: true,
            validationRules: 'min:1,max:300',
            defaultValue: '0'
          }
        ]
      };
    case 'aliyun':
      return {
        ...baseSettings,
        fieldMappings: [
          {
            id: 'field_map_1',
            sourceField: 'programTitle',
            targetField: 'programName',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:50',
            defaultValue: ''
          },
          {
            id: 'field_map_2',
            sourceField: 'departmentName',
            targetField: 'department',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:30',
            defaultValue: ''
          },
          {
            id: 'field_map_3',
            sourceField: 'majorCode',
            targetField: 'majorCode',
            dataType: 'string',
            required: true,
            validationRules: 'pattern:^[A-Z0-9]{6,10}$',
            defaultValue: ''
          },
          {
            id: 'field_map_4',
            sourceField: 'majorName',
            targetField: 'majorName',
            dataType: 'string',
            required: true,
            validationRules: 'minLength:2,maxLength:30',
            defaultValue: ''
          },
          {
            id: 'field_map_5',
            sourceField: 'creditTotal',
            targetField: 'totalCredits',
            dataType: 'number',
            required: true,
            validationRules: 'min:1,max:300',
            defaultValue: '0'
          }
        ]
      };
    default:
      return baseSettings;
  }
};

// 生成OCR配置数据
const ocrConfigList: OCRConfig[] = [
  {
    id: '1',
    name: '腾讯云OCR服务',
    description: '使用腾讯云OCR服务进行培养方案文档识别',
    engineType: 'tencent',
    apiKey: 'tencent_api_key_123456',
    secretKey: 'tencent_secret_key_123456',
    endpoint: 'https://ocr.tencentcloudapi.com',
    templateId: 'tencent_template_001',
    isDefault: true,
    maxRetries: 3,
    timeout: 30000,
    accuracyThreshold: 0.8,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createdBy: 'admin',
    updatedBy: 'admin',
    status: 'active',
    settings: generateDefaultSettings('tencent')
  },
  {
    id: '2',
    name: '百度智能云OCR服务',
    description: '使用百度智能云OCR服务进行培养方案文档识别',
    engineType: 'baidu',
    apiKey: 'baidu_api_key_123456',
    secretKey: 'baidu_secret_key_123456',
    endpoint: 'https://aip.baidubce.com/rest/2.0/ocr/v1',
    templateId: 'baidu_template_001',
    isDefault: false,
    maxRetries: 3,
    timeout: 20000,
    accuracyThreshold: 0.75,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createdBy: 'admin',
    updatedBy: 'admin',
    status: 'active',
    settings: generateDefaultSettings('baidu')
  },
  {
    id: '3',
    name: '阿里云OCR服务',
    description: '使用阿里云OCR服务进行培养方案文档识别',
    engineType: 'aliyun',
    apiKey: 'aliyun_api_key_123456',
    secretKey: 'aliyun_secret_key_123456',
    endpoint: 'https://ocr.data.aliyun.com/api/v1',
    templateId: 'aliyun_template_001',
    isDefault: false,
    maxRetries: 2,
    timeout: 25000,
    accuracyThreshold: 0.7,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createdBy: 'admin',
    updatedBy: 'admin',
    status: 'inactive',
    settings: generateDefaultSettings('aliyun')
  }
];

export default [
  // 获取OCR参数配置列表
  {
    url: '/api/program/ocr/list',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { name = '', engineType = '', status = '', pageSize = 10, pageIndex = 1 } = query;
      
      let filteredList = [...ocrConfigList];
      
      // 筛选
      if (name) {
        filteredList = filteredList.filter(item => item.name.includes(name));
      }
      if (engineType) {
        filteredList = filteredList.filter(item => item.engineType === engineType);
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
  
  // 获取OCR参数配置详情
  {
    url: '/api/program/ocr/detail/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const { id } = params;
      const config = ocrConfigList.find(item => item.id === id);
      
      if (!config) {
        return {
          code: 1,
          data: null,
          message: '找不到该OCR配置',
        };
      }
      
      return {
        code: 0,
        data: config,
        message: 'ok',
      };
    },
  },
  
  // 创建OCR参数配置
  {
    url: '/api/program/ocr/create',
    method: 'post',
    response: ({ body }: { body: Partial<OCRConfig> }) => {
      const { name, engineType } = body;
      
      // 检查是否存在同名配置
      const existingConfig = ocrConfigList.find(item => item.name === name);
      if (existingConfig) {
        return {
          code: 1,
          data: null,
          message: '已存在同名OCR配置',
        };
      }
      
      // 生成新配置
      const newConfig: OCRConfig = {
        id: String(ocrConfigList.length + 1),
        name: body.name || '新建OCR配置',
        description: body.description || '',
        engineType: body.engineType || 'tencent',
        apiKey: body.apiKey || `${body.engineType || 'default'}_api_key_${Mock.Random.string('number', 6)}`,
        secretKey: body.secretKey || `${body.engineType || 'default'}_secret_key_${Mock.Random.string('number', 6)}`,
        endpoint: body.endpoint || 'https://example.com/ocr/api',
        templateId: body.templateId || `${body.engineType || 'default'}_template_${Mock.Random.string('number', 3)}`,
        isDefault: body.isDefault || false,
        maxRetries: body.maxRetries || 3,
        timeout: body.timeout || 30000,
        accuracyThreshold: body.accuracyThreshold || 0.8,
        createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        createdBy: 'admin',
        updatedBy: 'admin',
        status: body.status || 'active',
        settings: body.settings || generateDefaultSettings(body.engineType || 'tencent')
      };
      
      ocrConfigList.push(newConfig);
      
      return {
        code: 0,
        data: newConfig,
        message: 'ok',
      };
    },
  },
  
  // 更新OCR参数配置
  {
    url: '/api/program/ocr/update/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }, body: Partial<OCRConfig> }) => {
      const { id } = params;
      const configIndex = ocrConfigList.findIndex(item => item.id === id);
      
      if (configIndex === -1) {
        return {
          code: 1,
          data: null,
          message: '找不到该OCR配置',
        };
      }
      
      // 更新配置
      const updatedConfig = {
        ...ocrConfigList[configIndex],
        ...body,
        updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updatedBy: 'admin'
      };
      
      ocrConfigList[configIndex] = updatedConfig;
      
      return {
        code: 0,
        data: updatedConfig,
        message: 'ok',
      };
    },
  },
  
  // 删除OCR参数配置
  {
    url: '/api/program/ocr/delete/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      const { id } = params;
      const configIndex = ocrConfigList.findIndex(item => item.id === id);
      
      if (configIndex === -1) {
        return {
          code: 1,
          data: null,
          message: '找不到该OCR配置',
        };
      }
      
      // 检查是否为默认配置
      if (ocrConfigList[configIndex].isDefault) {
        return {
          code: 1,
          data: null,
          message: '默认OCR配置不能删除',
        };
      }
      
      // 删除配置
      ocrConfigList.splice(configIndex, 1);
      
      return {
        code: 0,
        data: null,
        message: 'ok',
      };
    },
  },
  
  // 设置默认OCR参数配置
  {
    url: '/api/program/ocr/set-default/:id',
    method: 'put',
    response: ({ params }: { params: { id: string } }) => {
      const { id } = params;
      const configIndex = ocrConfigList.findIndex(item => item.id === id);
      
      if (configIndex === -1) {
        return {
          code: 1,
          data: null,
          message: '找不到该OCR配置',
        };
      }
      
      // 检查状态
      if (ocrConfigList[configIndex].status !== 'active') {
        return {
          code: 1,
          data: null,
          message: '只有激活状态的OCR配置才能设为默认',
        };
      }
      
      // 重置所有配置的默认状态
      ocrConfigList.forEach(item => {
        item.isDefault = false;
      });
      
      // 设置新的默认配置
      ocrConfigList[configIndex].isDefault = true;
      ocrConfigList[configIndex].updateTime = Mock.Random.datetime('yyyy-MM-dd HH:mm:ss');
      
      return {
        code: 0,
        data: ocrConfigList[configIndex],
        message: 'ok',
      };
    },
  },
  
  // 测试OCR参数配置
  {
    url: '/api/program/ocr/test',
    method: 'post',
    response: ({ body }: { body: { id: string } }) => {
      const { id } = body;
      const config = ocrConfigList.find(item => item.id === id);
      
      if (!config) {
        return {
          code: 1,
          data: null,
          message: '找不到该OCR配置',
        };
      }
      
      // 模拟测试结果
      const testResult = {
        success: true,
        message: 'OCR服务连接成功',
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
  }
] as MockMethod[]; 