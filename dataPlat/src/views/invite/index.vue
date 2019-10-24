<template>

    <div class="content-box">
      <div v-if="isValid" class="box-item">
        <p class="title">{{title}}</p>
        <p class="project-content">{{projectName}}</p>
        <p><a-button type="primary" @click="goInvite">接受邀请</a-button></p>
      </div>
      <div  class="box-item" v-else>
        <p><a-icon type="close-circle" theme="filled" style="color:#f5222d"/>邀请链接已经失效</p>
      </div>
    </div>

</template>

<script>
    export default {
        name: "index",
      data(){

          return{
            userName:'杨乐乐',
            projectName:'大数据第一期项目',
            projectId:'',
            isValid:true,
            bodyStyle:{height:500}
          }
      },
      computed:{
             title(){
               return this.userName+'邀请你加入项目'
             }
      },
      methods:{
          cancel(){

          },
        goInvite(){

                this.$ajax('bomextract/buildmember/acceptinvitation','GET',{projectId:this.projectId}).then(res=>{
                  if(res.data.code==='001'){
                     //加入成功页面
                      this.$router.push({name:'joinSuccess',query:{projectId:this.projectId,projectName:this.projectName}});
                  }
                  else if(res.data.code==='002'){
                    this.$router.push({name:'joinSuccess',query:{projectId:this.projectId,projectName:this.projectName}});
                  }
                  else{
                    this.$message.error(res.data.msg,5);
                  }
                })
          }
      },
      mounted(){
          // this.$ajax('http://pstbj.com:6041/bomextract/buildmember/invitation/A46A907E0D76C62BC825B6EAFB1C00CCF51D28A084201035737E7B9419E0143A9F5D37FAEEF239EC6B60572A92777569','GET').then(res=>{
          //   res=res.data;
          //   if(res.code==='001'){
          //         this.userName=res.data.userName;
          //         this.projectName=res.data.projectName;
          //        this.projectId=res.data.projectId;
          //          this.isValid=true;
          //   }
          //   else if(res.code==='002'){
          //     this.isValid=false;
          //   }
          //   else{
          //     this.isValid=false;
          //     this.$message.error(res.msg);
          //   }
          //
          // })
        this.userName=this.$route.query.userName;
        this.projectName=this.$route.query.projectName;
        this.projectId=this.$route.query.projectId;
        this.isValid=this.$route.query.isValid;
        let flag=this.document.body.clientWidth;
        if(flag<750){
            this.$router.push({name:'/loginMobile',query:{userName:this.userName,projectName:this.projectName,projectId:this.projectId,isValid:this.isValid}});
        }
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
  .box-item{
    margin:10% auto;
    width:5.8rem;
    height:3.6rem;
    padding-top:0.8rem;
    padding-bottom: 0.48rem;
    border: solid 1px rgba(0, 0, 0, 0.25);
    background-color:#fff;
  }

</style>
