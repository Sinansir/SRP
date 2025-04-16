import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';
import { baseCourseData } from './course-data';

// 课程详情API
const courseDetailApis: MockMethod[] = [
  {
    url: '/api/course/detail/:id',
    method: 'get',
    response: (options) => {
      const { url, params } = options;
      let id = '';
      
      // 从URL路径中提取ID
      if (url) {
        const matches = url.match(/\/api\/course\/detail\/(\w+)/);
        if (matches && matches[1]) {
          id = matches[1];
        }
      }
      
      // 如果URL路径中没有，则从params中获取
      if (!id && params && params.id) {
        id = params.id;
      }
      
      console.log('课程详情API - 请求课程ID:', id);
      
      if (!id) {
        return {
          code: 400,
          message: '缺少课程ID',
          data: null
        };
      }
      
      // 查找对应的课程
      let course = baseCourseData.find(item => String(item.id) === String(id));
      
      // 如果找不到对应ID的课程，则使用第一个课程（仅用于演示）
      if (!course && baseCourseData.length > 0) {
        console.log(`未找到ID为 ${id} 的课程，使用第一个可用课程作为演示`);
        course = baseCourseData[0];
      }
      
      if (!course) {
        return {
          code: 404,
          message: '课程不存在',
          data: null
        };
      }
      
      // 使用基于ID的随机数生成，确保同ID课程返回相同数据
      const seedValue = typeof id === 'string' ? parseInt(id.replace(/\D/g, ''), 10) || 12345 : 12345;
      
      // 创建教学资料数据
      const materials = [
        {
          id: 1,
          name: '教学大纲.doc',
          type: '文档',
          size: '245KB',
          uploadTime: '2023-02-15',
        },
        {
          id: 2,
          name: '课程PPT第一章.pptx',
          type: '演示文稿',
          size: '3.5MB',
          uploadTime: '2023-02-18',
        },
        {
          id: 3,
          name: '参考资料.pdf',
          type: '文档',
          size: '1.2MB',
          uploadTime: '2023-02-20',
        },
      ];
      
      // 构建完整的课程详情对象
      const courseDetail = {
        ...course,
        id: course.id,
        code: course.code,
        name: course.name,
        englishName: course.englishName,
        category: course.category,
        categoryName: course.category,
        nature: course.nature,
        natureName: course.nature,
        credits: course.credits,
        theoryHours: course.theoryHours,
        practiceHours: course.practiceHours,
        totalHours: course.totalHours,
        examType: course.examType,
        examTypeName: course.examType,
        department: course.department,
        departmentName: course.department,
        isCore: false,
        isBilingual: false,
        status: 1,
        statusName: '正常',
        createdBy: 'admin',
        createdTime: course.createTime,
        updatedBy: 'admin',
        updatedTime: course.updateTime || course.createTime,
        description: `这是${course.name}的课程描述，包含课程大纲、教学目标和考核方式等信息。`
      };
      
      return {
        code: 0,
        data: courseDetail,
        message: 'ok'
      };
    }
  }
];

export default courseDetailApis; 