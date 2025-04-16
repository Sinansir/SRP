import { MockMethod } from 'vite-plugin-mock';

// 课程代码规则的模拟数据
const mockCodeRules = [
  {
    id: '1',
    name: '计算机专业课程代码规则',
    prefix: 'CS',
    startSerialNumber: 1001,
    currentSerialNumber: 1045,
    serialNumberLength: 3,
    courseNature: '专业必修课',
    department: '计算机科学与技术学院',
    courseCategory: '专业基础课',
    courseType: '理论课',
    examType: '考试',
    courseAttr: '学位课',
    credit: 4,
    isActive: true,
    createTime: '2023-01-15 08:30:00',
    updateTime: '2023-03-20 14:22:30',
    components: [
      {
        order: 1,
        type: 'department',
        codeType: 'system',
        digitType: 'prefix',
        digitCount: 2,
      },
      {
        order: 2,
        type: 'courseNature',
        codeType: 'system',
        digitType: 'suffix',
        digitCount: 1,
      },
      {
        order: 3,
        type: 'serialNumber',
        codeType: 'system',
        digitType: 'suffix',
        digitCount: 3,
      },
    ],
    description: '计算机专业课程代码规则',
  },
  {
    id: '2',
    name: '电子信息工程课程代码规则',
    prefix: 'EE',
    startSerialNumber: 2001,
    currentSerialNumber: 2023,
    serialNumberLength: 3,
    courseNature: '专业选修课',
    department: '电子信息工程学院',
    courseCategory: '专业方向课',
    courseType: '实验课',
    examType: '考查',
    courseAttr: '非学位课',
    credit: 2,
    isActive: true,
    createTime: '2023-01-15 09:15:00',
    updateTime: '2023-02-28 11:30:45',
    components: [
      {
        order: 1,
        type: 'department',
        codeType: 'system',
        digitType: 'prefix',
        digitCount: 2,
      },
      {
        order: 2,
        type: 'courseType',
        codeType: 'system',
        digitType: 'suffix',
        digitCount: 1,
      },
      {
        order: 3,
        type: 'serialNumber',
        codeType: 'system',
        digitType: 'suffix',
        digitCount: 3,
      },
    ],
    description: '电子信息工程课程代码规则',
  },
];

// 定义 Mock 接口
export default [
  // 获取课程代码规则列表
  {
    url: '/api/course-code-rules',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { current = 1, pageSize = 10 } = query;
      const startIndex = (Number(current) - 1) * Number(pageSize);
      const endIndex = startIndex + Number(pageSize);
      const list = mockCodeRules.slice(startIndex, endIndex);

      return {
        code: 0,
        data: {
          list,
          total: mockCodeRules.length,
        },
      };
    },
  },
  
  // 获取单个课程代码规则详情
  {
    url: '/api/course-code-rules/:id',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { id } = query;
      const rule = mockCodeRules.find((item) => item.id === id);
      
      if (!rule) {
        return {
          code: 1,
          message: '未找到对应的课程代码规则',
        };
      }
      
      return {
        code: 0,
        data: rule,
      };
    },
  },
  
  // 创建课程代码规则
  {
    url: '/api/course-code-rules',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const newId = `${mockCodeRules.length + 1}`;
      const newRule = {
        ...body,
        id: newId,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      mockCodeRules.push(newRule);
      
      return {
        code: 0,
        data: {
          ...newRule,
        },
      };
    },
  },
  
  // 更新课程代码规则
  {
    url: '/api/course-code-rules/:id',
    method: 'put',
    response: ({ query, body }: { query: any; body: any }) => {
      const { id } = query;
      const index = mockCodeRules.findIndex((item) => item.id === id);
      
      if (index === -1) {
        return {
          code: 1,
          message: '未找到对应的课程代码规则',
        };
      }
      
      const updatedRule = {
        ...mockCodeRules[index],
        ...body,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      mockCodeRules[index] = updatedRule;
      
      return {
        code: 0,
        data: updatedRule,
      };
    },
  },
  
  // 删除课程代码规则
  {
    url: '/api/course-code-rules/:id',
    method: 'delete',
    response: ({ query }: { query: any }) => {
      const { id } = query;
      const index = mockCodeRules.findIndex((item) => item.id === id);
      
      if (index === -1) {
        return {
          code: 1,
          message: '未找到对应的课程代码规则',
        };
      }
      
      mockCodeRules.splice(index, 1);
      
      return {
        code: 0,
        data: {
          id,
        },
      };
    },
  },
] as MockMethod[]; 