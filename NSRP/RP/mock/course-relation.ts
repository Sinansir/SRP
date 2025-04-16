import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';

// 导入课程浏览mock数据
import courseBrowseList from './course-browse';

const relationTypes = ['prerequisite', 'subsequent', 'parallel', 'alternative'];
const statusTypes = ['active', 'inactive'];

// 从课程浏览数据中提取课程信息
const generateCoursesFromBrowseData = () => {
  // 获取课程浏览接口的返回函数
  const courseBrowseApi = courseBrowseList.find((api) => api.url === '/api/course/browse');
  
  if (!courseBrowseApi) {
    console.error('无法找到课程浏览API');
    return [];
  }
  
  // 模拟请求参数，获取所有课程
  const mockQuery = {
    query: {
      pageSize: 100,
      pageIndex: 1,
    },
  };
  
  // 调用API函数获取数据
  const response = courseBrowseApi.response(mockQuery);
  
  if (response.code !== 0 || !response.data || !response.data.list) {
    console.error('获取课程数据失败');
    return [];
  }
  
  // 提取并转换课程数据
  return response.data.list.map((course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
    category: course.category,
    nature: course.nature,
    credits: course.credits,
    department: course.department,
  }));
};

// 生成模拟关联数据
const generateRelations = (courses, count = 50) => {
  if (!courses || courses.length < 2) {
    console.error('课程数据不足，无法生成关联数据');
    return [];
  }
  
  const result = [];
  const courseCount = courses.length;
  
  for (let i = 0; i < count; i++) {
    const sourceIndex = Math.floor(Math.random() * courseCount);
    let targetIndex = Math.floor(Math.random() * courseCount);
    
    // 确保源课程和目标课程不同
    while (targetIndex === sourceIndex) {
      targetIndex = Math.floor(Math.random() * courseCount);
    }

    const sourceCourse = courses[sourceIndex];
    const targetCourse = courses[targetIndex];
    
    result.push({
      id: i + 1,
      sourceCourseId: sourceCourse.id,
      sourceCourseName: sourceCourse.name,
      sourceCourseCode: sourceCourse.code,
      targetCourseId: targetCourse.id,
      targetCourseName: targetCourse.name,
      targetCourseCode: targetCourse.code,
      relationType: relationTypes[Math.floor(Math.random() * relationTypes.length)],
      relationStrength: Math.floor(Math.random() * 91) + 10, // 10-100
      description: Mock.mock('@cparagraph(1, 3)'),
      status: statusTypes[Math.floor(Math.random() * statusTypes.length)],
      createTime: Mock.mock('@datetime'),
      updateTime: Mock.mock('@datetime'),
    });
  }
  return result;
};

// 模拟数据存储
const courses = generateCoursesFromBrowseData();
const relations = generateRelations(courses, 50);

// 导出课程列表，方便其他模块使用
export const courseOptions = courses.map(item => ({
  id: item.id,
  code: item.code,
  name: item.name,
}));

