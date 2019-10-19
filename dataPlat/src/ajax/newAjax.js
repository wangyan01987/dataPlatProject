import  api from './api.js';
import { message } from 'ant-design-vue'
function newAjax(url,method,data1,config,callsuccess,callerror){

    if(method==='POST'){
      let data= Object.assign({},data1);
     api(config).request({url,method,data}).then(res=>{
       res=res.data;
       if(res.code==='001'){
           message.success(response.data);
              callsuccess();
         }
         else{
           message.error(res.msg);
           callerror();
       }
     });
    }
    else{
      let params= Object.assign({},data1);
      return api().request({url,method,params});
    }

}

