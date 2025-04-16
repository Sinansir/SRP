import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';
import courseBrowseApis from './course-browse';
import courseRelationApis from './course-relation';
import courseOptionsApis from './course-options'; // 导入新的课程选项API
import programArchitectureApis from './program-architecture'; // 导入培养方案架构配置API
import programTemplateApis from './program-template'; // 导入课程体系管理API
import programOcrApis from './program-ocr'; // 导入OCR参数配置API
import programAiImportApis from './program-ai-import'; // 导入AI导入服务API
import courseSystemPreviewApis from './course-system-preview'; // 导入课程体系预览API

// 导入课程代码规则
const courseCodeRulesList = (require('./course-code-rules').default) || [];

// 定义课程代码规则组件类型
interface CodeRuleComponent {
  order: number;
  type: string;
  codeType: string;
  digitType: string;
  digitCount: number;
}

// 定义课程代码规则类型
interface CodeRule {
  id: string;
  name: string;
  prefix: string;
  startSerialNumber: number;
  currentSerialNumber: number;
  serialNumberLength: number;
  courseNature: string;
  department: string;
  courseCategory: string;
  courseType: string;
  examType: string;
  courseAttr: string;
  credit: number;
  isActive: boolean;
  createTime: string;
  updateTime: string;
  components: CodeRuleComponent[];
  description: string;
}

// 获取课程代码规则数据
const mockCodeRules: CodeRule[] = Array.isArray(courseCodeRulesList) && 
  courseCodeRulesList.length > 0 && 
  courseCodeRulesList[0]?.url === '/api/course-code-rules'
  ? courseCodeRulesList[0].response({ query: {} }).data.list
  : [];

// 获取课程类别名称
function getCategoryName(category: string): string {
  const categoryMap: { [key: string]: string } = {
    GC: '公共基础课',
    ZJ: '专业基础课',
    ZY: '专业课',
    SJ: '实践教学',
    TX: '通识选修课'
  };
  return categoryMap[category] || '';
}

// 获取课程性质名称
function getNatureName(nature: string): string {
  const natureMap: { [key: string]: string } = {
    required: '必修',
    elective: '选修',
    limited: '限选'
  };
  return natureMap[nature] || '';
}

// 根据规则组件生成代码
function generateCodeByComponents(rule: CodeRule, prefix: string, serialNumber: string, department: string, nature: string, category: string): string {
  if (!rule || !rule.components) {
    return `${prefix}${serialNumber}`;
  }
  
  // 排序组件
  const sortedComponents = [...rule.components].sort((a, b) => a.order - b.order);
  
  let codeSegments: string[] = [];
  
  // 根据组件类型生成代码段
  sortedComponents.forEach(component => {
    let segment = '';
    
    switch (component.type) {
      case 'department':
        segment = department.substr(0, component.digitCount || 1);
        break;
      case 'courseNature':
        segment = nature === 'required' ? 'B' : (nature === 'elective' ? 'X' : 'L');
        break;
      case 'courseType':
        segment = 'T'; // 默认理论课
        break;
      case 'courseCategory':
        segment = category.substr(0, component.digitCount || 1);
        break;
      case 'serialNumber':
        segment = serialNumber;
        break;
      case 'prefix':
        segment = prefix;
        break;
      default:
        segment = '';
    }
    
    if (segment) {
      codeSegments.push(segment);
    }
  });
  
  return codeSegments.join('');
}

// 课程列表mock数据
const courseMockList = Array.from({ length: 35 }).map((_, index) => ({
  id: `${index + 1}`,
  code: `C${(10000 + index).toString()}`,
  name: `示例课程${index + 1}`,
  englishName: `Example Course ${index + 1}`,
  category: ['公共基础课', '专业基础课', '专业课', '实践教学', '通识选修课'][Math.floor(Math.random() * 5)],
  nature: ['必修', '选修', '限选'][Math.floor(Math.random() * 3)],
  credits: Math.floor(Math.random() * 5) + 1,
  theoryHours: Math.floor(Math.random() * 30) + 10,
  practiceHours: Math.floor(Math.random() * 20),
  totalHours: Math.floor(Math.random() * 50) + 20,
  examType: ['考试', '考查', '论文', '设计', '操作'][Math.floor(Math.random() * 5)],
  department: ['计算机学院', '机械学院', '电子信息学院', '外国语学院'][Math.floor(Math.random() * 4)],
  status: Math.random() > 0.2 ? 1 : 0,
  createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
}));

