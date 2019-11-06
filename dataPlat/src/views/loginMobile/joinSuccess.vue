<template>
  <div class="content-box">
    <div class="box-item" v-show="flag==='001'">
      <p class="title" ><a-icon type="check-circle" theme="filled" style="color:#52c41a"/>已成功加入项目</p>
      <p class="project-content">{{projectName}}</p>
      <p class="action">您可以前往网页继续协作</p>
    </div>
    <div class="box-item" v-show="flag==='000'">
      <p class="title" ><a-icon type="check-circle" theme="filled" style="color:#52c41a"/>登录成功</p>
      <p class="action">您可以前往网页继续协作</p>
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
       if(code){
        this.$ajax('bomextract/buildmember/getinvitparam','GET',{code:code}).then(res=>{
          res=res.data;
          if(res.code==='001'){
            this.projectName=res.data.projectName;
            this.projectId=res.data.projectId;
            this.flag='001'
          }

        });
      }
      else{
       this.flag='000';
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
    width:100%;
    height:100%;
    text-align:center;
    overflow:hidden;
  }
  .box-item{
    margin:27% auto;
    width:100%;
    padding-top:0.8rem;
    padding-bottom: 0.48rem;
    border: solid 1px rgba(0, 0, 0, 0.25);
    background-color:#fff;
  }
  .action{
    width: 4.7rem;
    height: 0.6rem;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: rgba(0, 0, 0, 0.65);

  }

</style>
