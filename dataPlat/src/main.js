// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ant from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'babel-polyfill';
import  store from './store'
import './assets/modify.css'
import './assets/mobile.css'
import './assets/css/iconfont.css'
import  $ajax from './ajax/ajax.js';
import 'lib-flexible';
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
Vue.prototype.$ajax=$ajax;
Vue.config.productionTip = false;
Vue.use(ant);
/* eslint-disable no-new */
//自定义指令
 Vue.directive('bury',{
   bind:function(el,binding){
     el.addEventListener('click',()=>{
       const val=binding.value;
       $ajax('buriedpoint/web/visit','POST',val).then(res=>{
       })
     });

   }
 });
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
