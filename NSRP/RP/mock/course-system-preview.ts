import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';
import { getAllModuleTypes, getAllModuleSubtypes } from './module-types';

// 定义课程接口
interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  hours: number;
  required: boolean;
  semester: string;
  moduleType: string;
  moduleSubcategory: string;
}

// 生成随机课程代码（字母+数字格式）
const generateCourseCode = (prefix: string, index: number) => {
  const letters = prefix.toUpperCase();
  const numbers = String(1000 + index).padStart(4, '0');
  return `${letters}${numbers}`;
};

// 获取模块类型名称
const getModuleTypeName = (moduleType: string) => {
  const type = getAllModuleTypes().find(t => t.moduleType === moduleType);
  return type ? type.name : moduleType;
};

// 获取模块子类名称
const getModuleSubtypeName = (subtypeId: string) => {
  const subtype = getAllModuleSubtypes().find(s => s.id === subtypeId);
  return subtype ? subtype.name : subtypeId;
};

// 生成课程数据
const generateCoursesForPreview = () => {
  const courses: Course[] = [];
  
  // 为每个模块类型生成课程
  getAllModuleTypes().forEach((type, typeIndex) => {
    // 获取该类型的子类
    const typeSubtypes = getAllModuleSubtypes().filter(subtype => subtype.typeId === type.id);
    
    // 为每个子类生成课程
    typeSubtypes.forEach((subtype, subtypeIndex) => {
      // 生成必修课程
      for (let i = 0; i < 3; i++) {
        const courseIndex = typeIndex * 100 + subtypeIndex * 10 + i;
        courses.push({
          id: `course_${type.moduleType}_${subtype.id}_req_${i}`,
          code: generateCourseCode(subtype.code, i + 1),
          name: `${subtype.name}必修课程${i + 1}`,
          credits: 2 + (i % 3),
          hours: (2 + (i % 3)) * 16,
          required: true,
          semester: `${1 + Math.floor(i / 2)}-${1 + (i % 2)}`,
          moduleType: getModuleTypeName(type.moduleType),
          moduleSubcategory: subtype.name
        });
      }
      
      // 生成选修课程
      for (let i = 0; i < 2; i++) {
        const courseIndex = typeIndex * 100 + subtypeIndex * 10 + i + 50;
        courses.push({
          id: `course_${type.moduleType}_${subtype.id}_elec_${i}`,
          code: generateCourseCode(subtype.code, i + 51),
          name: `${subtype.name}选修课程${i + 1}`,
          credits: 1 + (i % 2),
          hours: (1 + (i % 2)) * 16,
          required: false,
          semester: `${2 + Math.floor(i / 2)}-${1 + (i % 2)}`,
          moduleType: getModuleTypeName(type.moduleType),
          moduleSubcategory: subtype.name
        });
      }
    });
  });
  
  return courses;
};

// 模拟的课程数据
export const previewCourses = generateCoursesForPreview();

// Mock API
export default [
  {
    url: '/api/program/curriculum-system/preview/:id',
    method: 'get',
    response: ({ query, params }) => {
      // 这里可以根据ID返回不同的课程体系预览数据
      return {
        code: 0,
        message: 'ok',
        data: {
          courses: previewCourses,
          // 其他课程体系数据...
        }
      };
    }
  }
] as MockMethod[]; 