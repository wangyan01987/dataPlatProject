<template>
  <div class="content-box">
     <div class="box-item" v-show="flag==='000'">
          <p>
            <a-icon type="exclamation-circle" theme="filled" style="color:greenyellow" />
              您还未登录，请先登录,3s后将跳转到登录页面！
          </p>
     </div>
    <div class="box-item" v-show="flag==='002'">
      <p>
        <a-icon type="close-circle" theme="filled" style="color:red;font-size: 14px"  />{{errorMsg}}
      </p>
    </div>
    <div class="box-item" v-show="flag==='001'">
      <p class="title" ><a-icon type="check-circle" theme="filled" style="color:#52c41a"/>已成功加入项目</p>
      <p class="project-content">{{projectName}}</p>
      <p><a-button type="primary" @click="goProject()">进入项目</a-button></p>
    </div>
  </div>

</template>

<script>
    export default {
        name: "joinSuccess",
      data(){
          return{
            projectName:'',
            projectId:'',
            flag:'',
            errorMsg:''
          }
      },
      methods:{
          goProject(){
            this.$router.push({name:'projectDetail',params:{projectId:this.projectId}});

          }
      },
      mounted(){
          //获取参数
        let code=this.$route.query.code;
        if(!this.$store.state.isLogin&&code) {
          this.flag='000';
          setTimeout(() => {
            this.$router.push({
              name: 'login',
              query: {code:code}
            });

          }, 3000);
          return;
        }
        else if(code){
          this.$ajax('bomextract/buildmember/getinvitparam','GET',{code:code}).then(res=>{
             res=res.data;
             if(res.code==='001'){
                 this.projectName=res.data.projectName;
               this.projectId=res.data.projectId;
               this.flag='001'
             }
             else{
               this.flag='002';
               this.errorMsg=res.msg;
             }
          })

        }
        else{
          this.$message.error('错误');
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
