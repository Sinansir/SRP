import { BookOpenIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/course-library',
    component: Layout,
    redirect: '/course-library/browse',
    name: 'CourseLibrary',
    meta: {
      title: {
        zh_CN: '课程库管理',
        en_US: 'Course Library Management',
      },
      icon: shallowRef(BookOpenIcon),
      orderNo: 1,
    },
    children: [
      {
        path: 'browse',
        name: 'CourseBrowse',
        component: () => import('@/pages/course-library/browse/index.vue'),
        meta: {
          title: {
            zh_CN: '课程浏览',
            en_US: 'Course Browse',
          },
        },
      },
      {
        path: 'maintain',
        name: 'CourseMaintain',
        component: () => import('@/pages/course-library/maintain/index.vue'),
        meta: {
          title: {
            zh_CN: '课程维护',
            en_US: 'Course Maintenance',
          },
        },
        children: [
          {
            path: 'create',
            name: 'CourseCreate',
            component: () => import('@/pages/course-library/maintain/create/index.vue'),
            meta: {
              title: {
                zh_CN: '创建课程',
                en_US: 'Create Course',
              },
            },
          },
          {
            path: 'edit/:id',
            name: 'CourseEdit',
            component: () => import('@/pages/course-library/maintain/edit/index.vue'),
            meta: {
              title: {
                zh_CN: '编辑课程',
                en_US: 'Edit Course',
              },
              hidden: true,
            },
          },
          {
            path: 'view/:id',
            name: 'CourseView',
            component: () => import('@/pages/course-library/maintain/view/index.vue'),
            meta: {
              title: {
                zh_CN: '课程详情',
                en_US: 'Course Details',
              },
              hidden: true,
            },
          },
          {
            path: 'list',
            name: 'CourseList',
            component: () => import('@/pages/course-library/maintain/list/index.vue'),
            meta: {
              title: {
                zh_CN: '课程列表',
                en_US: 'Course List',
              },
            },
          },
          {
            path: 'code-rule',
            name: 'CourseCodeRule',
            component: () => import('@/pages/course-library/maintain/code-rule/index.vue'),
            meta: {
              title: {
                zh_CN: '课程代码规则',
                en_US: 'Course Code Rules',
              },
            },
          },
          {
            path: 'nature',
            name: 'CourseNature',
            component: () => import('@/pages/course-library/maintain/nature/index.vue'),
            meta: {
              title: {
                zh_CN: '课程性质管理',
                en_US: 'Course Nature Management',
              },
            },
          },
          {
            path: 'category',
            name: 'CourseCategory',
            component: () => import('@/pages/course-library/maintain/category/index.vue'),
            meta: {
              title: {
                zh_CN: '模块类型管理',
                en_US: 'Module Type Management',
              },
            },
          },
          {
            path: 'exam-type',
            name: 'CourseExamType',
            component: () => import('@/pages/course-library/maintain/exam-type/index.vue'),
            meta: {
              title: {
                zh_CN: '考试形式管理',
                en_US: 'Exam Type Management',
              },
            },
          },
        ],
      },
      {
        path: 'audit',
        name: 'CourseAudit',
        component: () => import('@/pages/course-library/audit/index.vue'),
        meta: {
          title: {
            zh_CN: '课程变更',
            en_US: 'Course Changes',
          },
        },
        children: [
          {
            path: 'apply',
            name: 'CourseChangeApply',
            component: () => import('@/pages/course-library/audit/apply/index.vue'),
            meta: {
              title: {
                zh_CN: '变更申请',
                en_US: 'Change Application',
              },
            },
          },
          {
            path: 'pending',
            name: 'CoursePendingAudit',
            component: () => import('@/pages/course-library/audit/pending/index.vue'),
            meta: {
              title: {
                zh_CN: '待审核',
                en_US: 'Pending Audit',
              },
            },
          },
          {
            path: 'approved',
            name: 'CourseApprovedAudit',
            component: () => import('@/pages/course-library/audit/approved/index.vue'),
            meta: {
              title: {
                zh_CN: '已审核',
                en_US: 'Approved',
              },
            },
          },
          {
            path: 'rejected',
            name: 'CourseRejectedAudit',
            component: () => import('@/pages/course-library/audit/rejected/index.vue'),
            meta: {
              title: {
                zh_CN: '已驳回',
                en_US: 'Rejected',
              },
            },
          },
        ],
      },
      {
        path: 'relation',
        name: 'CourseRelation',
        component: () => import('@/pages/course-library/relation/index.vue'),
        meta: {
          title: {
            zh_CN: '课程关联',
            en_US: 'Course Relation',
          },
        },
        children: [
          {
            path: 'management',
            name: 'CourseRelationManagement',
            component: () => import('@/pages/course-library/relation/management/index.vue'),
            meta: {
              title: {
                zh_CN: '课程关联管理',
                en_US: 'Course Relation Management',
              },
            },
          },
          {
            path: 'analysis',
            name: 'CourseRelationAnalysis',
            component: () => import('@/pages/course-library/relation/analysis/index.vue'),
            meta: {
              title: {
                zh_CN: '课程关联分析',
                en_US: 'Course Relation Analysis',
              },
            },
          },
        ],
      },
    ],
  },
];
