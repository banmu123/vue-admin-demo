import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/base.css' 
import App from './App.vue'
import './assets/global.css'
import router from './router'
import store from './store'

// 导入权限控制模块
import './permission'

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
