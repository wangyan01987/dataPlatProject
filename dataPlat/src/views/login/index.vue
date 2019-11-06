<template>
 <div class="container">
    <div class="box-top">
      <p class="logo"><i class="iconfont icondaqwwwqziyuan" style="font-size:24px;margin-right:10px;"></i>平行数据平台</p>
      <p class="action"><span>客户端下载</span>|<span>关于PST</span>|<span>联系我们</span></p>
    </div>
   <p class="markTitle">为建筑产业提供不断优化的数据和算法服务</p>
   <div class="box-body">
        <div class="login-box">
          <a-tabs defaultActiveKey="1" @change="callback" :tabBarGutter="44">
            <a-tab-pane tab="登录" key="1">
              <login v-if="loginType==='001'"></login>
              <loginmobile v-if="loginType==='002'"></loginmobile>
            </a-tab-pane>
            <a-tab-pane tab="注册" key="2" ><register v-if="loginType==='000'" @gologin=""></register></a-tab-pane>
          </a-tabs>
          <div class="action-box" v-if="loginType==='001'||loginType==='002'">
            <span @click="forgetPsd"  v-show="loginType==='001'"  >忘记密码？</span>
            <span @click="loginMobile"  v-show="loginType==='001'">验证码快速登录</span>
            <span  v-show="loginType==='002'"></span>
            <span @click="loginType='001'"  v-show="loginType==='002'" >账号密码登录</span>
          </div>
        </div>
   </div>
   <a-modal
     title="重置密码"
     v-model="visible"
     :footer='null'
     style="top: 150px;"
     width="444px"
     :destroyOnClose=true
   >
     <forgetpsd @success="visible=false"></forgetpsd>
   </a-modal>
   <div class="box-foot">
     <p>
       copyright@2019平行系统（北京）信息技术有限公司
     </p>
   </div>
 </div>
</template>

<script>
  import login from '@/components/Login'
  import register from '@/components/Register'
  import forgetpsd from '@/components/Login/ForgetPsd'
  import loginmobile from  '@/components/Login/Login-phone'
    export default {
        name: "index",
      components:{login ,register,loginmobile,forgetpsd},
      data(){
            return{
              //001  账号登陆，默认
              //002  快速登陆
              //000 注册
              loginType:'001',
              visible:false
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
              this.visible=true;
             },
        loginMobile(){
           this.loginType='002'
        },
      }
    }
</script>
<style scoped>
  .container p{
    margin-bottom: 0;
  }
 .container{
   background:url("../../assets/images/bg-dl@2x.png") fixed center;
   background-size:cover;
   height:100%;
   width:100%;
   position:relative;
 }
  .box-top{
      display:flex;
    padding-left:32px;
    padding-top:0.22rem;
    padding-right:0.7rem;
    color: #ffffff;
    justify-content: space-between;
    z-index: 1000;
  }
  .logo{

    line-height: 0.33rem;
    font-family: PingFangSC-Semibold;
    font-size: 0.24rem;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;

  }
  .action{
    font-size:0.16rem;
    line-height: 0.33rem;
  }
  .action span{
    padding:0 0.1rem;
    cursor:pointer;
  }
  .box-body{
    width:100%;
  height:100%;
    position:absolute;
    top:0;
  }
  .login-box{
    position:absolute;
    top:1.02rem;
    right:0.7rem;
    width: 4.44rem;
    /*height: 45rem;*/
    /*max-height:600px;*/
    overflow: auto;
    background-color: #ffffff;
    border-radius: 0.12rem;
    padding:25px 32px;
  }
  .box-foot{
    width:100%;
     position:fixed;
    bottom: 0.24rem;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: rgba(255, 255, 255, 0.65);
    text-align:center;
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
</style>
