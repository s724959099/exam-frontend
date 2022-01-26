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

const err = (error) => {
  if (error.response.status === 401) {
    console.log('demo');
    // window.location.href = '/login';
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use((config) => {
  const accessToken = Vue.ls.get('access_token');
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