// 添加课程相关mock接口
const courseApis: MockMethod[] = [
  // 获取课程列表
  {
    url: '/api/course/list',
    method: 'get',
    response: ({ query }) => {
      const { pageSize = 10, pageIndex = 1, name = '', code = '', category = '', nature = '', department = '', sort = '', order = '' } = query;
      
      let filteredList = [...courseMockList];
      
      // 筛选
      if (name) {
        filteredList = filteredList.filter(item => item.name.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter(item => item.code.includes(code));
      }
      if (category) {
        filteredList = filteredList.filter(item => item.category === category);
      }
      if (nature) {
        filteredList = filteredList.filter(item => item.nature === nature);
      }
      if (department) {
        filteredList = filteredList.filter(item => item.department === department);
      }
      
      // 排序
      if (sort && order) {
        filteredList.sort((a, b) => {
          const sortField = sort as keyof typeof a;
          if (order === 'desc') {
            return String(b[sortField]).localeCompare(String(a[sortField]));
          } else {
            return String(a[sortField]).localeCompare(String(b[sortField]));
          }
        });
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
  
  // 添加课程
  {
    url: '/api/course/add',
    method: 'post',
    response: ({ body }) => {
      const { code, name } = body;
      
      // 检查是否存在
      const existingCourse = courseMockList.find(item => item.code === code);
      if (existingCourse) {
        return {
          code: 1,
          message: '课程代码已存在',
        };
      }
      
      // 新增
      const newId = courseMockList.length > 0 ? Math.max(...courseMockList.map(item => parseInt(item.id as string, 10))) + 1 : 1;
      const newCourse = {
        id: newId.toString(),
        ...body,
        totalHours: (body.theoryHours || 0) + (body.practiceHours || 0),
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      courseMockList.unshift(newCourse);
      
      return {
        code: 0,
        data: newCourse,
        message: '添加成功',
      };
    },
  },

  // 获取课程详情
  {
    url: '/api/course/:id',
    method: 'get',
    response: (options) => {
      // 确保params存在且能正确获取id
      const params = options.params || {};
      const query = options.query || {};
      
      // 首先尝试从params中获取id，如果没有则尝试从query中获取，最后提供默认值
      const id = params.id || query.id || '1';
      
      const categoryOptions = {
        'GC': '公共基础课',
        'ZJ': '专业基础课',
        'ZY': '专业课',
        'SJ': '实践教学',
        'TX': '通识选修课'
      };
      
      const natureOptions = {
        'required': '必修',
        'elective': '选修',
        'limited': '限选'
      };
      
      const examTypeOptions = {
        'exam': '考试',
        'check': '考查',
        'paper': '论文',
        'design': '设计',
        'operation': '操作'
      };
      
      const departmentOptions = {
        '3': '计算机学院',
        '4': '机械学院',
        '5': '电子信息学院',
        '6': '外国语学院'
      };
      
      // 使用种子确保同一ID每次生成的数据一致
      const seed = parseInt(id, 10);
      // 基于ID的随机数生成，为了保持一致性
      const randomBySeed = (min: number, max: number) => {
        const rnd = Math.sin(seed * 9999) * 10000;
        return min + Math.floor(Math.abs(rnd) % (max - min + 1));
      };
      
      const category = ['GC', 'ZJ', 'ZY', 'SJ', 'TX'][randomBySeed(0, 4)];
      const nature = ['required', 'elective', 'limited'][randomBySeed(0, 2)];
      const examType = ['exam', 'check', 'paper', 'design', 'operation'][randomBySeed(0, 4)];
      const department = `${randomBySeed(3, 6)}`;
      const status = randomBySeed(0, 10) > 2 ? 1 : 0;
      const theoryHours = randomBySeed(10, 40);
      const practiceHours = randomBySeed(0, 20);
      const credits = randomBySeed(1, 5);
      
      const course = {
        id,
        code: `C${10000 + parseInt(id, 10)}`,
        name: `示例课程${id}`,
        englishName: `Example Course ${id}`,
        category,
        categoryName: categoryOptions[category as keyof typeof categoryOptions],
        nature,
        natureName: natureOptions[nature as keyof typeof natureOptions],
        credits,
        theoryHours,
        practiceHours,
        totalHours: theoryHours + practiceHours,
        examType,
        examTypeName: examTypeOptions[examType as keyof typeof examTypeOptions],
        department,
        departmentName: departmentOptions[department as keyof typeof departmentOptions],
        status,
        statusName: status === 1 ? '正常' : '禁用',
        createdBy: '管理员',
        createdTime: '2023-01-15 10:30:45',
        updatedBy: '张三',
        updatedTime: '2023-03-20 14:25:18',
      };
      
      return {
        code: 0,
        data: course,
        message: 'ok',
      };
    },
  },

  // 修改课程
  {
    url: '/api/course/:id',
    method: 'put',
    response: ({ params, body }) => {
      const { id } = params;
      const courseIndex = courseMockList.findIndex(item => item.id === id);
      
      if (courseIndex === -1) {
        return {
          code: 1,
          message: '课程不存在',
        };
      }
      
      // 更新课程信息
      const updatedCourse = {
        ...courseMockList[courseIndex],
        ...body,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      courseMockList[courseIndex] = updatedCourse;
      
      return {
        code: 0,
        data: updatedCourse,
        message: '更新成功',
      };
    },
  },
];

// 添加课程导入导出相关的mock接口
const courseImportExportApis: MockMethod[] = [
  // 自动生成课程代码
  {
    url: '/api/course/code/generate',
    method: 'post',
    response: ({ body }: { body: { category?: string; department?: string; nature?: string; credits?: number } }) => {
      const { category, department, nature, credits } = body;
      
      // 验证必要参数
      if (!category) {
        return {
          code: 1,
          message: '请先选择课程类别',
          data: null
        };
      }
      
      if (!department) {
        return {
          code: 1,
          message: '请先选择开课院系',
          data: null
        };
      }
      
      if (!nature) {
        return {
          code: 1,
          message: '请先选择课程性质',
          data: null
        };
      }
      
      if (!credits) {
        return {
          code: 1,
          message: '请先填写学分',
          data: null
        };
      }
      
      // 根据规则匹配合适的课程代码规则
      // 这里模拟从课程代码规则中找到匹配的规则
      const matchedRule = mockCodeRules.find(rule => 
        rule.courseCategory === getCategoryName(category) && 
        rule.department.includes(department) &&
        rule.courseNature === getNatureName(nature)
      );
      
      let generatedCode = '';
      
      if (matchedRule) {
        // 使用匹配的规则生成代码
        const prefix = matchedRule.prefix;
        // 自增序列号
        const serialNumber = (matchedRule.currentSerialNumber++).toString().padStart(matchedRule.serialNumberLength, '0');
        // 根据规则组件生成代码
        generatedCode = generateCodeByComponents(matchedRule, prefix, serialNumber, department, nature, category);
      } else {
        // 使用默认规则生成代码
        const categoryPrefix = category ? {
          GC: 'G',
          ZJ: 'Z',
          ZY: 'Y',
          SJ: 'S',
          TX: 'T'
        }[category] || 'C' : 'C';
        
        const natureCode = nature ? {
          required: 'B',
          elective: 'X',
          limited: 'L'
        }[nature] || 'O' : 'O';
        
        const departmentCode = department ? department.substr(0, 1) : 'X';
        
        // 生成一个随机序号
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        // 组合代码
        generatedCode = `${categoryPrefix}${natureCode}${departmentCode}${randomNum}`;
      }
      
      return {
        code: 0,
        data: {
          code: generatedCode
        },
        message: '生成成功'
      };
    }
  },
  // 下载课程导入模板
  {
    url: '/api/course/import/template',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          url: 'http://example.com/course-template.xlsx',
          fileName: 'course-template.xlsx'
        },
        message: '模板下载成功'
      };
    },
  },
  
  // 导入课程
  {
    url: '/api/course/import',
    method: 'post',
    response: ({ body }) => {
      const mockResponse = {
        code: 0,
        message: '导入成功',
        data: {
          successCount: Math.floor(Math.random() * 20) + 10, // 模拟10-30条成功导入
          failCount: Math.floor(Math.random() * 5), // 模拟0-5条失败
          failList: [],
        },
      };
      
      // 随机生成失败记录
      if (mockResponse.data.failCount > 0) {
        for (let i = 0; i < mockResponse.data.failCount; i++) {
          mockResponse.data.failList.push({
            rowIndex: Math.floor(Math.random() * 100) + 1,
            reason: ['课程代码已存在', '课程名称不能为空', '学分格式错误', '开课院系不存在', '课程类别不存在'][
              Math.floor(Math.random() * 5)
            ],
          });
        }
      }
      
      return mockResponse;
    },
  },
  
  // 导出课程数据
  {
    url: '/api/course/export',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: '导出成功',
        data: {
          url: 'http://example.com/courses.xlsx',
          fileName: '课程数据_' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.xlsx',
        },
      };
    },
  },
  
  // 导出列表数据
  {
    url: '/api/course/export-list',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 0,
        message: '导出成功',
        data: {
          url: 'http://example.com/course-list.xlsx',
          fileName: '课程列表_' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.xlsx',
          total: body.pageSize || 0,
        },
      };
    },
  },
];

