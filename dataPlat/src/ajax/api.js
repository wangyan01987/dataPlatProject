
import axios from 'axios'
import { message } from 'ant-design-vue'
import store from '../store/index.js'
import router from '../router/index.js'

// 创建axios实例

function getApi(dataType){
  const service = axios.create({
    baseURL: process.env.Base_URL, // api的base_url 设置代理后不需要baseUrl
    timeout: 30000 // 请求超时时间
  });
// request拦截器
  let errorMessage = true;
  service.interceptors.request.use(
    config => {
      //token
      let token=localStorage.getItem('token');
      if(token){
        config.headers.common['Authorization']=token;
      }
// 设置当前请求是否是错误提示
      try {
        errorMessage = config.setting.errorMessage
      } catch (err) {
        errorMessage = true
      }
// 设置请求参数
     if(dataType){
       config.headers['Content-Type'] = 'multipart/form-data';
       let form=new FormData();
       for(let item in config.data){
         form.append(item,config.data[item]);
       };
       config.data=form;
     };
      return config;
    },
    error => {
      Promise.reject(error)
    }
  );
//respone拦截器
  service.interceptors.response.use(response => {
     const token=response.headers.token;
      const code = response.data.code;
    if(token){
        localStorage.setItem('token',token);
      };
      if(code==='999'){

        //删除token
         localStorage.removeItem('token');
           if(store.state.isLogin){
             message.error('请先登录',5);
           }
          //跳转到登录页
        router.push('/login');
        store.commit('setLogin',false);   //重新登录

      }
      return response;

    },
    error => {
     // message.error('系统错误，请稍后重试',5);
      return Promise.reject(error)
    }
  );
  return service;
}
export default getApi
