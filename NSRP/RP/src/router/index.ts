import uniq from 'lodash/uniq';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const env = import.meta.env.MODE || 'development';

// 过滤掉homepage路由
// const homepageModules = import.meta.glob('./modules/**/homepage.ts', { eager: true });
// 不加载homepage路由
const homepageModules = {};

// 导入modules非homepage相关固定路由
// 修改这里，过滤掉不需要的路由模块，但保留user模块以支持登录功能
const fixedModules = import.meta.glob('./modules/**/!(homepage|result|dashboard).ts', { eager: true });

// 在路由注册前过滤掉不需要的路由
function filterRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.filter((route) => {
    // 不过滤登录页面
    if (route.path === '/login') return true;
    
    // 过滤掉详情页、表单页、列表页、外部页面路由
    const routePath = route.path.toLowerCase();
    const isDetailPage = routePath.includes('/detail') || routePath.includes('detail');
    const isFormPage = routePath.includes('/form') || routePath.includes('form');
    const isListPage = routePath.includes('/list') || routePath.includes('list');
    const isExternalPage = routePath.includes('/external') || routePath.includes('external');
    
    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      route.children = filterRoutes(route.children);
    }
    
    // 返回true表示保留该路由，返回false表示过滤掉
    return !(isDetailPage || isFormPage || isListPage || isExternalPage);
  });
}

// 显式添加登录页路由
const loginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/pages/login/index.vue'),
  meta: {
    title: {
      zh_CN: '登录',
      en_US: 'Login',
    },
  },
};

// 其他固定路由 - 保留必要的重定向路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/ai-analysis/report', // 重定向到AI分析报告页面
  },
  loginRoute, // 添加登录路由
];

// 存放固定路由
export const homepageRouterList: Array<RouteRecordRaw> = mapModuleRouterList(homepageModules);
// 恢复为常量导出，保持与其他文件的兼容性
export const fixedRouterList: Array<RouteRecordRaw> = filterRoutes(mapModuleRouterList(fixedModules));

export const allRoutes = [...homepageRouterList, ...fixedRouterList, ...defaultRouterList];

// 固定路由模块转换为路由
export function mapModuleRouterList(modules: Record<string, unknown>): Array<RouteRecordRaw> {
  const routerList: Array<RouteRecordRaw> = [];
  Object.keys(modules).forEach((key) => {
    // @ts-ignore
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routerList.push(...modList);
  });
  return routerList;
}

/**
 *
 * @deprecated 未使用
 */
export const getRoutesExpanded = () => {
  const expandedRoutes: Array<string> = [];

  fixedRouterList.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path);
    }
    if (item.children && item.children.length > 0) {
      item.children
        .filter((child) => child.meta && child.meta.expanded)
        .forEach((child: RouteRecordRaw) => {
          expandedRoutes.push(item.path);
          expandedRoutes.push(`${item.path}/${child.path}`);
        });
    }
  });
  return uniq(expandedRoutes);
};

export const getActive = (maxLevel = 3): string => {
  // 非组件内调用必须通过Router实例获取当前路由
  const route = router.currentRoute.value;

  if (!route.path) {
    return '';
  }

  return route.path
    .split('/')
    .filter((_item: string, index: number) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('');
};

const router = createRouter({
  history: createWebHistory(env === 'site' ? '/starter/vue-next/' : import.meta.env.VITE_BASE_URL),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});

// 路由守卫，处理登录拦截和权限判断
router.beforeEach((to, from, next) => {
  // 白名单：不需要登录即可访问的路由
  const whiteListRoutes = ['/login'];
  
  // 检查用户是否已登录（可以通过localStorage或pinia/vuex store检查）
  const isAuthenticated = localStorage.getItem('userToken');
  
  // 判断路由是否在白名单内
  const inWhiteList = whiteListRoutes.some(path => to.path.startsWith(path));
  
  if (inWhiteList) {
    // 如果路由在白名单内，直接放行
    next();
  } else if (isAuthenticated) {
    // 如果已登录，放行
    next();
  } else {
    // 如果未登录且访问的不是白名单路由，重定向到登录页
    // 将目标路由的path添加到redirect参数中，以便登录成功后跳转回来
    next({
      path: '/login',
      query: { redirect: encodeURIComponent(to.fullPath) }
    });
  }
});

export default router;
