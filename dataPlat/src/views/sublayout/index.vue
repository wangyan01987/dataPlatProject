<template>
  <div class="sub-container">
    <a-menu  :defaultSelectedKeys="current" mode="horizontal">
      <a-menu-item key="building">
        <router-link :to="{name:'building'}">单体</router-link>
      </a-menu-item>

      <a-menu-item key="BOM" >
        <router-link to="BOM">BOM</router-link>
      </a-menu-item>
      <a-menu-item key="member">
        <router-link to="member">成员</router-link>
      </a-menu-item>
    </a-menu>
    <span class="blue" @click="showProjectInfo" style="margin-right:50px" v-bury="buryObj">查看项目信息</span>
    <projectform  :propMsg='propMsg' ref="projectform" ></projectform>
    <router-view></router-view>
  </div>
</template>
<script>
  import projectform from '@/components/ProjectForm'
  export default {
    components:{projectform},
    data () {
      let buryObj={
        action:'actionProjectDetailGetProjectDetailBtn',
        user: this.$store.state.userId,
        eventType:'buttonClick',
        eventName:'ProjectDetailGetProjectDetailBtn',
        pageName:'项目详情',
        pageArea:'All',
        terminal:'PC'
      };


      return {
        propMsg:{},
        buryObj,
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
      //设置高度
      let height=document.body.offsetHeight-64+'px';
      document.getElementsByClassName('sub-container')[0].style.cssText=`min-height:${height};height:${height};`;
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
    /*height:auto !important;*/
   /*// flex:auto;*/
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