// 在文件最后添加课程变更相关的 Mock API

// 课程变更申请列表
const courseChangeApplications = Array.from({ length: 20 }).map((_, index) => {
  const randomCourse = courseMockList[Math.floor(Math.random() * courseMockList.length)];
  const isUpdate = Math.random() > 0.3;
  const status = ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)];
  const priority = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)];
  const randomDays = Math.floor(Math.random() * 60);
  const applyDate = new Date();
  applyDate.setDate(applyDate.getDate() - randomDays);
  
  return {
    id: `${index + 1000}`,
    courseId: randomCourse.id,
    courseName: randomCourse.name,
    courseCode: randomCourse.code,
    type: isUpdate ? 'update' : 'disable',
    status,
    priority,
    applyDate: applyDate.toISOString().split('T')[0],
    reason: `变更原因 ${index + 1}`,
    description: `详细说明 ${index + 1}`,
    creator: `申请人 ${Math.floor(Math.random() * 10) + 1}`,
    department: randomCourse.department,
    afterChange: isUpdate ? {
      credits: randomCourse.credits + (Math.random() > 0.5 ? 1 : -1),
      theoryHours: randomCourse.theoryHours + (Math.random() > 0.5 ? 5 : -5),
      practiceHours: randomCourse.practiceHours + (Math.random() > 0.5 ? 3 : -3),
      examType: randomCourse.examType === '考试' ? '考查' : '考试'
    } : null
  };
});

