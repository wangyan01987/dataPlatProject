<template>
  <div class="content-box">
    <p class="logo"><i class="iconfont icondaqwwwqziyuan"></i></p>
    <div class="box-item" v-show="flag==='001'">
      <p class="title" ><a-icon type="check-circle" theme="filled" style="color:#52c41a;fontSize:24px;"/><span style="margin-left:10px;font-weight: bold">已成功加入项目</span></p>
      <p class="project-content">{{projectName}}</p>
      <p class="action">您可以前往网页继续协作</p>
    </div>
    <div  class="box-item-error" v-show="flag==='002'">
      <p style="font-size:18px;"><a-icon type="close-circle" theme="filled" style="color:#f5222d;font-size:24px;margin-right:10px;"/>{{errorMsg}}</p>
    </div>
    <div class="box-item" v-show="flag==='000'">
      <p class="title" ><a-icon type="check-circle" theme="filled" style="color:#52c41a;fontSize:24px;"/><span style="margin-left:10px;font-weight: bold">登录成功</span></p>
      <p class="project-content">{{projectName}}</p>
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
        errorMsg:''
      }
    },
    methods:{
      goProject(){
        this.$router.push({name:'projectDetail',params:{projectId:this.projectId}});

      }
    },
    mounted() {
      //获取参数
      let code = this.$route.query.code;
      let msg = this.$route.query.msg;
      if (code) {
        this.$ajax('bomextract/buildmember/getinvitparam','GET',{code:code}).then(res=>{
          res=res.data;
          if(res.code==='001'){
            this.projectName=res.data.projectName;
            this.projectId=res.data.projectId;
            this.flag='001'
          }else if(res.code==='002'){
            this.flag='002';
            this.errorMsg=res.msg;
          }

        })
      }
      else if(msg){
        this.flag='001';

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
  }
  .content-box{
    width:100%;
    height:100%;
    text-align:center;
    overflow:hidden;
  }
  .box-item{
    margin:40% auto;
    width:100%;
    padding-top:0.8rem;
    padding-bottom: 0.48rem;
    background-color:#fff;
  }
  .action{
    width: 100%;
    height: 0.6rem;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: rgba(0, 0, 0, 0.65);

  }
  .box-item-error{
     height:3.6rem;
    background-color: #fff;
    margin: 20% auto;
    line-height: 3.6rem;
    width:90%;
    border:none;
  }

</style>
