import { ChartLineIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/teaching-analysis',
    component: Layout,
    redirect: '/teaching-analysis/operation',
    name: 'TeachingAnalysis',
    meta: {
      title: {
        zh_CN: '智能教学分析',
        en_US: 'Teaching Analysis',
      },
      icon: shallowRef(ChartLineIcon),
      orderNo: 4,
    },
    children: [
      {
        path: 'operation',
        name: 'OperationMonitoring',
        component: () => import('@/pages/teaching-analysis/operation/index.vue'),
        meta: {
          title: {
            zh_CN: '教学运行监测',
            en_US: 'Operation Monitoring',
          },
        },
        children: [
          {
            path: 'progress',
            name: 'ProgressMonitoring',
            component: () => import('@/pages/teaching-analysis/operation/progress/index.vue'),
            meta: {
              title: {
                zh_CN: '进度监测',
                en_US: 'Progress Monitoring',
              },
            },
          },
          {
            path: 'quality',
            name: 'QualityMonitoring',
            component: () => import('@/pages/teaching-analysis/operation/quality/index.vue'),
            meta: {
              title: {
                zh_CN: '质量监测',
                en_US: 'Quality Monitoring',
              },
            },
          },
          {
            path: 'warning',
            name: 'WarningMonitoring',
            component: () => import('@/pages/teaching-analysis/operation/warning/index.vue'),
            meta: {
              title: {
                zh_CN: '异常预警',
                en_US: 'Warning Monitoring',
              },
            },
          },
        ],
      },
      // 暂时注释掉缺失的组件路由
      /*
      {
        path: 'student',
        name: 'StudentAnalysis',
        component: () => import('@/pages/teaching-analysis/student/index.vue'),
        meta: {
          title: {
            zh_CN: '学生学习分析',
            en_US: 'Student Learning Analysis',
          },
        },
        children: [
          {
            path: 'class',
            name: 'ClassAnalysis',
            component: () => import('@/pages/teaching-analysis/student/class/index.vue'),
            meta: {
              title: {
                zh_CN: '班级分析',
                en_US: 'Class Analysis',
              },
            },
          },
          {
            path: 'individual',
            name: 'IndividualAnalysis',
            component: () => import('@/pages/teaching-analysis/student/individual/index.vue'),
            meta: {
              title: {
                zh_CN: '个体分析',
                en_US: 'Individual Analysis',
              },
            },
          },
          {
            path: 'warning',
            name: 'LearningWarning',
            component: () => import('@/pages/teaching-analysis/student/warning/index.vue'),
            meta: {
              title: {
                zh_CN: '学习预警',
                en_US: 'Learning Warning',
              },
            },
          },
        ],
      },
      // 暂时注释掉可能缺失的组件路由
      {
        path: 'improvement',
        name: 'TeachingImprovement',
        component: () => import('@/pages/teaching-analysis/improvement/index.vue'),
        meta: {
          title: {
            zh_CN: '教学改进',
            en_US: 'Teaching Improvement',
          },
        },
        children: [
          {
            path: 'problem',
            name: 'ProblemAnalysis',
            component: () => import('@/pages/teaching-analysis/improvement/problem/index.vue'),
            meta: {
              title: {
                zh_CN: '问题分析',
                en_US: 'Problem Analysis',
              },
            },
          },
          {
            path: 'suggestion',
            name: 'ImprovementSuggestion',
            component: () => import('@/pages/teaching-analysis/improvement/suggestion/index.vue'),
            meta: {
              title: {
                zh_CN: '改进建议',
                en_US: 'Improvement Suggestion',
              },
            },
          },
          {
            path: 'tracking',
            name: 'EffectTracking',
            component: () => import('@/pages/teaching-analysis/improvement/tracking/index.vue'),
            meta: {
              title: {
                zh_CN: '效果跟踪',
                en_US: 'Effect Tracking',
              },
            },
          },
        ],
      },
      */
    ],
  },
]; 