// 添加课程变更相关API
const courseChangeApis: MockMethod[] = [
  // 获取变更申请列表
  {
    url: '/api/course/audit/list',
    method: 'get',
    response: ({ query }) => {
      const { 
        pageSize = 10, 
        pageIndex = 1, 
        name = '', 
        code = '', 
        type = '', 
        status = '',
        dateStart = '',
        dateEnd = ''
      } = query;
      
      let filteredList = [...courseChangeApplications];
      
      // 筛选
      if (name) {
        filteredList = filteredList.filter(item => item.courseName.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter(item => item.courseCode.includes(code));
      }
      if (type) {
        filteredList = filteredList.filter(item => item.type === type);
      }
      if (status) {
        filteredList = filteredList.filter(item => item.status === status);
      }
      if (dateStart && dateEnd) {
        filteredList = filteredList.filter(item => {
          const applyDate = new Date(item.applyDate);
          const start = new Date(dateStart);
          const end = new Date(dateEnd);
          return applyDate >= start && applyDate <= end;
        });
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
  
  // 提交变更申请
  {
    url: '/api/course/audit/submit',
    method: 'post',
    response: ({ body }) => {
      const { courseId, type, description, afterChange } = body;
      
      // 检查必填字段
      if (!courseId || !type || !description) {
        return {
          code: 1,
          message: '缺少必要参数',
          data: null,
        };
      }
      
      // 如果是更新类型，检查afterChange
      if (type === 'update' && !afterChange) {
        return {
          code: 1,
          message: '缺少变更内容',
          data: null,
        };
      }
      
      // 添加新申请
      const newId = courseChangeApplications.length + 1001;
      const course = courseMockList.find(item => item.id === courseId);
      
      if (!course) {
        return {
          code: 1,
          message: '未找到指定课程',
          data: null,
        };
      }
      
      const newApplication = {
        id: `${newId}`,
        courseId,
        courseName: course.name,
        courseCode: course.code,
        type,
        status: 'pending',
        priority: body.priority || 'medium',
        applyDate: new Date().toISOString().split('T')[0],
        reason: body.reason || description,
        description,
        creator: '当前用户',
        department: course.department,
        afterChange: type === 'update' ? afterChange : null
      };
      
      courseChangeApplications.unshift(newApplication);
      
      return {
        code: 0,
        message: '申请提交成功',
        data: newApplication,
      };
    },
  },
  
  // 撤回变更申请
  {
    url: '/api/course/audit/withdraw/:id',
    method: 'post',
    response: ({ params }) => {
      const { id } = params;
      
      const applicationIndex = courseChangeApplications.findIndex(item => item.id === id);
      
      if (applicationIndex === -1) {
        return {
          code: 1,
          message: '未找到指定的申请',
          data: null,
        };
      }
      
      const application = courseChangeApplications[applicationIndex];
      
      if (application.status !== 'pending') {
        return {
          code: 1,
          message: '只有待审核的申请才能撤回',
          data: null,
        };
      }
      
      // 从列表中删除
      courseChangeApplications.splice(applicationIndex, 1);
      
      return {
        code: 0,
        message: '申请撤回成功',
        data: null,
      };
    },
  },
  
  // 获取变更申请详情
  {
    url: '/api/course/audit/detail/:id',
    method: 'get',
    response: ({ params }) => {
      const { id } = params;
      
      const application = courseChangeApplications.find(item => item.id === id);
      
      if (!application) {
        return {
          code: 1,
          message: '未找到指定的申请',
          data: null,
        };
      }
      
      // 获取关联课程的详细信息
      const course = courseMockList.find(item => item.id === application.courseId);
      
      return {
        code: 0,
        message: 'ok',
        data: {
          ...application,
          courseDetails: course
        },
      };
    },
  },
  
  // 获取课程选项列表（用于选择课程弹窗）
  {
    url: '/api/course/options',
    method: 'get',
    response: ({ query }) => {
      const { keyword = '', department = '', nature = '', category = '' } = query;
      
      let filteredList = [...courseMockList];
      
      // 根据关键字筛选
      if (keyword) {
        filteredList = filteredList.filter(item => 
          item.name.includes(keyword) || 
          item.code.includes(keyword) ||
          item.englishName.includes(keyword)
        );
      }
      
      // 应用筛选条件
      if (department) {
        filteredList = filteredList.filter(item => item.department === department);
      }
      
      if (nature) {
        filteredList = filteredList.filter(item => item.nature === nature);
      }
      
      if (category) {
        filteredList = filteredList.filter(item => item.category === category);
      }
      
      // 只返回需要的字段
      const options = filteredList.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        department: item.department,
        credits: item.credits,
        englishName: item.englishName || '',
        nature: item.nature,
        category: item.category,
        examType: item.examType
      }));
      
      return {
        code: 0,
        data: options,
        message: 'ok',
      };
    },
  }
];

// 将原有的 mock 方法数组赋值给变量
const originalMockMethods = [
  {
    url: '/api/get-purchase-list',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          'list|1-100': [
            {
              index: /S20201228115950[0-9][0-9][0-9]/,
              pdName: 'Macbook',
              pdNum: 'p_tmp_60a637cd0d',
              'purchaseNum|1-100': 100,
              adminName: '财务部111',
              updateTime: '2020-05-20@date("HH:mm:ss")',
              pdType: '电子产品',
            },
            {
              index: /S20201228115950[0-9][0-9][0-9]/,
              pdName: 'Macbook',
              pdNum: 'p_tmp_60a637cd0d',
              'purchaseNum|1-100': 100,
              adminName: '财务部',
              updateTime: '2020-05-20@date("HH:mm:ss")',
            },
          ],
        }),
      },
    }),
  },
  {
    url: '/api/get-list',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          'list|1-100': [
            {
              'index|+1': 1,
              'status|1': '@natural(0, 4)',
              no: 'BH00@natural(01, 100)',
              name: '@city()办公用品采购项目',
              'paymentType|1': '@natural(0, 1)',
              'contractType|1': '@natural(0, 2)',
              updateTime: '2020-05-30 @date("HH:mm:ss")',
              amount: '@natural(10, 500),000,000',
              adminName: '@cname()',
            },
          ],
        }),
      },
    }),
  },
  {
    url: '/api/detail-basic',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          name: 'td_20023747',
          loginType: 'Web',
          currentRole: 'Admin',
          rightsList: '通用权限',
          userStatus: '启用',
          language: '简体中文',
          timeZone: '(GMT+08:00)中国时区—北京（Asia/Beijing）',
        }),
      },
    }),
  },
  {
    url: '/api/get-card-list',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          'list|48-50': [
            {
              'index|+1': 1,
              isSetup: '@boolean',
              'type|1': '@natural(1, 5)',
              'banner|1': [
                'https://tdesign.gtimg.com/starter/cloud-db.jpg',
                'https://tdesign.gtimg.com/starter/cloud-server.jpg',
                'https://tdesign.gtimg.com/starter/ssl.jpg',
                'https://tdesign.gtimg.com/starter/t-sec.jpg',
                'https://tdesign.gtimg.com/starter/face-recognition.jpg',
              ],
              'name|1': ['人脸识别', 'SSL证书', 'CVM', '云数据库', 'T-Sec 云防火墙'],
              'description|1': [
                '基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸',
                '云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗',
                'SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部',
                '腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客',
                '云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。',
              ],
            },
          ],
        }),
      },
    }),
  },
  {
    url: '/api/get-project-list',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          'list|1-50': [
            {
              'index|+1': 1,
              adminPhone: '+86 13587609955',
              updateTime: '2020-05-30 @date("HH:mm:ss")',
              'adminName|1': ['顾娟	', '常刚', '郑洋'],
              'name|1': [
                '沧州市办公用品采购项目',
                '红河哈尼族彝族自治州办公用品采购项目	',
                '铜川市办公用品采购项目',
                '陇南市办公用品采购项目	',
                '六安市办公用品采购项目	 ',
              ],
            },
          ],
        }),
      },
    }),
  },
  {
    url: '/api/post',
    method: 'post',
    timeout: 2000,
    response: {
      code: 0,
      data: {
        name: 'vben',
      },
    },
  },
  {
    url: '/api/get-menu-list-i18n',
    method: 'get',
    timeout: 2000,
    response: {
      code: 0,
      data: {
        ...Mock.mock({
          list: [
            {
              path: '/list',
              name: 'list',
              component: 'LAYOUT',
              redirect: '/list/base',
              meta: {
                title: {
                  zh_CN: '列表页',
                  en_US: 'List',
                },
                icon: 'view-list',
              },
              children: [
                {
                  path: 'base',
                  name: 'ListBase',
                  component: '/list/base/index',
                  meta: {
                    title: {
                      zh_CN: '基础列表页',
                      en_US: 'Base List',
                    },
                  },
                },
                {
                  path: 'card',
                  name: 'ListCard',
                  component: '/list/card/index',
                  meta: {
                    title: {
                      zh_CN: '卡片列表页',
                      en_US: 'Card List',
                    },
                  },
                },
                {
                  path: 'filter',
                  name: 'ListFilter',
                  component: '/list/filter/index',
                  meta: {
                    title: {
                      zh_CN: '筛选列表页',
                      en_US: 'Filter List',
                    },
                  },
                },
                {
                  path: 'tree',
                  name: 'ListTree',
                  component: '/list/tree/index',
                  meta: {
                    title: {
                      zh_CN: '树状筛选列表页',
                      en_US: 'Tree List',
                    },
                  },
                },
              ],
            },
            {
              path: '/form',
              name: 'form',
              component: 'LAYOUT',
              redirect: '/form/base',
              meta: {
                title: {
                  zh_CN: '表单页',
                  en_US: 'Form',
                },
                icon: 'edit-1',
              },
              children: [
                {
                  path: 'base',
                  name: 'FormBase',
                  component: '/form/base/index',
                  meta: {
                    title: {
                      zh_CN: '基础表单页',
                      en_US: 'Base Form',
                    },
                  },
                },
                {
                  path: 'step',
                  name: 'FormStep',
                  component: '/form/step/index',
                  meta: {
                    title: {
                      zh_CN: '分步表单页',
                      en_US: 'Step Form',
                    },
                  },
                },
              ],
            },
            {
              path: '/detail',
              name: 'detail',
              component: 'LAYOUT',
              redirect: '/detail/base',
              meta: {
                title: {
                  zh_CN: '详情页',
                  en_US: 'Detail',
                },
                icon: 'layers',
              },
              children: [
                {
                  path: 'base',
                  name: 'DetailBase',
                  component: '/detail/base/index',
                  meta: {
                    title: {
                      zh_CN: '基础详情页',
                      en_US: 'Base Detail',
                    },
                  },
                },
                {
                  path: 'advanced',
                  name: 'DetailAdvanced',
                  component: '/detail/advanced/index',
                  meta: {
                    title: {
                      zh_CN: '多卡片详情页',
                      en_US: 'Card Detail',
                    },
                  },
                },
                {
                  path: 'deploy',
                  name: 'DetailDeploy',
                  component: '/detail/deploy/index',
                  meta: {
                    title: {
                      zh_CN: '数据详情页',
                      en_US: 'Data Detail',
                    },
                  },
                },
                {
                  path: 'secondary',
                  name: 'DetailSecondary',
                  component: '/detail/secondary/index',
                  meta: {
                    title: {
                      zh_CN: '二级详情页',
                      en_US: 'Secondary Detail',
                    },
                  },
                },
              ],
            },
            {
              path: '/frame',
              name: 'Frame',
              component: 'Layout',
              redirect: '/frame/doc',
              meta: {
                icon: 'internet',
                title: {
                  zh_CN: '外部页面',
                  en_US: 'External',
                },
              },
              children: [
                {
                  path: 'doc',
                  name: 'Doc',
                  component: 'IFrame',
                  meta: {
                    frameSrc: 'https://tdesign.tencent.com/starter/docs/vue-next/get-started',
                    title: {
                      zh_CN: '使用文档（内嵌）',
                      en_US: 'Documentation(IFrame)',
                    },
                  },
                },
                {
                  path: 'TDesign',
                  name: 'TDesign',
                  component: 'IFrame',
                  meta: {
                    frameSrc: 'https://tdesign.tencent.com/vue-next/getting-started',
                    title: {
                      zh_CN: 'TDesign 文档（内嵌）',
                      en_US: 'TDesign (IFrame)',
                    },
                  },
                },
                {
                  path: 'TDesign2',
                  name: 'TDesign2',
                  component: 'IFrame',
                  meta: {
                    frameSrc: 'https://tdesign.tencent.com/vue-next/getting-started',
                    frameBlank: true,
                    title: {
                      zh_CN: 'TDesign 文档（外链',
                      en_US: 'TDesign Doc(Link)',
                    },
                  },
                },
              ],
            },
          ],
        }),
      },
    },
  },
  // 基础数据-维护
  {
    url: '/api/system/basic-data/maintenance/list',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        common: [
          {
            id: '1',
            type: 'common',
            code: 'SEX',
            name: '性别',
            value: '{"male":"男","female":"女"}',
            sort: 1,
            remark: '用户性别选项',
            isActive: true,
            createTime: '2023-01-15 08:30:00',
            updateTime: '2023-03-20 14:22:30',
          },
          {
            id: '2',
            type: 'common',
            code: 'STATUS',
            name: '状态',
            value: '{"0":"禁用","1":"启用"}',
            sort: 2,
            remark: '通用状态选项',
            isActive: true,
            createTime: '2023-01-16 10:20:00',
            updateTime: '2023-02-28 11:30:45',
          },
        ],
        academic: [
          {
            id: '3',
            type: 'academic',
            code: 'DEGREE',
            name: '学位',
            value: '{"bachelor":"学士","master":"硕士","doctor":"博士"}',
            sort: 1,
            remark: '学位类型',
            isActive: true,
            createTime: '2023-01-18 13:45:00',
            updateTime: '2023-03-15 16:42:10',
          },
        ],
        system: [
          {
            id: '4',
            type: 'system',
            code: 'USER_TYPE',
            name: '用户类型',
            value: '{"admin":"管理员","teacher":"教师","student":"学生"}',
            sort: 1,
            remark: '系统用户类型',
            isActive: true,
            createTime: '2023-02-01 09:20:00',
            updateTime: '2023-03-10 09:15:25',
          },
          {
            id: '5',
            type: 'system',
            code: 'LOG_TYPE',
            name: '日志类型',
            value: '{"login":"登录日志","operation":"操作日志","error":"错误日志"}',
            sort: 2,
            remark: '系统日志类型',
            isActive: true,
            createTime: '2023-02-05 11:30:00',
            updateTime: '2023-03-05 10:20:15',
          },
        ],
      },
    }),
  },
  // 基础数据-维护-添加
  {
    url: '/api/system/basic-data/maintenance/add',
    method: 'post',
    response: ({ body }: { body: any }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
        message: '添加成功',
      };
    },
  },
  // 基础数据-维护-更新
  {
    url: '/api/system/basic-data/maintenance/update',
    method: 'post',
    response: ({ body }: { body: any }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
        message: '更新成功',
      };
    },
  },
  // 基础数据-维护-删除
  {
    url: '/api/system/basic-data/maintenance/delete',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: '删除成功',
      };
    },
  },
  
  // 基础数据-学院信息
  {
    url: '/api/system/basic-data/college/list',
    method: 'get',
    response: () => ({
      code: 0,
      data: [
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
      ],
    }),
  },
  // 基础数据-学院信息-添加
  {
    url: '/api/system/basic-data/college/add',
    method: 'post',
    response: ({ body }: { body: any }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
        message: '添加成功',
      };
    },
  },
  // 基础数据-学院信息-更新
  {
    url: '/api/system/basic-data/college/update',
    method: 'post',
    response: ({ body }: { body: any }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
        message: '更新成功',
      };
    },
  },
  // 基础数据-学院信息-删除
  {
    url: '/api/system/basic-data/college/delete',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: '删除成功',
      };
    },
  },
  
  // 基础数据-专业信息
  {
    url: '/api/system/basic-data/major/list',
    method: 'get',
    response: () => ({
      code: 0,
      data: [
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
      ],
    }),
  },
  // 基础数据-学院列表（简化版，用于下拉选择）
  {
    url: '/api/system/basic-data/college/select',
    method: 'get',
    response: () => ({
      code: 0,
      data: [
        { id: '1', code: 'CS', name: '计算机科学与工程学院' },
        { id: '2', code: 'EE', name: '电子工程学院' },
        { id: '3', code: 'MA', name: '数学与统计学院' },
        { id: '4', code: 'ME', name: '机械工程学院' },
        { id: '5', code: 'FL', name: '外国语学院' },
      ],
    }),
  },
  // 基础数据-专业信息-添加
  {
    url: '/api/system/basic-data/major/add',
    method: 'post',
    response: ({ body }: { body: any }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
        message: '添加成功',
      };
    },
  },
  // 基础数据-专业信息-更新
  {
    url: '/api/system/basic-data/major/update',
    method: 'post',
    response: ({ body }: { body: any }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
        message: '更新成功',
      };
    },
  },
  // 基础数据-专业信息-删除
  {
    url: '/api/system/basic-data/major/delete',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: '删除成功',
      };
    },
  },
  // 课程代码规则相关接口
  {
    url: '/api/course-code-rules',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          list: [
            {
              id: '1',
              name: '计算机专业课程代码规则',
              prefix: 'CS',
              startNum: 1001,
              currentNum: 1045,
              digitLength: 4,
              courseNature: '专业必修课',
              department: '计算机科学与技术学院',
              courseCategory: '专业基础课',
              courseType: '理论课',
              examType: '考试',
              courseAttr: '学位课',
              credit: 4,
              serialNumber: 'A',
              isActive: true,
              createTime: '2023-01-15 08:30:00',
              updateTime: '2023-03-20 14:22:30'
            },
            {
              id: '2',
              name: '电子信息工程课程代码规则',
              prefix: 'EE',
              startNum: 2001,
              currentNum: 2023,
              digitLength: 4,
              courseNature: '专业选修课',
              department: '电子信息工程学院',
              courseCategory: '专业方向课',
              courseType: '实验课',
              examType: '考查',
              courseAttr: '非学位课',
              credit: 2,
              serialNumber: 'B',
              isActive: true,
              createTime: '2023-01-15 09:15:00',
              updateTime: '2023-02-28 11:30:45'
            },
            {
              id: '3',
              name: '软件工程课程代码规则',
              prefix: 'SE',
              startNum: 3001,
              currentNum: 3012,
              digitLength: 4,
              courseNature: '公共必修课',
              department: '软件学院',
              courseCategory: '通识课',
              courseType: '理论实践课',
              examType: '考试',
              courseAttr: '学位课',
              credit: 3,
              serialNumber: 'C',
              isActive: true,
              createTime: '2023-01-16 10:20:00',
              updateTime: '2023-03-15 16:42:10'
            },
            {
              id: '4',
              name: '人工智能课程代码规则',
              prefix: 'AI',
              startNum: 4001,
              currentNum: 4008,
              digitLength: 4,
              courseNature: '公共选修课',
              department: '人工智能学院',
              courseCategory: '专业核心课',
              courseType: '实践课',
              examType: '考查',
              courseAttr: '非学位课',
              credit: 2,
              serialNumber: 'D',
              isActive: false,
              createTime: '2023-02-05 13:45:00',
              updateTime: '2023-03-10 09:15:25'
            },
            {
              id: '5',
              name: '数据科学课程代码规则',
              prefix: 'DS',
              startNum: 5001,
              currentNum: 5005,
              digitLength: 4,
              courseNature: '通识选修课',
              department: '数据科学学院',
              courseCategory: '创新创业课',
              courseType: '理论课',
              examType: '考试',
              courseAttr: '学位课',
              credit: 1,
              serialNumber: 'E',
              isActive: true,
              createTime: '2023-02-10 15:30:00',
              updateTime: '2023-03-05 10:20:15'
            }
          ],
          total: 5
        }
      };
    }
  },
  {
    url: '/api/course-code-rules/:id',
    method: 'get',
    response: ({ query }) => {
      const { id } = query;
      const rule = {
        id,
        name: `课程代码规则${id}`,
        prefix: ['CS', 'EE', 'SE', 'AI', 'DS'][parseInt(id) % 5],
        startNum: 1000 + parseInt(id) * 10,
        currentNum: 1000 + parseInt(id) * 10 + 5,
        digitLength: 4,
        courseNature: ['专业必修课', '专业选修课', '公共必修课', '公共选修课', '通识选修课'][parseInt(id) % 5],
        department: ['计算机科学与技术学院', '电子信息工程学院', '软件学院', '人工智能学院', '数据科学学院'][parseInt(id) % 5],
        courseCategory: ['专业基础课', '专业方向课', '通识课', '专业核心课', '创新创业课'][parseInt(id) % 5],
        courseType: ['理论课', '实验课', '理论实践课', '实践课', '理论课'][parseInt(id) % 5],
        examType: ['考试', '考查', '考试', '考查', '考试'][parseInt(id) % 5],
        courseAttr: ['学位课', '非学位课', '学位课', '非学位课', '学位课'][parseInt(id) % 5],
        credit: [4, 2, 3, 2, 1][parseInt(id) % 5],
        serialNumber: ['A', 'B', 'C', 'D', 'E'][parseInt(id) % 5],
        isActive: Boolean(parseInt(id) % 2),
        createTime: '2023-01-15 08:30:00',
        updateTime: '2023-03-20 14:22:30'
      };
      return {
        code: 0,
        data: rule
      };
    }
  },
  {
    url: '/api/course-code-rules',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      };
    }
  },
  {
    url: '/api/course-code-rules/:id',
    method: 'put',
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      };
    }
  },
  {
    url: '/api/course-code-rules/:id',
    method: 'delete',
    response: ({ query }) => {
      return {
        code: 0,
        data: {
          id: query.id
        }
      };
    }
  }
] as MockMethod[];

