/**
 * 课程库管理模块类型定义
 */

// 课程状态枚举
export enum CourseStatus {
  ACTIVE = 'active', // 有效
  DRAFT = 'draft',   // 草稿
  PENDING = 'pending', // 待审核
  DISABLED = 'disabled', // 已停用
}

// 课程类型枚举
export enum CourseType {
  REQUIRED = 'required', // 必修课
  ELECTIVE = 'elective', // 选修课
  PRACTICAL = 'practical', // 实践课
  THESIS = 'thesis', // 论文/毕设
}

// 申请类型枚举
export enum ApplicationType {
  CREATE = 'create', // 新建
  UPDATE = 'update', // 修改
  DISABLE = 'disable', // 停用
  ENABLE = 'enable', // 启用
}

// 审核状态枚举
export enum AuditStatus {
  PENDING = 'pending', // 待审核
  APPROVED = 'approved', // 已通过
  REJECTED = 'rejected', // 已驳回
}

// 紧急程度枚举
export enum PriorityLevel {
  NORMAL = 'normal', // 普通
  URGENT = 'urgent', // 紧急
  VERY_URGENT = 'very_urgent', // 非常紧急
}

// 课程基本信息接口
export interface Course {
  id: string;
  code: string; // 课程编码
  name: string; // 课程名称
  englishName?: string; // 英文名称
  credit: number; // 学分
  hours: number; // 学时
  department: string; // 所属院系
  type: CourseType; // 课程类型
  status: CourseStatus; // 课程状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  creator: string; // 创建人
}

// 课程详细信息接口
export interface CourseDetail extends Course {
  description: string; // 课程描述
  objective: string; // 教学目标
  prerequisite: string; // 先修要求
  textbook: string; // 教材
  assessment: string; // 考核方式
  materials: CourseMaterial[]; // 教学资料
  schedule: CourseSchedule[]; // 教学安排
  history: CourseHistory[]; // 历史版本
}

// 教学资料接口
export interface CourseMaterial {
  id: string;
  name: string; // 资料名称
  type: string; // 资料类型
  size: number; // 文件大小
  uploadTime: string; // 上传时间
  downloadUrl: string; // 下载链接
}

// 教学安排接口
export interface CourseSchedule {
  id: string;
  week: number; // 周次
  content: string; // 教学内容
  hours: number; // 学时
  type: string; // 教学类型
}

// 课程历史版本接口
export interface CourseHistory {
  id: string;
  version: string; // 版本号
  updateTime: string; // 更新时间
  updater: string; // 更新人
  comments: string; // 更新说明
}

// 课程审核申请接口
export interface CourseAudit {
  id: string;
  courseId: string; // 关联课程ID
  code: string; // 课程编码
  name: string; // 课程名称
  applicant: string; // 申请人
  applyDate: string; // 申请日期
  type: ApplicationType; // 申请类型
  status: AuditStatus; // 审核状态
}

// 待审核申请扩展接口
export interface PendingAudit extends CourseAudit {
  priority: PriorityLevel; // 紧急程度
}

// 已审核申请扩展接口
export interface ApprovedAudit extends CourseAudit {
  auditor: string; // 审批人
  auditDate: string; // 审批日期
  comment: string; // 审批意见
}

// 已驳回申请扩展接口
export interface RejectedAudit extends CourseAudit {
  auditor: string; // 审批人
  auditDate: string; // 驳回日期
  rejectReason: string; // 驳回原因
}

// 审核详情时间线项接口
export interface AuditTimelineItem {
  title: string; // 节点标题
  content: string; // 节点内容
  time: string; // 时间
  status: 'success' | 'warning' | 'error'; // 状态
}

// 课程查询参数接口
export interface CourseQueryParams {
  page: number;
  pageSize: number;
  name?: string;
  code?: string;
  department?: string;
  type?: CourseType;
  status?: CourseStatus;
}

// 审核查询参数接口
export interface AuditQueryParams {
  page: number;
  pageSize: number;
  name?: string;
  code?: string;
  applicant?: string;
  auditor?: string;
  type?: ApplicationType;
  dateRange?: string[];
  priority?: PriorityLevel;
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