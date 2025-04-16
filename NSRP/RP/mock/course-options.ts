import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';
import courseBrowseApis from './course-browse';

// 从课程浏览数据生成课程选项数据
const generateCourseOptions = () => {
  // 获取课程浏览API返回的数据
  const courseBrowseApi = courseBrowseApis.find((api) => api.url === '/api/course/browse');
  if (!courseBrowseApi) {
    console.error('无法找到课程浏览API');
    return [];
  }

  // 模拟请求获取课程数据
  const mockQuery = {
    query: {
      pageSize: 100,
      pageIndex: 1,
    },
  };

  const response = courseBrowseApi.response(mockQuery);
  if (response.code !== 0 || !response.data || !response.data.list) {
    console.error('获取课程数据失败');
    return [];
  }

  // 将课程数据转换为选项格式
  return response.data.list.map((course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
    englishName: course.englishName,
    category: course.category,
    nature: course.nature,
    credits: course.credits,
    department: course.department,
  }));
};

// 生成课程选项数据
const courseOptions = generateCourseOptions();

export default [
  // 获取课程选项列表（用于课程选择器）
  {
    url: '/api/course/options',
    method: 'get',
    response: ({ query }) => {
      const { keyword = '', department = '', nature = '', category = '' } = query;
      
      // 根据条件筛选课程
      let filteredOptions = [...courseOptions];
      
      if (keyword) {
        const keywordLower = keyword.toLowerCase();
        filteredOptions = filteredOptions.filter((item) => 
          item.name.toLowerCase().includes(keywordLower) || 
          item.code.toLowerCase().includes(keywordLower)
        );
      }
      
      if (department) {
        filteredOptions = filteredOptions.filter(item => item.department === department);
      }
      
      if (nature) {
        filteredOptions = filteredOptions.filter(item => item.nature === nature);
      }
      
      if (category) {
        filteredOptions = filteredOptions.filter(item => item.category === category);
      }
      
      return {
        code: 0,
        data: {
          list: filteredOptions
        },
        message: 'ok'
      };
    }
  },
  
  // 获取课程详情（作为/api/course/:id的别名）
  {
    url: '/api/course/detail/:id',
    method: 'get',
    response: (options) => {
      const params = options.params || {};
      let id = params.id || '';
      
      // 从URL中提取课程ID
      if (!id && options.url) {
        const matches = options.url.match(/\/api\/course\/detail\/(\w+)/);
        if (matches && matches[1]) {
          id = matches[1];
        }
      }
      
      console.log('正在查询课程ID:', id);
      
      if (!id) {
        return {
          code: 400,
          message: '缺少课程ID',
          data: null
        };
      }
      
      // 尝试在课程列表中查找匹配的课程
      let course = null;
      
      // 首先尝试精确匹配ID
      course = courseOptions.find(item => String(item.id) === String(id));
      
      // 如果未找到，再尝试从courseOptions中找到任意一个课程（仅用于演示目的）
      if (!course && courseOptions.length > 0) {
        console.log(`未找到ID为 ${id} 的课程，使用第一个可用课程作为演示`);
        course = courseOptions[0];
      }
      
      if (!course) {
        return {
          code: 404,
          message: '课程不存在',
          data: null
        };
      }
      
      // 为保持数据一致性，创建教学资料数据
      const teachingMaterials = [
        {
          id: 1,
          name: '教材1.pdf',
          type: 'pdf',
          size: '2.5MB',
          uploadTime: Mock.mock('@datetime'),
          url: 'http://example.com/materials/book1.pdf'
        },
        {
          id: 2,
          name: '参考资料.docx',
          type: 'doc',
          size: '1.2MB',
          uploadTime: Mock.mock('@datetime'),
          url: 'http://example.com/materials/reference.docx'
        }
      ];
      
      // 使用基于ID的随机数生成，确保同ID课程返回相同数据
      const randomBySeed = (min: number, max: number, seed: number) => {
        const seedRandom = (seed * 9301 + 49297) % 233280;
        const rnd = seedRandom / 233280;
        return min + Math.floor(rnd * (max - min));
      };
      
      const seedValue = parseInt(id, 10);
      const totalHours = randomBySeed(30, 80, seedValue);
      const theoryHours = randomBySeed(20, totalHours - 10, seedValue);
      const practiceHours = totalHours - theoryHours;
      
      // 构建完整的课程详情
      const courseDetail = {
        ...course,
        theoryHours,
        practiceHours,
        totalHours,
        examType: ['考试', '考查', '论文', '设计', '操作'][randomBySeed(0, 4, seedValue)],
        status: randomBySeed(0, 10, seedValue) > 2 ? 1 : 0,
        createTime: Mock.mock('@datetime'),
        updateTime: Mock.mock('@datetime'),
        teachingMaterials
      };
      
      return {
        code: 0,
        data: courseDetail,
        message: 'ok'
      };
    }
  }
] as MockMethod[]; 