// 添加课程库代码规则的 mock 接口
const courseCodeRulesMock: MockMethod[] = [
  {
    url: '/api/course-library/code-rules',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          list: [
            {
              id: '1',
              name: '计算机专业课程代码规则',
              prefix: 'CS',
              startNum: 1001,
              currentNum: 1045,
              digitLength: 4,
              courseNature: '专业必修课',
              department: '计算机科学与技术学院',
              courseCategory: '专业基础课',
              courseType: '理论课',
              examType: '考试',
              courseAttr: '学位课',
              credit: 4,
              serialNumber: 'A',
              isActive: true,
              createTime: '2023-01-15 08:30:00',
              updateTime: '2023-03-20 14:22:30',
              components: [
                {
                  order: 1,
                  type: 'department',
                  codeType: 'system',
                  digitType: 'prefix',
                  digitCount: 2
                },
                {
                  order: 2,
                  type: 'courseNature',
                  codeType: 'system',
                  digitType: 'suffix',
                  digitCount: 1
                },
                {
                  order: 3,
                  type: 'serialNumber',
                  codeType: 'system',
                  digitType: 'suffix',
                  digitCount: 3
                }
              ]
            },
            {
              id: '2',
              name: '电子信息工程课程代码规则',
              prefix: 'EE',
              startNum: 2001,
              currentNum: 2023,
              digitLength: 4,
              courseNature: '专业选修课',
              department: '电子信息工程学院',
              courseCategory: '专业方向课',
              courseType: '实验课',
              examType: '考查',
              courseAttr: '非学位课',
              credit: 2,
              serialNumber: 'B',
              isActive: true,
              createTime: '2023-01-15 09:15:00',
              updateTime: '2023-02-28 11:30:45',
              components: [
                {
                  order: 1,
                  type: 'department',
                  codeType: 'system',
                  digitType: 'prefix',
                  digitCount: 2
                },
                {
                  order: 2,
                  type: 'courseType',
                  codeType: 'system',
                  digitType: 'suffix',
                  digitCount: 1
                },
                {
                  order: 3,
                  type: 'serialNumber',
                  codeType: 'system',
                  digitType: 'suffix',
                  digitCount: 3
                }
              ]
            }
          ],
          total: 2
        }
      };
    }
  },
  {
    url: '/api/course-library/code-rules/:id',
    method: 'get',
    response: ({ query }) => {
      const { id } = query;
      const rule = {
        id,
        name: `课程代码规则${id}`,
        prefix: ['CS', 'EE', 'SE', 'AI', 'DS'][parseInt(id as string) % 5],
        startSerialNumber: 1000 + parseInt(id as string) * 10,
        currentSerialNumber: 1000 + parseInt(id as string) * 10 + 5,
        serialNumberLength: 4,
        courseNature: ['专业必修课', '专业选修课', '公共必修课', '公共选修课', '通识选修课'][parseInt(id as string) % 5],
        department: ['计算机科学与技术学院', '电子信息工程学院', '软件学院', '人工智能学院', '数据科学学院'][parseInt(id as string) % 5],
        courseCategory: ['专业基础课', '专业方向课', '通识课', '专业核心课', '创新创业课'][parseInt(id as string) % 5],
        courseType: ['理论课', '实验课', '理论实践课', '实践课', '理论课'][parseInt(id as string) % 5],
        examType: ['考试', '考查', '考试', '考查', '考试'][parseInt(id as string) % 5],
        courseAttr: ['学位课', '非学位课', '学位课', '非学位课', '学位课'][parseInt(id as string) % 5],
        credit: [4, 2, 3, 2, 1][parseInt(id as string) % 5],
        isActive: Boolean(parseInt(id as string) % 2),
        createTime: '2023-01-15 08:30:00',
        updateTime: '2023-03-20 14:22:30',
        components: [
          {
            order: 1,
            type: 'department',
            codeType: 'system',
            digitType: 'prefix',
            digitCount: 2
          },
          {
            order: 2,
            type: parseInt(id as string) % 2 === 0 ? 'courseNature' : 'courseType',
            codeType: 'system',
            digitType: 'suffix',
            digitCount: 1
          },
          {
            order: 3,
            type: 'serialNumber',
            codeType: 'system',
            digitType: 'suffix',
            digitCount: 3
          }
        ],
        description: `这是课程代码规则${id}的说明`
      };
      return {
        code: 0,
        data: rule
      };
    }
  },
  {
    url: '/api/course-library/code-rules',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      };
    }
  },
  {
    url: '/api/course-library/code-rules/:id',
    method: 'put',
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      };
    }
  },
  {
    url: '/api/course-library/code-rules/:id',
    method: 'delete',
    response: ({ query }) => {
      return {
        code: 0,
        data: {
          id: query.id
        }
      };
    }
  }
];

