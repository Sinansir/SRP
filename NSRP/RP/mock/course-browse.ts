import { MockMethod } from 'vite-plugin-mock';
import { filterCourses } from './course-data';

// 课程浏览相关接口
const courseBrowseApis: MockMethod[] = [
  // 获取课程浏览列表
  {
    url: '/api/course/browse',
    method: 'get',
    response: (options: { query: Record<string, any> }) => {
      const query = options.query || {};
      const { 
        pageSize = 10, 
        pageIndex = 1, 
        name = '', 
        code = '', 
        category = '', 
        nature = '', 
        department = '',
        keyword = '',
        minCredits = '',
        maxCredits = ''
      } = query;
      
      // 使用course-data.ts中的filterCourses方法获取过滤后的课程数据
      const filteredList = filterCourses({
        name,
        code,
        category,
        nature,
        department,
        keyword,
        minCredits,
        maxCredits
      });
      
      // 分页
      const start = (parseInt(pageIndex as string, 10) - 1) * parseInt(pageSize as string, 10);
      const end = parseInt(pageIndex as string, 10) * parseInt(pageSize as string, 10);
      const list = filteredList.slice(start, end);
      
      console.log(`课程浏览: 总数=${filteredList.length}, 当前页=${pageIndex}, 每页=${pageSize}`);
      
      return {
        code: 0,
        data: {
          list,
          total: filteredList.length
        },
        message: 'ok'
      };
    }
  },
  
  // 课程浏览导出
  {
    url: '/api/course/browse/export',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: '导出成功',
        data: {
          url: 'http://example.com/course-browse.xlsx',
          fileName: `课程浏览数据_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`
        }
      };
    }
  }
];

export default courseBrowseApis; 