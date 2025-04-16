import { BookIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/training-program',
    component: Layout,
    redirect: '/training-program/browse',
    name: 'TrainingProgram',
    meta: {
      title: {
        zh_CN: '培养方案管理',
        en_US: 'Training Program',
      },
      icon: shallowRef(BookIcon),
      orderNo: 2,
    },
    children: [
      {
        path: 'browse',
        name: 'TrainingProgramBrowse',
        component: () => import('@/pages/training-program/browse.vue'),
        meta: {
          title: {
            zh_CN: '方案浏览',
            en_US: 'Browse Programs',
          },
        },
      },
      {
        path: 'national',
        name: 'TrainingProgramNational',
        component: () => import('@/pages/training-program/national.vue'),
        meta: {
          title: {
            zh_CN: '全国方案资源库',
            en_US: 'National Programs',
          },
        },
      },
      {
        path: 'maintain',
        name: 'TrainingProgramMaintain',
        component: () => import('@/pages/training-program/maintain/index.vue'),
        meta: {
          title: {
            zh_CN: '方案维护',
            en_US: 'Program Maintenance',
          },
        },
        children: [
          {
            path: 'create',
            name: 'TrainingProgramCreate',
            component: () => import('@/pages/training-program/maintain/create.vue'),
            meta: {
              title: {
                zh_CN: '创建方案',
                en_US: 'Create Program',
              },
            },
          },
          {
            path: 'architecture',
            name: 'TrainingProgramArchitecture',
            component: () => import('@/pages/training-program/maintain/architecture.vue'),
            meta: {
              title: {
                zh_CN: '架构配置',
                en_US: 'Architecture Configuration',
              },
            },
          },
          {
            path: 'edit/:id',
            name: 'TrainingProgramEdit',
            component: () => import('@/pages/training-program/maintain/edit.vue'),
            meta: {
              title: {
                zh_CN: '编辑方案',
                en_US: 'Edit Program',
              },
              hidden: true,
            },
          },
          {
            path: 'detail/:id',
            name: 'TrainingProgramDetail',
            component: () => import('@/pages/training-program/maintain/detail.vue'),
            meta: {
              title: {
                zh_CN: '方案详情',
                en_US: 'Program Detail',
              },
              hidden: true,
            },
          },
          {
            path: 'template',
            name: 'TrainingProgramTemplate',
            component: () => import('@/pages/training-program/maintain/template.vue'),
            meta: {
              title: {
                zh_CN: '课程体系管理',
                en_US: 'Curriculum System Management',
              },
            },
          },
          {
            path: 'ocr',
            name: 'TrainingProgramOCR',
            component: () => import('@/pages/training-program/maintain/ocr.vue'),
            meta: {
              title: {
                zh_CN: 'OCR参数配置',
                en_US: 'OCR Parameter Configuration',
              },
            },
          },
        ],
      },
      {
        path: 'change',
        name: 'TrainingProgramChange',
        component: () => import('@/pages/training-program/change/index.vue'),
        meta: {
          title: {
            zh_CN: '方案变更',
            en_US: 'Program Change',
          },
        },
        children: [
          {
            path: 'apply',
            name: 'TrainingProgramChangeApply',
            component: () => import('@/pages/training-program/change/apply.vue'),
            meta: {
              title: {
                zh_CN: '变更申请',
                en_US: 'Change Application',
              },
            },
          },
          {
            path: 'pending',
            name: 'TrainingProgramChangePending',
            component: () => import('@/pages/training-program/change/pending.vue'),
            meta: {
              title: {
                zh_CN: '待审核',
                en_US: 'Pending Review',
              },
            },
          },
          {
            path: 'approved',
            name: 'TrainingProgramChangeApproved',
            component: () => import('@/pages/training-program/change/approved.vue'),
            meta: {
              title: {
                zh_CN: '已审核',
                en_US: 'Approved',
              },
            },
          },
          {
            path: 'rejected',
            name: 'TrainingProgramChangeRejected',
            component: () => import('@/pages/training-program/change/rejected.vue'),
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
        name: 'TrainingProgramRelation',
        component: () => import('@/pages/training-program/relation/index.vue'),
        meta: {
          title: {
            zh_CN: '方案关联',
            en_US: 'Program Relation',
          },
        },
        children: [
          {
            path: 'comparison',
            name: 'TrainingProgramComparison',
            component: () => import('@/pages/training-program/comparison.vue'),
            meta: {
              title: {
                zh_CN: '方案对比分析',
                en_US: 'Program Comparison',
              },
            },
          },
          {
            path: 'matrix',
            name: 'TrainingProgramMatrix',
            component: () => import('@/pages/training-program/relation/matrix.vue'),
            meta: {
              title: {
                zh_CN: '课程能力矩阵',
                en_US: 'Course Ability Matrix',
              },
            },
          },
          {
            path: 'graduation-requirements',
            name: 'TrainingProgramGraduationRequirements',
            component: () => import('@/pages/training-program/relation/graduation-requirements.vue'),
            meta: {
              title: {
                zh_CN: '毕业要求分析',
                en_US: 'Graduation Requirements Analysis',
              },
            },
          },
          {
            path: 'indicators',
            name: 'TrainingProgramIndicators',
            component: () => import('@/pages/training-program/relation/indicators.vue'),
            meta: {
              title: {
                zh_CN: '指标达成度配置',
                en_US: 'Indicators Achievement Configuration',
              },
            },
          },
          {
            path: 'course-usage',
            name: 'TrainingProgramCourseUsage',
            component: () => import('@/pages/training-program/relation/course-usage.vue'),
            meta: {
              title: {
                zh_CN: '课程使用情况',
                en_US: 'Course Usage',
              },
            },
          },
        ],
      },
      {
        path: 'sync',
        name: 'TrainingProgramSync',
        component: () => import('@/pages/training-program/sync/index.vue'),
        meta: {
          title: {
            zh_CN: '教务同步',
            en_US: 'Academic Sync',
          },
        },
        children: [
          {
            path: 'config',
            name: 'TrainingProgramSyncConfig',
            component: () => import('@/pages/training-program/sync/config.vue'),
            meta: {
              title: {
                zh_CN: '同步配置',
                en_US: 'Sync Configuration',
              },
            },
          },
          {
            path: 'logs',
            name: 'TrainingProgramSyncLogs',
            component: () => import('@/pages/training-program/sync/logs.vue'),
            meta: {
              title: {
                zh_CN: '同步日志',
                en_US: 'Sync Logs',
              },
            },
          },
        ],
      },
      {
        path: 'ai-center',
        name: 'TrainingProgramAICenter',
        component: () => import('@/pages/training-program/ai-center.vue'),
        meta: {
          title: {
            zh_CN: '方案AI分析中心',
            en_US: 'AI Analysis Center',
          },
        },
        children: [
          {
            path: 'compliance',
            name: 'TrainingProgramCompliance',
            component: () => import('@/pages/training-program/ai-center/compliance.vue'),
            meta: {
              title: {
                zh_CN: '培养方案合规性检查',
                en_US: 'Compliance Check',
              },
              hidden: true,
            },
          },
          {
            path: 'course-structure',
            name: 'TrainingProgramCourseStructure',
            component: () => import('@/pages/training-program/ai-center/course-structure.vue'),
            meta: {
              title: {
                zh_CN: '课程体系结构分析',
                en_US: 'Course Structure Analysis',
              },
              hidden: true,
            },
          },
          {
            path: 'graduation-achievement',
            name: 'TrainingProgramGraduationAchievement',
            component: () => import('@/pages/training-program/ai-center/graduation-achievement.vue'),
            meta: {
              title: {
                zh_CN: '毕业要求达成度分析',
                en_US: 'Graduation Requirements Achievement Analysis',
              },
              hidden: true,
            },
          },
          {
            path: 'industry-match',
            name: 'TrainingProgramIndustryMatch',
            component: () => import('@/pages/training-program/ai-center/industry-match.vue'),
            meta: {
              title: {
                zh_CN: '行业需求匹配度分析',
                en_US: 'Industry Match Analysis',
              },
              hidden: true,
            },
          },
          {
            path: 'optimization',
            name: 'TrainingProgramOptimization',
            component: () => import('@/pages/training-program/ai-center/optimization.vue'),
            meta: {
              title: {
                zh_CN: '培养方案优化建议',
                en_US: 'Optimization Suggestions',
              },
              hidden: true,
            },
          },
          {
            path: 'program-comparison',
            name: 'TrainingProgramAIComparison',
            component: () => import('@/pages/training-program/ai-center/program-comparison.vue'),
            meta: {
              title: {
                zh_CN: '同类专业对比分析',
                en_US: 'Program Comparison Analysis',
              },
              hidden: true,
            },
          },
        ],
      },
    ],
  },
]; 
