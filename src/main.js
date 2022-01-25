import Vue from 'vue';
import Antd from 'ant-design-vue/es';
import App from './App.vue';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';
import { VueAxios } from './utils/request';

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(VueAxios);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