export default [
  // 课程关联分析 - 获取课程关联数据
  {
    url: '/api/course/relation/analysis',
    method: 'get',
    response: (config) => {
      const { sourceCourseId, current = 1, pageSize = 10 } = config.query || {};
      
      if (!sourceCourseId) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: { list: [], total: 0 },
        };
      }

      // 转换为数字进行比较
      const courseId = parseInt(sourceCourseId, 10);
      
      // 根据源课程ID筛选关联数据
      const filteredData = relations.filter(item => parseInt(item.sourceCourseId, 10) === courseId);
      
      // 分页处理
      const start = (parseInt(current, 10) - 1) * parseInt(pageSize, 10);
      const end = start + parseInt(pageSize, 10);
      const list = filteredData.slice(start, end);
      
      return {
        code: 0,
        data: {
          list,
          total: filteredData.length,
        },
      };
    },
  },

  // 课程关联图谱数据
  {
    url: '/api/course/relation/graph',
    method: 'get',
    response: (config) => {
      const { sourceCourseId } = config.query || {};
      
      if (!sourceCourseId) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null as any,
        };
      }
      
      // 寻找源课程，兼容字符串和数字类型的ID
      const courseId = parseInt(sourceCourseId, 10);
      const sourceCourse = courses.find(item => parseInt(item.id, 10) === courseId);
      
      if (!sourceCourse) {
        return {
          code: 404,
          message: '课程不存在',
          data: null as any,
        };
      }
      
      // 查找与源课程相关的所有关联
      const relatedRelations = relations.filter(item => 
        parseInt(item.sourceCourseId, 10) === courseId || 
        parseInt(item.targetCourseId, 10) === courseId
      );
      
      // 提取所有相关的课程ID (包括源课程和目标课程)
      const relatedCourseIds = new Set([courseId]);
      relatedRelations.forEach(item => {
        relatedCourseIds.add(parseInt(item.sourceCourseId, 10));
        relatedCourseIds.add(parseInt(item.targetCourseId, 10));
      });
      
      // 生成节点数据
      const nodes = Array.from(relatedCourseIds).map(id => {
        const course = courses.find(item => parseInt(item.id, 10) === id);
        return {
          id: id,
          name: course ? course.name : `课程${id}`,
          value: course ? course.credits : 1,
          category: course ? course.department : '未知',
          symbolSize: id === courseId ? 40 : 30, // 源课程节点更大
          itemStyle: id === courseId ? { color: '#FF6B00' } : undefined, // 源课程高亮
          tooltip: {
            formatter: () => {
              if (!course) return `课程${id}`;
              return `
                <div style="font-weight:bold;margin-bottom:5px;">${course.name}</div>
                <div>课程代码: ${course.code}</div>
                <div>课程类别: ${course.category}</div>
                <div>课程性质: ${course.nature}</div>
                <div>学分: ${course.credits}</div>
                <div>开课院系: ${course.department}</div>
              `;
            }
          }
        };
      });
      
      // 生成边数据
      const links = relatedRelations.map(item => {
        let lineStyle;
        let emphasis = {};
        let label = {};
        
        // 根据关系类型设置不同样式
        switch(item.relationType) {
          case 'prerequisite':
            lineStyle = { 
              color: '#5470C6',
              type: 'solid',
              width: item.relationStrength / 25 + 1, // 根据关联强度设置线宽
            };
            label = { show: true, formatter: '先修' };
            break;
          case 'subsequent':
            lineStyle = { 
              color: '#91CC75',
              type: 'solid',
              width: item.relationStrength / 25 + 1,
            };
            label = { show: true, formatter: '后续' };
            break;
          case 'parallel':
            lineStyle = { 
              color: '#FAC858',
              type: 'dashed',
              width: item.relationStrength / 25 + 1,
            };
            label = { show: true, formatter: '并行' };
            break;
          case 'alternative':
            lineStyle = { 
              color: '#EE6666', 
              type: 'dotted',
              width: item.relationStrength / 25 + 1,
            };
            label = { show: true, formatter: '替代' };
            break;
          default:
            lineStyle = { 
              width: item.relationStrength / 25 + 1,
            };
        }
        
        emphasis = {
          lineStyle: {
            width: (item.relationStrength / 25 + 1) * 2,
          }
        };
        
        return {
          source: item.sourceCourseId,
          target: item.targetCourseId,
          value: item.relationStrength,
          label,
          lineStyle,
          emphasis,
          tooltip: {
            formatter: () => {
              return `
                <div style="font-weight:bold;margin-bottom:5px;">${item.sourceCourseName} → ${item.targetCourseName}</div>
                <div>关系类型: ${item.relationType === 'prerequisite' ? '先修课程' : 
                               item.relationType === 'subsequent' ? '后续课程' : 
                               item.relationType === 'parallel' ? '并行课程' : 
                               item.relationType === 'alternative' ? '替代课程' : '未知'}</div>
                <div>关联强度: ${item.relationStrength}%</div>
                <div>描述: ${item.description}</div>
              `;
            }
          }
        };
      });
      
      // 返回图谱数据
      return {
        code: 0,
        data: {
          nodes,
          links,
          categories: [
            { name: '计算机学院' },
            { name: '机械学院' },
            { name: '电子信息学院' },
            { name: '外国语学院' },
          ]
        },
      };
    },
  },
  
  // 课程关联分析 - 获取课程列表
  {
    url: '/api/course/relation/course-list',
    method: 'get',
    response: (config) => {
      const { name, code, category, department, current = 1, pageSize = 10 } = config.query || {};
      
      // 根据条件筛选课程
      const filteredData = courses.filter(item => {
        if (name && !item.name.includes(name)) return false;
        if (code && !item.code.includes(code)) return false;
        if (category && item.category !== category) return false;
        if (department && item.department !== department) return false;
        return true;
      });
      
      // 分页处理
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredData.slice(start, end);
      
      return {
        code: 0,
        data: {
          list,
          total: filteredData.length,
        },
      };
    },
  },
  
  // 课程关联管理 - 获取关联列表
  {
    url: '/api/course/relation/list',
    method: 'get',
    response: (config) => {
      const { current = 1, pageSize = 10, sourceCourseId = '', targetCourseId = '', relationType = '', status = '' } = config.query || {};
      
      // 根据条件筛选关联数据
      const filteredData = relations.filter(item => {
        if (sourceCourseId && parseInt(item.sourceCourseId, 10) !== parseInt(sourceCourseId, 10)) return false;
        if (targetCourseId && parseInt(item.targetCourseId, 10) !== parseInt(targetCourseId, 10)) return false;
        if (relationType && item.relationType !== relationType) return false;
        if (status && item.status !== status) return false;
        return true;
      });
      
      // 分页处理
      const start = (parseInt(current, 10) - 1) * parseInt(pageSize, 10);
      const end = parseInt(current, 10) * parseInt(pageSize, 10);
      const list = filteredData.slice(start, end);
      
      return {
        code: 0,
        data: {
          list,
          total: filteredData.length,
        },
      };
    },
  },
  
  // 课程关联管理 - 添加关联
  {
    url: '/api/course/relation/add',
    method: 'post',
    response: (config) => {
      const { sourceCourseId, targetCourseId, relationType, relationStrength, description, status } = config.body;
      
      if (!sourceCourseId || !targetCourseId || !relationType) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null as any,
        };
      }
      
      // 获取课程信息
      const sourceId = parseInt(sourceCourseId, 10);
      const targetId = parseInt(targetCourseId, 10);
      const sourceCourse = courses.find(item => parseInt(item.id, 10) === sourceId);
      const targetCourse = courses.find(item => parseInt(item.id, 10) === targetId);
      
      if (!sourceCourse || !targetCourse) {
        return {
          code: 400,
          message: '课程不存在',
          data: null as any,
        };
      }
      
      // 创建新关联
      const newRelation = {
        id: relations.length + 1,
        sourceCourseId: sourceId,
        sourceCourseName: sourceCourse.name,
        sourceCourseCode: sourceCourse.code,
        targetCourseId: targetId,
        targetCourseName: targetCourse.name,
        targetCourseCode: targetCourse.code,
        relationType,
        relationStrength: relationStrength || 50,
        description: description || '',
        status: status || 'active',
        createTime: Mock.mock('@datetime'),
        updateTime: Mock.mock('@datetime'),
      };
      
      relations.unshift(newRelation);
      
      return {
        code: 0,
        data: newRelation,
      };
    },
  },
  
  // 课程关联管理 - 更新关联
  {
    url: '/api/course/relation/update',
    method: 'put',
    response: (config) => {
      const { id, sourceCourseId, targetCourseId, relationType, relationStrength, description, status } = config.body;
      
      if (!id || !sourceCourseId || !targetCourseId || !relationType) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null as any,
        };
      }
      
      // 获取课程信息
      const sourceId = parseInt(sourceCourseId, 10);
      const targetId = parseInt(targetCourseId, 10);
      const relationId = parseInt(id, 10);
      const sourceCourse = courses.find(item => parseInt(item.id, 10) === sourceId);
      const targetCourse = courses.find(item => parseInt(item.id, 10) === targetId);
      
      if (!sourceCourse || !targetCourse) {
        return {
          code: 400,
          message: '课程不存在',
          data: null as any,
        };
      }
      
      // 查找并更新关联
      const index = relations.findIndex(item => parseInt(item.id, 10) === relationId);
      if (index === -1) {
        return {
          code: 404,
          message: '关联不存在',
          data: null as any,
        };
      }
      
      relations[index] = {
        ...relations[index],
        sourceCourseId: sourceId,
        sourceCourseName: sourceCourse.name,
        sourceCourseCode: sourceCourse.code,
        targetCourseId: targetId,
        targetCourseName: targetCourse.name,
        targetCourseCode: targetCourse.code,
        relationType,
        relationStrength: relationStrength || 50,
        description: description || '',
        status: status || 'active',
        updateTime: Mock.mock('@datetime'),
      };
      
      return {
        code: 0,
        data: relations[index],
      };
    },
  },
  
  // 课程关联管理 - 删除关联
  {
    url: '/api/course/relation/delete/:id',
    method: 'delete',
    response: (config) => {
      const { id } = config.params;
      
      if (!id) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null as any,
        };
      }
      
      // 查找并删除关联
      const relationId = parseInt(id, 10);
      const index = relations.findIndex(item => parseInt(item.id, 10) === relationId);
      if (index === -1) {
        return {
          code: 404,
          message: '关联不存在',
          data: null as any,
        };
      }
      
      const deletedRelation = relations.splice(index, 1)[0];
      
      return {
        code: 0,
        data: deletedRelation,
      };
    },
  },
  
  // 课程关联管理 - 获取课程选项
  {
    url: '/api/course/relation/course-options',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          list: courseOptions,
        },
      };
    },
  },

  // 获取学院列表
  {
    url: '/api/course/relation/department-options',
    method: 'get',
    response: () => {
      const departments = ['计算机学院', '机械学院', '电子信息学院', '外国语学院'];
      return {
        code: 0,
        data: departments.map(name => ({ name, value: name })),
      };
    },
  },
  
  // 课程关联导出
  {
    url: '/api/course/relation/export',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 0,
        message: '导出成功',
        data: {
          url: 'http://example.com/course-relation.xlsx',
          fileName: '课程关联数据_' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.xlsx',
        },
      };
    },
  },
] as MockMethod[]; 