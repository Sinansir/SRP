import { DashboardIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/overview',
    name: 'dashboard',
    meta: {
      title: {
        zh_CN: '首页/工作台',
        en_US: 'Dashboard',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'overview',
        name: 'DashboardOverview',
        component: () => import('@/pages/dashboard/overview/index.vue'),
        meta: {
          title: {
            zh_CN: '数据概览',
            en_US: 'Overview',
          },
        },
      },
      {
        path: 'todo',
        name: 'DashboardTodo',
        component: () => import('@/pages/dashboard/todo/index.vue'),
        meta: {
          title: {
            zh_CN: '待办事项',
            en_US: 'Todo Items',
          },
        },
      },
      {
        path: 'recent',
        name: 'DashboardRecent',
        component: () => import('@/pages/dashboard/recent/index.vue'),
        meta: {
          title: {
            zh_CN: '最近编辑',
            en_US: 'Recent Edits',
          },
        },
      },
      {
        path: 'notice',
        name: 'DashboardNotice',
        component: () => import('@/pages/dashboard/notice/index.vue'),
        meta: {
          title: {
            zh_CN: '通知公告',
            en_US: 'Notices',
          },
        },
      },
      // 暂时注释掉缺失的组件路由
      /*
      {
        path: 'shortcut',
        name: 'DashboardShortcut',
        component: () => import('@/pages/dashboard/shortcut/index.vue'),
        meta: {
          title: {
            zh_CN: '快捷入口',
            en_US: 'Shortcuts',
          },
        },
      },
      */
    ],
  },
]; 