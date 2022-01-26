import Vue from 'vue';
import axios from 'axios';

// 创建 axios 实例
const baseURL = process.env.VUE_APP_API_URL;
const service = axios.create({
  // todo http -> https
  baseURL,
  timeout: 60000, // 请求超时时间
});
service.all = axios.all;
const refreshToken = () => service.post('/auth/refresh/').then((res) => {
  Vue.ls.set('access_token', res.data.access_token);
  Vue.ls.set('refresh_token', res.data.refresh_token);
}).catch(() => {
  Vue.ls.remove('access_token');
  Vue.ls.remove('refresh_token');
});

const err = (error) => {
  // need to refresh
  if (error.response.status === 422 && error.response.config.url !== '/auth/refresh/' && error.response.data.detail === 'Signature has expired') {
    return refreshToken().then(() => Promise.resolve(service(error.response.config)));
  }
  if (error.response.status === 401 && error.response.config.url !== '/auth/login/') {
    window.location.href = '/login';
  }
  if (error.response.status === 422 && error.response.config.url === '/auth/refresh/') {
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use((config) => {
  const accessToken = config.url === '/auth/refresh/' ? Vue.ls.get('refresh_token') : Vue.ls.get('access_token');

  if (accessToken) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, err);

// response interceptor
service.interceptors.response.use((response) => response, err);
service.baseURL = baseURL;

const installer = {
  vm: {},
  install(vue) {
    // eslint-disable-next-line no-param-reassign
    vue.prototype.$axios = service;
    // eslint-disable-next-line no-param-reassign
    vue.prototype.$baseURL = baseURL;
  },
};

export {
  installer as VueAxios,
  service as axios,
};
