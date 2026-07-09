import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';

const http: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取用户 token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const { data } = response;

    // 业务错误处理
    if (data.code !== 0) {
      console.error(`API Error [${data.code}]: ${data.message}`);
      return Promise.reject(new Error(data.message));
    }

    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error('请求参数错误:', data?.message);
          break;
        case 401:
          console.error('未授权');
          // 可以触发跳转到登录页
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            // window.location.href = '/login';
          }
          break;
        case 404:
          console.error('资源不存在');
          break;
        case 429:
          console.error('请求过于频繁');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        case 503:
          console.error('AI服务暂时不可用');
          break;
        default:
          console.error(`请求失败 [${status}]:`, data?.message);
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
    } else {
      console.error('请求配置错误:', error.message);
    }

    return Promise.reject(error);
  }
);

export default http;