// 添加课程详情API别名
const courseDetailApi = [
  {
    url: '/api/course/detail/:id',
    method: 'get',
    response: (options) => {
      // 确保params存在且能正确获取id
      const params = options.params || {};
      const id = params.id || '1';
      
      const categoryOptions = {
        'GC': '公共基础课',
        'ZJ': '专业基础课',
        'ZY': '专业课',
        'SJ': '实践教学',
        'TX': '通识选修课'
      };
      
      const natureOptions = {
        'required': '必修',
        'elective': '选修',
        'limited': '限选'
      };
      
      const examTypeOptions = {
        'exam': '考试',
        'check': '考查',
        'paper': '论文',
        'design': '设计',
        'operation': '操作'
      };
      
      const departmentOptions = {
        '3': '计算机学院',
        '4': '机械学院',
        '5': '电子信息学院',
        '6': '外国语学院'
      };
      
      // 使用种子确保同一ID每次生成的数据一致
      const seed = parseInt(id, 10);
      // 基于ID的随机数生成，为了保持一致性
      const randomBySeed = (min: number, max: number) => {
        const rnd = Math.sin(seed * 9999) * 10000;
        return min + Math.floor(Math.abs(rnd) % (max - min + 1));
      };
      
      const category = ['GC', 'ZJ', 'ZY', 'SJ', 'TX'][randomBySeed(0, 4)];
      const nature = ['required', 'elective', 'limited'][randomBySeed(0, 2)];
      const examType = ['exam', 'check', 'paper', 'design', 'operation'][randomBySeed(0, 4)];
      const department = `${randomBySeed(3, 6)}`;
      const status = randomBySeed(0, 10) > 2 ? 1 : 0;
      const theoryHours = randomBySeed(10, 40);
      const practiceHours = randomBySeed(0, 20);
      const credits = randomBySeed(1, 5);
      
      const course = {
        id,
        code: `C${10000 + parseInt(id, 10)}`,
        name: `示例课程${id}`,
        englishName: `Example Course ${id}`,
        category,
        categoryName: categoryOptions[category as keyof typeof categoryOptions],
        nature,
        natureName: natureOptions[nature as keyof typeof natureOptions],
        credits,
        theoryHours,
        practiceHours,
        totalHours: theoryHours + practiceHours,
        examType,
        examTypeName: examTypeOptions[examType as keyof typeof examTypeOptions],
        department,
        departmentName: departmentOptions[department as keyof typeof departmentOptions],
        status,
        statusName: status === 1 ? '正常' : '禁用',
        createdBy: '管理员',
        createdTime: '2023-01-15 10:30:45',
        updatedBy: '张三',
        updatedTime: '2023-03-20 14:25:18',
      };
      
      return {
        code: 0,
        data: course,
        message: 'ok',
      };
    },
  }
];

// 合并所有API
const allApis: MockMethod[] = [
  ...courseApis,
  ...courseBrowseApis,
  ...courseRelationApis,
  ...courseOptionsApis,  // 添加新的课程选项API
  ...programArchitectureApis, // 添加培养方案架构配置API
  ...programTemplateApis, // 添加课程体系管理API
  ...programOcrApis, // 添加OCR参数配置API
  ...programAiImportApis, // 添加AI导入API
  ...courseChangeApis,
  ...courseImportExportApis,
  ...courseCodeRulesMock,
  ...courseChangeApplications,
  ...courseDetailApi,
  ...courseSystemPreviewApis
];

export default allApis;
