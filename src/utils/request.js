import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL;
axios.defaults.xsrfCookieName = 'csrf_access_token';
axios.defaults.xsrfHeaderName = 'X-CSRF-Token';
axios.defaults.withCredentials = true;
const service = axios.create({
  baseURL,
  timeout: 60000,
  withCredentials: true,
});
service.all = axios.all;
const refreshToken = () => service.post('/auth/refresh/').catch(() => service.delete('/auth/logout/'));

const err = (error) => {
  // need to refresh
  if (error.response.status === 403 && error.response.config.url !== '/auth/refresh/') {
    return refreshToken().then(() => Promise.resolve(service(error.response.config)));
  }
  if (error.response.status === 401 && error.response.config.url !== '/auth/login/') {
    window.location.href = '/login';
  }
  if (error.response.status === 403 && error.response.config.url === '/auth/refresh/') {
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use((config) => config, err);

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
