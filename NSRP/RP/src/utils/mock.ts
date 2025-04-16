import axios from 'axios';
import { MessagePlugin } from 'tdesign-vue-next';

// 配置基础路径
const BASE_URL = '/';

/**
 * 创建一个模拟请求接口，用于测试阶段
 * 会自动将请求转发到mock服务
 */
export const mockRequest = (config: {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}) => {
  const { url, method = 'get', data, headers = {}, timeout = 10000 } = config;
  
  // 创建axios实例
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  
  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      const { data } = response;
      if (data.code === 0 || data.code === 200) {
        return data.data;
      }
      // 处理错误
      MessagePlugin.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    },
    (error) => {
      MessagePlugin.error(error.message || '网络错误');
      return Promise.reject(error);
    }
  );
  
  // 发送请求
  if (method.toLowerCase() === 'get') {
    return instance.get(url, { params: data });
  }
  
  if (method.toLowerCase() === 'post') {
    return instance.post(url, data);
  }
  
  if (method.toLowerCase() === 'put') {
    return instance.put(url, data);
  }
  
  if (method.toLowerCase() === 'delete') {
    return instance.delete(url, { params: data });
  }
  
  return Promise.reject(new Error(`不支持的请求方法: ${method}`));
} 