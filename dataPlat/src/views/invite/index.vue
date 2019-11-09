<template>
    <div class="content-box">
      <p class="logo"><i class="iconfont icondaqwwwqziyuan"></i></p>
      <div v-show="isValid==='001'" class="box-item">
        <p class="title">{{title}}</p>
        <p class="project-content">#{{projectName}}#</p>
        <p><a-button type="primary" @click="goInvite" style="width:160px;height:40px;">接受邀请</a-button></p>
      </div>
      <div  class="box-item-error" v-show="isValid==='002'">
        <p style="font-size:18px;"><a-icon type="close-circle" theme="filled" style="color:#f5222d;font-size:24px;margin-right:10px;"/>{{errorMsg}}</p>
      </div>
      <div>

      </div>
    </div>
</template>

<script>
    export default {
        name: "index",
      data(){

          return{
            userName:'',
            projectName:'',
            projectId:'',
            isValid:'',
            code:'',
            errorMsg:'',
            bodyStyle:{height:500}
          }
      },
      computed:{
             title(){
               return  '#'+this.userName+'#'+'邀请你加入项目'
             }
      },
      methods:{
          cancel(){

          },
        goInvite(){
          let flag=document.body.clientWidth;
                  if(localStorage.getItem('token')){
                    this.$ajax('bomextract/buildmember/acceptinvitation','GET',{projectId:this.projectId}).then(res=>{
                      if(res.data.code==='001'){
                        //加入成功页面
                        this.$router.push({name:'joinSuccess',query:{code:this.code}});
                      }
                      else{
                         if(flag<750){
                           this.$router.push({name:'joinSuccessMobile',query:{code:this.code}});
                           this.$message.error(res.data.msg);
                         }
                         else{
                           this.$router.push({name:'joinSuccess',query:{code:this.code}});
                           this.$message.error(res.data.msg);
                         }
                      }
                    });
                  }
                  else{
                    if(flag<750){
                      this.$message.error('您还未登录，请先登录');
                      this.$router.push({name:'loginMobile',query:{code:this.code}});
                    }else{
                      this.$message.error('您还未登录，请先登录');
                      this.$router.push({name:'joinSuccess',query:{code:this.code}});
                    }

                  }
          }
      },
      mounted(){
        let flag=document.body.clientWidth;
        this.code=this.$route.query.code;
        if(this.code){
          this.$ajax('bomextract/buildmember/getinvitparam','GET',{code:this.code}).then(res=>{
            res=res.data;
            if(res.code==='001'){
              this.isValid='001';
              this.userName=res.data.userName;
              this.projectName=res.data.projectName;
              this.projectId=res.data.projectId;
            }
            else{
                this.isValid='002';
                this.errorMsg=res.msg;
            }
          })
        }else{
          let token=localStorage.getItem('token');
          if(!token){
                //登录
            this.$message.error('您还未登录，请先登录');
            if(flag<750){
             this.$router.push({path:'/loginMobile',query:{msg:'001'}})
            }
            else{
              this.$router.push({path:'/login',query:{msg:'001'}})
            }
             }
             else{
               this.$router.push({path:'/joinSuccesstext'})

                 }

        }

      }

    }
</script>

<style scoped>
  .title{
    font-size: 18px;
    font-weight: bold;
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
  .box-item-error{
    width:5.8rem;
    height:3.6rem;
    background-color: #fff;
    border: solid 1px rgba(0, 0, 0, 0.25);
    margin: 176px auto;
    line-height: 3.6rem;
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
