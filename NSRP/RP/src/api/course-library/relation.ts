import { mockRequest } from '@/utils/mock';

// 课程关联分析相关接口
export function fetchCourseRelationData(params: any) {
  return mockRequest({
    url: '/api/course/relation/analysis',
    method: 'get',
    data: params,
  });
}

export function fetchCourseRelationGraph(sourceCourseId: string | number) {
  return mockRequest({
    url: '/api/course/relation/graph',
    method: 'get',
    data: { sourceCourseId },
  });
}

export function fetchCourseListData(params: any) {
  return mockRequest({
    url: '/api/course/relation/course-list',
    method: 'get',
    data: params,
  });
}

export function fetchDepartmentOptions() {
  return mockRequest({
    url: '/api/course/relation/department-options',
    method: 'get',
  });
}

// 课程关联管理相关接口
export function fetchCourseRelationList(params: any) {
  return mockRequest({
    url: '/api/course/relation/list',
    method: 'get',
    data: params,
  });
}

export function addCourseRelation(data: any) {
  return mockRequest({
    url: '/api/course/relation/add',
    method: 'post',
    data,
  });
}

export function updateCourseRelation(data: any) {
  return mockRequest({
    url: '/api/course/relation/update',
    method: 'put',
    data,
  });
}

export function deleteCourseRelation(id: string | number) {
  return mockRequest({
    url: `/api/course/relation/delete/${id}`,
    method: 'delete',
  });
}

export function fetchCourseOptions() {
  return mockRequest({
    url: '/api/course/relation/course-options',
    method: 'get',
  });
}

// 导出课程关联数据
export function exportCourseRelation(data: any) {
  return mockRequest({
    url: '/api/course/relation/export',
    method: 'post',
    data,
  });
} 