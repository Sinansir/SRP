/**
 * 培养方案管理模块类型定义
 */

// 培养方案状态枚举
export enum ProgramStatus {
  DRAFT = 'draft',       // 草稿
  PENDING = 'pending',   // 待审核
  PUBLISHED = 'published', // 已发布
  ARCHIVED = 'archived', // 已归档
  REJECTED = 'rejected', // 已驳回
}

// 学科门类枚举
export enum DisciplineCategory {
  ENGINEERING = 'engineering', // 工学
  SCIENCE = 'science',         // 理学
  LITERATURE = 'literature',   // 文学
  MANAGEMENT = 'management',   // 管理学
  ECONOMICS = 'economics',     // 经济学
  LAW = 'law',                 // 法学
  EDUCATION = 'education',     // 教育学
  MEDICINE = 'medicine',       // 医学
  AGRICULTURE = 'agriculture', // 农学
  ART = 'art',                 // 艺术学
}

// 学位类型枚举
export enum DegreeType {
  ENGINEERING = 'engineering', // 工学学士
  SCIENCE = 'science',         // 理学学士
  LITERATURE = 'literature',   // 文学学士
  MANAGEMENT = 'management',   // 管理学学士
  ECONOMICS = 'economics',     // 经济学学士
  LAW = 'law',                 // 法学学士
  EDUCATION = 'education',     // 教育学学士
  MEDICINE = 'medicine',       // 医学学士
  AGRICULTURE = 'agriculture', // 农学学士
  ART = 'art',                 // 艺术学学士
}

// 课程类别枚举
export enum CourseCategory {
  GENERAL_REQUIRED = 'general_required',   // 通识必修课
  GENERAL_ELECTIVE = 'general_elective',   // 通识选修课
  MAJOR_REQUIRED = 'major_required',       // 专业必修课
  MAJOR_ELECTIVE = 'major_elective',       // 专业选修课
  PRACTICE = 'practice',                   // 实践环节
  THESIS = 'thesis',                       // 毕业论文/设计
}

// 培养方案基本信息接口
export interface TrainingProgram {
  id: string;
  name: string;                      // 培养方案名称
  programCode: string;               // 专业代码
  programName: string;               // 专业名称
  year: string;                      // 年份
  disciplineCategory: string;        // 学科门类
  programCategory: string;           // 专业类别
  duration: string;                  // 学制
  degree: string;                    // 授予学位
  status: ProgramStatus;             // 状态
  createTime: string;                // 创建时间
  updateTime: string;                // 更新时间
  creator: string;                   // 创建人
  department: string;                // 所属院系
  version: string;                   // 版本
}

// 培养方案详细信息接口
export interface TrainingProgramDetail extends TrainingProgram {
  introduction: string;             // 专业介绍
  objectives: string;               // 培养目标描述
  objectivesList: ProgramObjective[]; // 具体目标列表
  requirements: string;             // 毕业要求概述
  requirementsList: GraduationRequirement[]; // 具体要求列表
  coreCourses: string;              // 专业核心课程说明
  coreCoursesList: string[];        // 核心课程列表
  practiceDescription: string;      // 实践教学环节说明
  practiceList: PracticeTeaching[]; // 实践环节列表
  graduationRequirements: string;   // 毕业和学位要求说明
  basicCredits: number;             // 基本学分要求(B)
  extendedCredits: number;          // 拓展学分要求(X)
  totalCredits: number;             // 总学分要求
  courseTable: ProgramCourse[];     // 课程设置表
  creditStats: CreditStatistics[];  // 学分统计表
  supportMatrix: SupportMatrix;     // 支撑矩阵
}

// 培养目标接口
export interface ProgramObjective {
  id: string;
  content: string;   // 目标内容
  orderNum: number;  // 排序号
}

// 毕业要求接口
export interface GraduationRequirement {
  id: string;
  title: string;         // 要求标题
  description: string;   // 要求描述
  indicators: string[];  // 指标点列表
  orderNum: number;      // 排序号
}

// 实践教学环节接口
export interface PracticeTeaching {
  id: string;
  name: string;        // 环节名称
  credits: number;     // 学分
  semester: string;    // 安排学期
  description: string; // 环节描述
  orderNum: number;    // 排序号
}

// 培养方案课程接口
export interface ProgramCourse {
  id: string;
  courseId: string;       // 课程ID
  courseCode: string;     // 课程号
  courseName: string;     // 课程名称
  semester: string;       // 开课学期
  credits: number;        // 学分
  totalHours: number;     // 总学时
  theoryHours: number;    // 理论学时
  experimentHours: number; // 实验学时
  practiceHours: number;  // 实践学时
  mainCategory: string;   // 主类别
  subCategory: string;    // 子类别
  notes: string;          // 备注
  isCore: boolean;        // 是否核心课程
}

// 学分统计接口
export interface CreditStatistics {
  type: string;         // 课程类型
  subType: string;      // 子类型
  nature: string;       // 课程性质
  credits: number;      // 学分
  percentage: number;   // 比例
  creditCategory: string; // 学分类别(B/X)
}

// 支撑矩阵接口
export interface SupportMatrix {
  requirements: GraduationRequirement[];  // 毕业要求列表
  courses: ProgramCourse[];               // 课程列表
  matrix: MatrixItem[];                   // 矩阵项
}

// 矩阵项接口
export interface MatrixItem {
  courseId: string;
  requirementId: string;
  indicatorIndex: number;
  supportLevel: 'high' | 'medium' | 'low' | 'none'; // 支撑程度
}

// 培养方案审核接口
export interface ProgramReview {
  id: string;
  programId: string;       // 培养方案ID
  programName: string;     // 培养方案名称
  reviewerName: string;    // 审核人
  reviewTime: string;      // 审核时间
  status: 'approved' | 'rejected'; // 审核状态
  comments: string;        // 审核意见
  attachment?: string;     // 附件
}

// 培养方案比较接口
export interface ProgramComparison {
  baseProgram: TrainingProgramDetail;      // 基准方案
  compareProgram: TrainingProgramDetail;   // 比较方案
  differences: ProgramDifference[];        // 差异项
}

// 方案差异接口
export interface ProgramDifference {
  field: string;           // 差异字段
  fieldName: string;       // 字段名称
  baseValue: any;          // 基准值
  compareValue: any;       // 比较值
  diffType: 'add' | 'remove' | 'change';  // 差异类型
}

// 课程模板接口
export interface ProgramTemplate {
  id: string;
  name: string;            // 模板名称
  description: string;     // 模板描述
  type: string;            // 模板类型
  content: string;         // 模板内容(JSON字符串)
  createdBy: string;       // 创建人
  createTime: string;      // 创建时间
  updateTime: string;      // 更新时间
  isDefault: boolean;      // 是否默认模板
}

// 查询参数接口
export interface ProgramQueryParams {
  page: number;
  pageSize: number;
  name?: string;
  code?: string;
  department?: string;
  status?: ProgramStatus;
  year?: string;
  disciplineCategory?: string;
}

// 分页响应接口
export interface PaginationResponse<T> {
  list: T[];
  total: number;
}

// API响应接口
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
} 