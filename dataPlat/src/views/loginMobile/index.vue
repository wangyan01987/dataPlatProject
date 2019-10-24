<template>
<div class="container mobile">
  <div class="login-box box-body " v-show="login">
    <a-tabs defaultActiveKey="1" @change="callback" >
      <a-tab-pane tab="登录" key="1">
         <login v-show="loginType==='001'"></login>
        <loginmobile v-show="loginType==='002'"></loginmobile>
      </a-tab-pane>
      <a-tab-pane tab="注册" key="2" forceRender><register></register></a-tab-pane>
    </a-tabs>
    <div class="action-box" v-if="loginType==='001'||loginType==='002'">
      <span @click="forgetPsd"  v-show="loginType==='001'"  >忘记密码？</span>
      <span @click="loginMobile"  v-show="loginType==='001'">验证码快速登录</span>
      <span  v-show="loginType==='002'"></span>
      <span @click="loginType='001'"  v-show="loginType==='002'" >账号密码登录</span>
    </div>
  </div>
    <div class="login-box box-body" v-show="!login">
      <P class="repsd"><span>重置密码</span></P>
      <forgetpsd ></forgetpsd>
         <p style="text-align:right"><a @click="login=true">返回登录页</a></p>
    </div>
</div>
</template>

<script>
  import login from './login'
  import register from './register'
  import forgetpsd from './ForgetPsd'
  import loginmobile from  './Login-phone'
  export default {
    name: "index",
    components:{login ,register,loginmobile,forgetpsd},
    data(){
      return{
        //001  账号登陆，默认
        //002  快速登陆
        //000 注册
        loginType:'001',
        visible:false,
        login:true
      }
    },
    mounted(){
      // this.$store.commit('setLogin',true);
      //  console.log(this.$store.state.isLogin)
    },
    methods:{
      callback(val){
        if(val==='2'){
          this.loginType='000'
        }else{
          this.loginType='001';
        }
      },
      forgetPsd(){
        this.login=false;
      },
      loginMobile(){
        this.loginType='002'
      },
    }
  }

</script>


<style scoped>
   .container{
     height:100%;
     width:100%;
     background: url("./image/bg-h5.png") no-repeat  ;
     background-size:cover;
     position:relative;
   }
  .login-box{
    width: 9.1rem;
    height: 58.4%;
    background-color: #ffffff;
    border-radius: 0.2rem;
    position:absolute;
    bottom:3.6%;
    left:4.3%;
    padding:0.5rem;
  }
   .action-box{
     display:flex;
     justify-content: space-between;
     width: 100%;
     font-family: PingFangSC-Regular;
     font-size: 14px;
     font-weight: normal;
     font-stretch: normal;
     letter-spacing: 0px;
     color: #1890ff;
     margin-top:24px;
   }
   .action-box span{
     cursor:pointer;
   }
   .markTitle{
     position:absolute;
     left:1.6rem;
     bottom: 0.9rem;
     font-family: PingFangSC-Semibold;
     font-size: 24px;
     font-weight: normal;
     font-stretch: normal;
     letter-spacing: 0px;
     color: rgba(255, 255, 255, 0.45);
   }
  .repsd{
    text-align:center;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    letter-spacing: 0px;
    color: #1890ff;
    padding-bottom:10px;
  }
  .repsd span{
    display:block;
    width:2.3rem;
    line-height:40px;
    border-bottom:2px solid #1890ff ;
    margin:0 auto;

  }
</style>
