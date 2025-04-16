import { MockMethod } from 'vite-plugin-mock';

// 课程性质列表
const courseNatures = [
  { id: 1, code: 'BX', name: '必修', status: 1, sort: 1, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 2, code: 'XX', name: '选修', status: 1, sort: 2, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 3, code: 'XB', name: '限必', status: 1, sort: 3, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 4, code: 'TX', name: '通选', status: 1, sort: 4, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 5, code: 'ZX', name: '专选', status: 0, sort: 5, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' }
];

// 课程类别列表
const courseCategories = [
  { id: 1, code: 'GC', name: '公共基础课', status: 1, sort: 1, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 2, code: 'ZJ', name: '专业基础课', status: 1, sort: 2, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 3, code: 'ZY', name: '专业课', status: 1, sort: 3, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 4, code: 'SJ', name: '实践教学', status: 1, sort: 4, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 5, code: 'TX', name: '通识选修课', status: 1, sort: 5, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 6, code: 'JX', name: '集中实践', status: 0, sort: 6, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' }
];

// 考试形式列表
const examTypes = [
  { id: 1, code: 'KS', name: '考试', status: 1, sort: 1, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 2, code: 'KC', name: '考查', status: 1, sort: 2, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 3, code: 'LW', name: '论文', status: 1, sort: 3, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 4, code: 'SJ', name: '设计', status: 1, sort: 4, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
  { id: 5, code: 'CZ', name: '操作', status: 0, sort: 5, createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' }
];

export default [
  // 获取课程性质列表
  {
    url: '/api/course/nature/list',
    method: 'get',
    response: ({ query }) => {
      const { pageSize = 10, pageIndex = 1, name = '', code = '', status = '' } = query;
      
      let filteredList = [...courseNatures];
      
      // 筛选
      if (name) {
        filteredList = filteredList.filter(item => item.name.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter(item => item.code.includes(code));
      }
      if (status !== '') {
        filteredList = filteredList.filter(item => item.status === parseInt(status, 10));
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
  
  // 添加课程性质
  {
    url: '/api/course/nature/add',
    method: 'post',
    response: ({ body }) => {
      const { name, code } = body;
      
      // 检查是否存在
      const existingItem = courseNatures.find(item => item.code === code);
      if (existingItem) {
        return {
          code: 1,
          message: '课程性质代码已存在',
        };
      }
      
      // 新增
      const newId = courseNatures.length > 0 ? Math.max(...courseNatures.map(item => item.id)) + 1 : 1;
      const newItem = {
        id: newId,
        name,
        code,
        status: 1,
        sort: courseNatures.length + 1,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      courseNatures.push(newItem);
      
      return {
        code: 0,
        data: newItem,
        message: '添加成功',
      };
    },
  },
  
  // 修改课程性质
  {
    url: '/api/course/nature/update',
    method: 'put',
    response: ({ body }) => {
      const { id, name, code, status, sort } = body;
      
      // 查找是否存在
      const index = courseNatures.findIndex(item => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: '课程性质不存在',
        };
      }
      
      // 检查代码是否已被其他记录使用
      const duplicateCode = courseNatures.find(item => item.code === code && item.id !== id);
      if (duplicateCode) {
        return {
          code: 1,
          message: '课程性质代码已存在',
        };
      }
      
      // 更新
      courseNatures[index] = {
        ...courseNatures[index],
        name,
        code,
        status: typeof status === 'number' ? status : courseNatures[index].status,
        sort: typeof sort === 'number' ? sort : courseNatures[index].sort,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      return {
        code: 0,
        data: courseNatures[index],
        message: '更新成功',
      };
    },
  },
  
  // 删除课程性质
  {
    url: '/api/course/nature/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      const id = parseInt(params.id, 10);
      
      // 查找是否存在
      const index = courseNatures.findIndex(item => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: '课程性质不存在',
        };
      }
      
      // 删除
      courseNatures.splice(index, 1);
      
      return {
        code: 0,
        message: '删除成功',
      };
    },
  },
  
  // 同步课程性质
  {
    url: '/api/course/nature/sync',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: '同步成功',
        data: {
          added: 2,
          updated: 1,
          failed: 0,
        }
      };
    },
  },
  
  // 获取课程类别列表
  {
    url: '/api/course/category/list',
    method: 'get',
    response: ({ query }) => {
      const { pageSize = 10, pageIndex = 1, name = '', code = '', status = '' } = query;
      
      let filteredList = [...courseCategories];
      
      // 筛选
      if (name) {
        filteredList = filteredList.filter(item => item.name.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter(item => item.code.includes(code));
      }
      if (status !== '') {
        filteredList = filteredList.filter(item => item.status === parseInt(status, 10));
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
  
  // 添加课程类别
  {
    url: '/api/course/category/add',
    method: 'post',
    response: ({ body }) => {
      const { name, code } = body;
      
      // 检查是否存在
      const existingItem = courseCategories.find(item => item.code === code);
      if (existingItem) {
        return {
          code: 1,
          message: '课程类别代码已存在',
        };
      }
      
      // 新增
      const newId = courseCategories.length > 0 ? Math.max(...courseCategories.map(item => item.id)) + 1 : 1;
      const newItem = {
        id: newId,
        name,
        code,
        status: 1,
        sort: courseCategories.length + 1,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      courseCategories.push(newItem);
      
      return {
        code: 0,
        data: newItem,
        message: '添加成功',
      };
    },
  },
  
  // 修改课程类别
  {
    url: '/api/course/category/update',
    method: 'put',
    response: ({ body }) => {
      const { id, name, code, status, sort } = body;
      
      // 查找是否存在
      const index = courseCategories.findIndex(item => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: '课程类别不存在',
        };
      }
      
      // 检查代码是否已被其他记录使用
      const duplicateCode = courseCategories.find(item => item.code === code && item.id !== id);
      if (duplicateCode) {
        return {
          code: 1,
          message: '课程类别代码已存在',
        };
      }
      
      // 更新
      courseCategories[index] = {
        ...courseCategories[index],
        name,
        code,
        status: typeof status === 'number' ? status : courseCategories[index].status,
        sort: typeof sort === 'number' ? sort : courseCategories[index].sort,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      return {
        code: 0,
        data: courseCategories[index],
        message: '更新成功',
      };
    },
  },
  
  // 删除课程类别
  {
    url: '/api/course/category/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      const id = parseInt(params.id, 10);
      
      // 查找是否存在
      const index = courseCategories.findIndex(item => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: '课程类别不存在',
        };
      }
      
      // 删除
      courseCategories.splice(index, 1);
      
      return {
        code: 0,
        message: '删除成功',
      };
    },
  },
  
  // 同步课程类别
  {
    url: '/api/course/category/sync',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: '同步成功',
        data: {
          added: 3,
          updated: 2,
          failed: 0,
        }
      };
    },
  },
  
  // 获取考试形式列表
  {
    url: '/api/course/exam-type/list',
    method: 'get',
    response: ({ query }) => {
      const { pageSize = 10, pageIndex = 1, name = '', code = '', status = '' } = query;
      
      let filteredList = [...examTypes];
      
      // 筛选
      if (name) {
        filteredList = filteredList.filter(item => item.name.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter(item => item.code.includes(code));
      }
      if (status !== '') {
        filteredList = filteredList.filter(item => item.status === parseInt(status, 10));
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
  
  // 添加考试形式
  {
    url: '/api/course/exam-type/add',
    method: 'post',
    response: ({ body }) => {
      const { name, code } = body;
      
      // 检查是否存在
      const existingItem = examTypes.find(item => item.code === code);
      if (existingItem) {
        return {
          code: 1,
          message: '考试形式代码已存在',
        };
      }
      
      // 新增
      const newId = examTypes.length > 0 ? Math.max(...examTypes.map(item => item.id)) + 1 : 1;
      const newItem = {
        id: newId,
        name,
        code,
        status: 1,
        sort: examTypes.length + 1,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      examTypes.push(newItem);
      
      return {
        code: 0,
        data: newItem,
        message: '添加成功',
      };
    },
  },
  
  // 修改考试形式
  {
    url: '/api/course/exam-type/update',
    method: 'put',
    response: ({ body }) => {
      const { id, name, code, status, sort } = body;
      
      // 查找是否存在
      const index = examTypes.findIndex(item => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: '考试形式不存在',
        };
      }
      
      // 检查代码是否已被其他记录使用
      const duplicateCode = examTypes.find(item => item.code === code && item.id !== id);
      if (duplicateCode) {
        return {
          code: 1,
          message: '考试形式代码已存在',
        };
      }
      
      // 更新
      examTypes[index] = {
        ...examTypes[index],
        name,
        code,
        status: typeof status === 'number' ? status : examTypes[index].status,
        sort: typeof sort === 'number' ? sort : examTypes[index].sort,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      
      return {
        code: 0,
        data: examTypes[index],
        message: '更新成功',
      };
    },
  },
  
  // 删除考试形式
  {
    url: '/api/course/exam-type/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      const id = parseInt(params.id, 10);
      
      // 查找是否存在
      const index = examTypes.findIndex(item => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: '考试形式不存在',
        };
      }
      
      // 删除
      examTypes.splice(index, 1);
      
      return {
        code: 0,
        message: '删除成功',
      };
    },
  },
  
  // 同步考试形式
  {
    url: '/api/course/exam-type/sync',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: '同步成功',
        data: {
          added: 1,
          updated: 3,
          failed: 0,
        }
      };
    },
  },
] as MockMethod[]; 