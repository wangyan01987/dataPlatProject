<template>
  <div class="sub-container">
    <a-menu  :defaultSelectedKeys="current" mode="horizontal">
      <a-menu-item key="building">
        <router-link :to="{name:'building'}">单体</router-link>
      </a-menu-item>
      <a-menu-item key="BOM" >
        <router-link to="BOM">BOM</router-link>
      </a-menu-item>
      <!--<a-menu-item key="file">-->
     <!--<router-link  :to="{name:'file'}">文件</router-link>-->
      <!--</a-menu-item>-->
      <!--<a-menu-item key="issue">-->
        <!--<router-link :to="{name:'issue'}">任务</router-link>-->
      <!--</a-menu-item>-->
      <!--<a-menu-item key="statics">-->
        <!--<router-link :to="{name:'statics'}">统计</router-link>-->
      <!--</a-menu-item>-->
      <a-menu-item key="member">
        <router-link :to="{name:'member'}">成员</router-link>
      </a-menu-item>
    </a-menu>
    <span class="blue" @click="showProjectInfo" style="margin-right:50px">查看项目信息</span>
    <projectform  :propMsg='propMsg' ref="projectform" ></projectform>
    <router-view></router-view>
  </div>
</template>
<script>
  import projectform from '@/components/ProjectForm'
  export default {
    components:{projectform},
    data () {
      return {
        propMsg:{}
      }
    },
    computed:{
      current(){
        return [this.$route.name]
      }
    },
    watch:{
         '$route.name'(val){

         }
    },
    methods:{
      showProjectInfo(){
        let id=this.$route.params.projectId;
        this.propMsg.dataflag=0;
        this.propMsg.projectId=id;
        this.$refs.projectform.visible=true;
      this.$refs.projectform.currentDataflag=0;
      }
    },
    mounted(){
      let that=this;
      window.addEventListener("popstate", function(e) {
       that.$router.push({path:'/home'})
      }, false);
    }
  }
</script>

<style scoped>
  .sub-container{
    position:relative;
    width:100%;
    /*height:100%;*/
    min-height:100%;
    display:flex;
    flex-direction: column;
   // flex:auto;
  }
  .blue{
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #1890ff;
    cursor: pointer;
    position:absolute;
    right:0.05rem;
    top:0;
    line-height: 0.47rem;
  }
</style>
