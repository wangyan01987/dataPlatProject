<template>
<div class="container mobile">
  <div class="login-box box-body " v-show="login">
    <a-tabs defaultActiveKey="1" @change="callback" :activeKey="key">
      <a-tab-pane tab="登录" key="1" >
         <login v-show="loginType==='001'"></login>
        <loginmobile v-show="loginType==='002'"></loginmobile>
      </a-tab-pane>
      <a-tab-pane tab="注册" key="2" forceRender><register @registerSuccess="registerSuccess"></register></a-tab-pane>
    </a-tabs>
    <div class="action-box" v-if="loginType==='001'||loginType==='002'">
      <span @click="forgetPsd"  v-show="loginType==='001'"  >忘记密码？</span>
      <span @click="loginMobile"  v-show="loginType==='001'">验证码快速登录</span>
      <span  v-show="loginType==='002'"></span>
      <span @click="loginType='001'"  v-show="loginType==='002'" >账号密码登录</span>
    </div>
  </div>
    <div class="login-box box-body" v-show="!login&&!registered&&!repassworded">
      <P class="repsd"><span>重置密码</span></P>
      <forgetpsd  @changePsd="changePsd"></forgetpsd>
         <p style="text-align:right"><a @click="login=true">返回登录页</a></p>
    </div>
  <div class="login-box box-body" v-show="repassworded">
    <div class="registerSuccess " >
      <p class="title" ><a-icon type="check-circle" theme="filled" style="color:#52c41a;fontSize:24px;margin-right:10px;"/>重置密码成功</p>
      <a-button  type="primary" style="width:100%"  @click="goLogin('001')" >登录</a-button>
    </div>
  </div>
  <div class="login-box box-body" v-show="registered">
    <div class="registerSuccess " >
      <p class="title" ><a-icon type="check-circle" theme="filled" style="color:#52c41a;fontSize:24px;margin-right:10px;"/>注册成功</p>
      <a-button  type="primary" style="width:100%"  @click="goLogin('002')" >登录</a-button>
    </div>
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
        login:true,
        registered:false,
        key:'1',
        repassworded:false
      }
    },
    mounted(){
      // this.$store.commit('setLogin',true);
      //  console.log(this.$store.state.isLogin)
    },
    methods:{
      callback(val){
        if(val==='2'){
          this.key='2';
          this.loginType='000'
        }else{
          this.key='1';
          this.loginType='001';
        }
      },
      registerSuccess(val){
        if(val){
         this.registered=true;
         this.login=false;
        }else{
          this.registered=false;
        }
      },
      forgetPsd(){
        this.login=false;
      },
      loginMobile(){
        this.loginType='002'
      },
      changePsd(val){
        this.repassworded=true;
        this.login=false;
      },

      goLogin(flag){
        this.login=true;
        this.loginType='001';
        if(flag==='001'){
          this. repassworded=false;
          this.key='1';
        }
        else{
          this.registered=false;
          this.key='1';
        }


      }
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
    height: 64.4%;
    background-color: #ffffff;
    border-radius: 0.2rem;
    position:absolute;
    bottom:3.5%;
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
  .registerSuccess{
    margin-top:27%;
  }
   .registerSuccess .title{
         font-size:18px;
     margin-bottom: 11.8%;
   }
</style>
