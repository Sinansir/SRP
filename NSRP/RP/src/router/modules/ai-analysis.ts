import { AppIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/ai-analysis',
    component: Layout,
    redirect: '/ai-analysis/report',
    name: 'AIAnalysis',
    meta: {
      title: {
        zh_CN: 'AI分析中心',
        en_US: 'AI Analysis Center',
      },
      icon: shallowRef(AppIcon),
      orderNo: 5,
    },
    children: [
      {
        path: 'report',
        name: 'IntelligentReport',
        component: () => import('@/pages/ai-analysis/report/index.vue'),
        meta: {
          title: {
            zh_CN: '智能分析报告',
            en_US: 'Intelligent Analysis Report',
          },
        },
        children: [
          {
            path: 'college',
            name: 'CollegeReport',
            component: () => import('@/pages/ai-analysis/report/college/index.vue'),
            meta: {
              title: {
                zh_CN: '学院分析报告',
                en_US: 'College Analysis Report',
              },
            },
          },
          {
            path: 'major',
            name: 'MajorReport',
            component: () => import('@/pages/ai-analysis/report/major/index.vue'),
            meta: {
              title: {
                zh_CN: '专业分析报告',
                en_US: 'Major Analysis Report',
              },
            },
          },
          {
            path: 'custom',
            name: 'CustomReport',
            component: () => import('@/pages/ai-analysis/report/custom/index.vue'),
            meta: {
              title: {
                zh_CN: '自定义报告',
                en_US: 'Custom Report',
              },
            },
          },
          // 暂时注释掉缺失的组件路由
          /*
          {
            path: 'template',
            name: 'ReportTemplate',
            component: () => import('@/pages/ai-analysis/report/template/index.vue'),
            meta: {
              title: {
                zh_CN: '报告模板',
                en_US: 'Report Template',
              },
            },
          },
          {
            path: 'detail/:id',
            name: 'ReportDetail',
            component: () => import('@/pages/ai-analysis/report/detail/index.vue'),
            meta: {
              title: {
                zh_CN: '报告详情',
                en_US: 'Report Detail',
              },
              hidden: true,
            },
          },
          */
        ],
      },
      // 暂时注释掉可能缺失组件的工具路由
      /*
      {
        path: 'tools',
        name: 'AITools',
        component: () => import('@/pages/ai-analysis/tools/index.vue'),
        meta: {
          title: {
            zh_CN: 'AI辅助工具',
            en_US: 'AI Assistant Tools',
          },
        },
        children: [
          {
            path: 'content-generation',
            name: 'ContentGeneration',
            component: () => import('@/pages/ai-analysis/tools/content-generation/index.vue'),
            meta: {
              title: {
                zh_CN: '内容生成',
                en_US: 'Content Generation',
              },
            },
          },
          {
            path: 'intelligent-validation',
            name: 'IntelligentValidation',
            component: () => import('@/pages/ai-analysis/tools/intelligent-validation/index.vue'),
            meta: {
              title: {
                zh_CN: '智能校验',
                en_US: 'Intelligent Validation',
              },
            },
          },
          {
            path: 'benchmark-analysis',
            name: 'BenchmarkAnalysis',
            component: () => import('@/pages/ai-analysis/tools/benchmark-analysis/index.vue'),
            meta: {
              title: {
                zh_CN: '对标分析',
                en_US: 'Benchmark Analysis',
              },
            },
          },
        ],
      },
      {
        path: 'visualization',
        name: 'DataVisualization',
        component: () => import('@/pages/ai-analysis/visualization/index.vue'),
        meta: {
          title: {
            zh_CN: '数据可视化',
            en_US: 'Data Visualization',
          },
        },
        children: [
          {
            path: 'program-statistics',
            name: 'ProgramStatistics',
            component: () => import('@/pages/ai-analysis/visualization/program-statistics/index.vue'),
            meta: {
              title: {
                zh_CN: '培养方案统计',
                en_US: 'Program Statistics',
              },
            },
          },
          {
            path: 'course-distribution',
            name: 'CourseDistribution',
            component: () => import('@/pages/ai-analysis/visualization/course-distribution/index.vue'),
            meta: {
              title: {
                zh_CN: '课程分布分析',
                en_US: 'Course Distribution Analysis',
              },
            },
          },
          {
            path: 'ability-cultivation',
            name: 'AbilityCultivation',
            component: () => import('@/pages/ai-analysis/visualization/ability-cultivation/index.vue'),
            meta: {
              title: {
                zh_CN: '能力培养分析',
                en_US: 'Ability Cultivation Analysis',
              },
            },
          },
        ],
      },
      */
    ],
  },
]; 