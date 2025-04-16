import { BookmarkIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/education-document',
    component: Layout,
    redirect: '/education-document/syllabus',
    name: 'EducationDocument',
    meta: {
      title: {
        zh_CN: '育人过程文档',
        en_US: 'Education Document',
      },
      icon: shallowRef(BookmarkIcon),
      orderNo: 3,
    },
    children: [
      {
        path: 'syllabus',
        name: 'Syllabus',
        component: () => import('@/pages/education-document/syllabus/index.vue'),
        meta: {
          title: {
            zh_CN: '教学大纲管理',
            en_US: 'Syllabus Management',
          },
        },
        children: [
          {
            path: 'create',
            name: 'SyllabusCreate',
            component: () => import('@/pages/education-document/syllabus/create/index.vue'),
            meta: {
              title: {
                zh_CN: '大纲制作',
                en_US: 'Create Syllabus',
              },
            },
          },
          {
            path: 'audit',
            name: 'SyllabusAudit',
            component: () => import('@/pages/education-document/syllabus/audit/index.vue'),
            meta: {
              title: {
                zh_CN: '大纲审核',
                en_US: 'Audit Syllabus',
              },
            },
          },
          {
            path: 'search',
            name: 'SyllabusSearch',
            component: () => import('@/pages/education-document/syllabus/search/index.vue'),
            meta: {
              title: {
                zh_CN: '大纲查询',
                en_US: 'Search Syllabus',
              },
            },
          },
          // 暂时注释掉缺失的组件路由
          /*
          {
            path: 'detail/:id',
            name: 'SyllabusDetail',
            component: () => import('@/pages/education-document/syllabus/detail/index.vue'),
            meta: {
              title: {
                zh_CN: '大纲详情',
                en_US: 'Syllabus Detail',
              },
              hidden: true,
            },
          },
          */
        ],
      },
      // 暂时注释掉可能缺失的组件路由
      /*
      {
        path: 'teaching-plan',
        name: 'TeachingPlan',
        component: () => import('@/pages/education-document/teaching-plan/index.vue'),
        meta: {
          title: {
            zh_CN: '教案管理',
            en_US: 'Teaching Plan Management',
          },
        },
        children: [
          {
            path: 'my',
            name: 'MyTeachingPlan',
            component: () => import('@/pages/education-document/teaching-plan/my/index.vue'),
            meta: {
              title: {
                zh_CN: '我的教案',
                en_US: 'My Teaching Plans',
              },
            },
          },
          {
            path: 'share',
            name: 'ShareTeachingPlan',
            component: () => import('@/pages/education-document/teaching-plan/share/index.vue'),
            meta: {
              title: {
                zh_CN: '教案共享',
                en_US: 'Share Teaching Plans',
              },
            },
          },
          {
            path: 'template',
            name: 'TeachingPlanTemplate',
            component: () => import('@/pages/education-document/teaching-plan/template/index.vue'),
            meta: {
              title: {
                zh_CN: '教案模板',
                en_US: 'Teaching Plan Templates',
              },
            },
          },
          {
            path: 'detail/:id',
            name: 'TeachingPlanDetail',
            component: () => import('@/pages/education-document/teaching-plan/detail/index.vue'),
            meta: {
              title: {
                zh_CN: '教案详情',
                en_US: 'Teaching Plan Detail',
              },
              hidden: true,
            },
          },
        ],
      },
      {
        path: 'teaching-file',
        name: 'TeachingFile',
        component: () => import('@/pages/education-document/teaching-file/index.vue'),
        meta: {
          title: {
            zh_CN: '教学文件',
            en_US: 'Teaching Files',
          },
        },
        children: [
          {
            path: 'ppt',
            name: 'PPTUpload',
            component: () => import('@/pages/education-document/teaching-file/ppt/index.vue'),
            meta: {
              title: {
                zh_CN: 'PPT上传',
                en_US: 'PPT Upload',
              },
            },
          },
          {
            path: 'guide',
            name: 'GuideUpload',
            component: () => import('@/pages/education-document/teaching-file/guide/index.vue'),
            meta: {
              title: {
                zh_CN: '实验指导书/其他上传',
                en_US: 'Guide & Other Upload',
              },
            },
          },
          {
            path: 'exam',
            name: 'ExamUpload',
            component: () => import('@/pages/education-document/teaching-file/exam/index.vue'),
            meta: {
              title: {
                zh_CN: '大作业/试卷上传',
                en_US: 'Assignment & Exam Upload',
              },
            },
          },
        ],
      },
      {
        path: 'teaching-calendar',
        name: 'TeachingCalendar',
        component: () => import('@/pages/education-document/teaching-calendar/index.vue'),
        meta: {
          title: {
            zh_CN: '教学日历',
            en_US: 'Teaching Calendar',
          },
        },
        children: [
          {
            path: 'calendar',
            name: 'CalendarForm',
            component: () => import('@/pages/education-document/teaching-calendar/calendar/index.vue'),
            meta: {
              title: {
                zh_CN: '教学日历表单',
                en_US: 'Teaching Calendar Form',
              },
            },
          },
          {
            path: 'exam-approval',
            name: 'ExamApproval',
            component: () => import('@/pages/education-document/teaching-calendar/exam-approval/index.vue'),
            meta: {
              title: {
                zh_CN: '试卷审批单',
                en_US: 'Exam Approval Form',
              },
            },
          },
          {
            path: 'course-summary',
            name: 'CourseSummary',
            component: () => import('@/pages/education-document/teaching-calendar/course-summary/index.vue'),
            meta: {
              title: {
                zh_CN: '课程小结单',
                en_US: 'Course Summary Form',
              },
            },
          },
        ],
      },
      */
    ],
  },
]; 