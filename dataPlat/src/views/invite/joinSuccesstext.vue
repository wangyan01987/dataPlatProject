<template>
  <div class="content-box">
    <p class="logo"><i class="iconfont icondaqwwwqziyuan"></i></p>
    <div  class="box-item">
      <p class="title">邀请你加入项目</p>
         <p v-for="item in projectList" :key="item.projectId">{{item.projectName}}</p>
      <p><a-button type="primary" @click="goInvite">接受邀请</a-button></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){

      return{
        userName:'',
        projectList:[],
        code:'',
        bodyStyle:{height:500}
      }
    },
    computed:{
      // title(){
      //   return this.userName+'邀请你加入项目'
      // }
    },
    methods:{
      goInvite() {
              let arr=this.projectList.map(item=>{
                return item.projectId;
              });

        this.$ajax('bomextract/buildmember/acceptinvitationlist', 'POST', {projectList:arr}).then(res => {
          if (res.data.code === '001') {
            //加入成功页面
            let client=document.body.clientWidth;
            if(client<750){
              this.$router.push({path:'/joinSuccessMobile',query:{msg:'001'}});
            }
            else{
              this.$router.push('/home');
            }
            this.$message.success('成功加入项目');

          }
          else {
            this.$message.error(res.data.msg);
          }
        });
      }

    },
    mounted(){
      this.$ajax('bomextract/buildmember/getinvitparam','GET').then(res=>{
        res=res.data;
        if(res.code==='001'){
          if(res.data.projectList.length>0){
             this.projectList=res.data.projectList;
              if(this.projectList.length===0){
                this.$router.push('/home');
              }
          }
        }
        else{
          this.$router.push('/home');
        }
      });

    }

  }
</script>

<style scoped>
  .title{
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: rgba(0, 0, 0, 0.85);
  }
  .project-content{
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 129px;
  }
  .content-box{
    height:100%;
    text-align:center;
    overflow:hidden;
    background-color:#F2F3F5;
  }
  .logo{
    text-align:left;
    margin-left:32px;
    margin-top:20px;
  }
  .logo i{
    font-size:24px;
    color:#1890ff;
  }
  .box-item{
    margin:10% auto;
    width:5.8rem;
    height:3.6rem;
    padding-top:0.8rem;
    padding-bottom: 0.48rem;
    border: solid 1px rgba(0, 0, 0, 0.25);
    background-color:#fff;
  }

  @media screen and (max-width: 750px) {
    .box-item{
      margin-top:20%;
      width:90%;
      border:none;
    }
    .box-item-error{
      margin-top:20%;
      width:90%;
      border:none;
    }
    .project-content{
      margin-bottom: 80px;
    }
    .content-box{
      background-color:#fff;
    }
  }

</style>
