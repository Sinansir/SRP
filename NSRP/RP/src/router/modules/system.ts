import { SettingIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: {
      title: {
        zh_CN: '系统管理',
        en_US: 'System Management',
      },
      icon: shallowRef(SettingIcon),
      orderNo: 6,
    },
    children: [
      {
        path: 'user',
        name: 'UserPermission',
        component: () => import('@/pages/system/user/index.vue'),
        meta: {
          title: {
            zh_CN: '用户权限',
            en_US: 'User Permission',
          },
        },
        children: [
          {
            path: 'management',
            name: 'UserManagement',
            component: () => import('@/pages/system/user/management/index.vue'),
            meta: {
              title: {
                zh_CN: '用户管理',
                en_US: 'User Management',
              },
            },
          },
          {
            path: 'role',
            name: 'RoleManagement',
            component: () => import('@/pages/system/user/role/index.vue'),
            meta: {
              title: {
                zh_CN: '角色管理',
                en_US: 'Role Management',
              },
            },
          },
          {
            path: 'permission',
            name: 'PermissionConfiguration',
            component: () => import('@/pages/system/user/permission/index.vue'),
            meta: {
              title: {
                zh_CN: '权限配置',
                en_US: 'Permission Configuration',
              },
            },
          },
        ],
      },
      // 新增基础数据菜单
      {
        path: 'basic-data',
        name: 'BasicData',
        component: () => import('@/pages/system/basic-data/index.vue'),
        meta: {
          title: {
            zh_CN: '基础数据',
            en_US: 'Basic Data',
          },
        },
        children: [
          {
            path: 'maintenance',
            name: 'DataMaintenance',
            component: () => import('@/pages/system/basic-data/maintenance/index.vue'),
            meta: {
              title: {
                zh_CN: '数据维护',
                en_US: 'Maintenance',
              },
            },
          },
          {
            path: 'college',
            name: 'CollegeInfo',
            component: () => import('@/pages/system/basic-data/college/index.vue'),
            meta: {
              title: {
                zh_CN: '学院信息',
                en_US: 'College Information',
              },
            },
          },
          {
            path: 'major',
            name: 'MajorInfo',
            component: () => import('@/pages/system/basic-data/major/index.vue'),
            meta: {
              title: {
                zh_CN: '专业信息',
                en_US: 'Major Information',
              },
            },
          },
        ],
      },
      // 暂时注释掉缺失的组件路由
      /*
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/pages/system/organization/index.vue'),
        meta: {
          title: {
            zh_CN: '组织机构',
            en_US: 'Organization',
          },
        },
        children: [
          {
            path: 'school',
            name: 'SchoolInformation',
            component: () => import('@/pages/system/organization/school/index.vue'),
            meta: {
              title: {
                zh_CN: '学校信息',
                en_US: 'School Information',
              },
            },
          },
          {
            path: 'college',
            name: 'CollegeManagement',
            component: () => import('@/pages/system/organization/college/index.vue'),
            meta: {
              title: {
                zh_CN: '学院管理',
                en_US: 'College Management',
              },
            },
          },
          {
            path: 'major',
            name: 'MajorManagement',
            component: () => import('@/pages/system/organization/major/index.vue'),
            meta: {
              title: {
                zh_CN: '专业管理',
                en_US: 'Major Management',
              },
            },
          },
        ],
      },
      */
      // 暂时注释掉可能缺失的组件路由
      /*
      {
        path: 'setting',
        name: 'BasicSetting',
        component: () => import('@/pages/system/setting/index.vue'),
        meta: {
          title: {
            zh_CN: '基础设置',
            en_US: 'Basic Setting',
          },
        },
        children: [
          {
            path: 'parameter',
            name: 'SystemParameter',
            component: () => import('@/pages/system/setting/parameter/index.vue'),
            meta: {
              title: {
                zh_CN: '系统参数',
                en_US: 'System Parameter',
              },
            },
          },
          {
            path: 'dictionary',
            name: 'DataDictionary',
            component: () => import('@/pages/system/setting/dictionary/index.vue'),
            meta: {
              title: {
                zh_CN: '数据字典',
                en_US: 'Data Dictionary',
              },
            },
          },
          {
            path: 'log',
            name: 'LogManagement',
            component: () => import('@/pages/system/setting/log/index.vue'),
            meta: {
              title: {
                zh_CN: '日志管理',
                en_US: 'Log Management',
              },
            },
          },
        ],
      },
      {
        path: 'workflow',
        name: 'WorkflowManagement',
        component: () => import('@/pages/system/workflow/index.vue'),
        meta: {
          title: {
            zh_CN: '流程管理',
            en_US: 'Workflow Management',
          },
        },
        children: [
          {
            path: 'design',
            name: 'WorkflowDesign',
            component: () => import('@/pages/system/workflow/design/index.vue'),
            meta: {
              title: {
                zh_CN: '流程设计',
                en_US: 'Workflow Design',
              },
            },
          },
          {
            path: 'monitoring',
            name: 'WorkflowMonitoring',
            component: () => import('@/pages/system/workflow/monitoring/index.vue'),
            meta: {
              title: {
                zh_CN: '流程监控',
                en_US: 'Workflow Monitoring',
              },
            },
          },
        ],
      },
      {
        path: 'integration',
        name: 'SystemIntegration',
        component: () => import('@/pages/system/integration/index.vue'),
        meta: {
          title: {
            zh_CN: '系统集成',
            en_US: 'System Integration',
          },
        },
        children: [
          {
            path: 'education-system',
            name: 'EducationSystemIntegration',
            component: () => import('@/pages/system/integration/education-system/index.vue'),
            meta: {
              title: {
                zh_CN: '教务系统对接',
                en_US: 'Education System Integration',
              },
            },
          },
          {
            path: 'ocr-service',
            name: 'OCRServiceConfiguration',
            component: () => import('@/pages/system/integration/ocr-service/index.vue'),
            meta: {
              title: {
                zh_CN: 'OCR服务配置',
                en_US: 'OCR Service Configuration',
              },
            },
          },
          {
            path: 'ai-service',
            name: 'AIServiceConfiguration',
            component: () => import('@/pages/system/integration/ai-service/index.vue'),
            meta: {
              title: {
                zh_CN: 'AI服务配置',
                en_US: 'AI Service Configuration',
              },
            },
          },
        ],
      },
      */
    ],
  },
]; 