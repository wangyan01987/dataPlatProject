<template>
  <div class="content-box">
    <div class="box-item">
      <p class="title"><a-icon type="check-circle" theme="filled" style="color:#52c41a"/>已成功加入项目</p>
      <p class="project-content">{{projectName}}</p>
      <p><a-button type="primary" @click="goProject(projectId)">进入项目</a-button></p>
    </div>
  </div>

</template>

<script>
    export default {
        name: "joinSuccess",
      data(){
          return{
            projectName:'',
            projectId:''
          }
      },
      methods:{
          goProject(){

          }
      },
      mounted(){
        this.projectName=this.$route.params.projectName;
        this.projectId=this.$route.params.projectId;
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
