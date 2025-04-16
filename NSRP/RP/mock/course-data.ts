import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';

// 定义课程接口
export interface CourseData {
  id: string;
  code: string;
  name: string;
  englishName: string;
  category: string;
  nature: string;
  credits: number;
  theoryHours: number;
  practiceHours: number;
  totalHours: number;
  examType: string;
  department: string;
  status: number;
  createTime: string;
  updateTime?: string;
}

// 通用获取随机数的函数(基于ID)，确保同一ID获取相同随机值
export const getRandomBySeed = (min: number, max: number, seed: number) => {
  const seedRandom = (seed * 9301 + 49297) % 233280;
  const rnd = seedRandom / 233280;
  return min + Math.floor(rnd * (max - min + 1));
};

// 课程类别选项
export const categoryOptions = [
  { label: '公共基础课', value: 'GC' },
  { label: '专业基础课', value: 'ZJ' },
  { label: '专业课', value: 'ZY' },
  { label: '实践教学', value: 'SJ' },
  { label: '通识选修课', value: 'TX' }
];

// 课程性质选项
export const natureOptions = [
  { label: '必修', value: 'required' },
  { label: '选修', value: 'elective' },
  { label: '限选', value: 'limited' }
];

// 考试方式选项
export const examTypeOptions = [
  { label: '考试', value: 'exam' },
  { label: '考查', value: 'check' },
  { label: '论文', value: 'paper' },
  { label: '设计', value: 'design' },
  { label: '操作', value: 'operation' }
];

// 开课学院选项
export const departmentOptions = [
  { label: '计算机学院', value: 'computer' },
  { label: '机械学院', value: 'mechanical' },
  { label: '电子信息学院', value: 'electronics' },
  { label: '外国语学院', value: 'foreign_language' },
  { label: '数学学院', value: 'mathematics' },
  { label: '物理学院', value: 'physics' },
  { label: '化学学院', value: 'chemistry' }
];

// 生成基础课程数据(固定数据，不随机)
export const generateBaseCourseData = (): CourseData[] => {
  const courses: CourseData[] = [];
  
  // 为每个类别生成一些课程
  categoryOptions.forEach((category, categoryIndex) => {
    // 为每个开课学院生成对应类别的课程
    departmentOptions.forEach((department, departmentIndex) => {
      // 生成2门必修课和2门选修课
      for (let i = 0; i < 2; i++) {
        // 必修课
        const requiredCourseId = `${categoryIndex + 1}${departmentIndex + 1}${i + 1}1`;
        const codeNumber = parseInt(requiredCourseId, 10);
        
        const requiredCredits = getRandomBySeed(2, 5, codeNumber);
        const requiredTheoryHours = getRandomBySeed(16, 48, codeNumber);
        const requiredPracticeHours = getRandomBySeed(8, 32, codeNumber);
        const requiredTotalHours = requiredTheoryHours + requiredPracticeHours;
        
        courses.push({
          id: requiredCourseId,
          code: `${category.value}${codeNumber}`,
          name: `${category.label}必修${i + 1}`,
          englishName: `${category.value.replace(/_/g, ' ')} Required ${i + 1}`,
          category: category.label,
          nature: '必修',
          credits: requiredCredits,
          theoryHours: requiredTheoryHours,
          practiceHours: requiredPracticeHours,
          totalHours: requiredTotalHours,
          examType: examTypeOptions[getRandomBySeed(0, 4, codeNumber)].label,
          department: department.label,
          status: 1,
          createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
        });
        
        // 选修课
        const electiveCourseId = `${categoryIndex + 1}${departmentIndex + 1}${i + 1}2`;
        const electiveCodeNumber = parseInt(electiveCourseId, 10);
        
        const electiveCredits = getRandomBySeed(1, 3, electiveCodeNumber);
        const electiveTheoryHours = getRandomBySeed(12, 32, electiveCodeNumber);
        const electivePracticeHours = getRandomBySeed(4, 24, electiveCodeNumber);
        const electiveTotalHours = electiveTheoryHours + electivePracticeHours;
        
        courses.push({
          id: electiveCourseId,
          code: `${category.value}${electiveCodeNumber}`,
          name: `${category.label}选修${i + 1}`,
          englishName: `${category.value.replace(/_/g, ' ')} Elective ${i + 1}`,
          category: category.label,
          nature: '选修',
          credits: electiveCredits,
          theoryHours: electiveTheoryHours,
          practiceHours: electivePracticeHours,
          totalHours: electiveTotalHours,
          examType: examTypeOptions[getRandomBySeed(0, 4, electiveCodeNumber)].label,
          department: department.label,
          status: 1,
          createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
        });
      }
    });
  });
  
  return courses;
};

// 导出基础课程数据(单例)
export const baseCourseData = generateBaseCourseData();

// 根据ID获取课程详情
export const getCourseById = (id: string) => {
  return baseCourseData.find(course => course.id === id);
};

// 根据查询条件筛选课程
export const filterCourses = (query: any) => {
  const { 
    keyword = '', 
    name = '', 
    code = '', 
    category = '', 
    nature = '', 
    department = '',
    minCredits = '',
    maxCredits = ''
  } = query;
  
  let filteredList = [...baseCourseData];
  
  // 处理快速搜索关键字
  if (keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    filteredList = filteredList.filter(item => 
      item.name.toLowerCase().includes(lowercaseKeyword) || 
      item.code.toLowerCase().includes(lowercaseKeyword) ||
      item.englishName.toLowerCase().includes(lowercaseKeyword)
    );
  } else {
    // 单独字段筛选
    if (name) {
      filteredList = filteredList.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (code) {
      filteredList = filteredList.filter(item => item.code.toLowerCase().includes(code.toLowerCase()));
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
    
    // 学分范围筛选
    if (minCredits !== '') {
      const min = parseFloat(minCredits);
      filteredList = filteredList.filter(item => item.credits >= min);
    }
    if (maxCredits !== '') {
      const max = parseFloat(maxCredits);
      filteredList = filteredList.filter(item => item.credits <= max);
    }
  }
  
  return filteredList;
}; 