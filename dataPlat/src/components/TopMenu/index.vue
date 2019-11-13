<template>
  <a-dropdown :trigger="['click']">
    <span class="ant-dropdown-link top-name" >
      <a-tooltip>
    <template slot="title">
      {{projectName}}
    </template>
   <span>
      {{projectName}}</span>
  </a-tooltip>
       <i class="iconfont icondown-fill1-xs"></i>
    </span>

  <a-menu slot="overlay" class="top-menu" >
    <a-menu-item v-for="item in menuList" :key="item.projectId" @click="changeProject(item.projectName)">
      <router-link :to='"/projectDetail/"+item.projectId+"/"+path' >
        <img :src="item.img"  style="width:80px;margin-right:15px;"/>
        <span >{{item.projectName}}</span></router-link>
    </a-menu-item>
    <a-menu-item>
      <router-link  to="/home" style="text-align:right;color: #1890ff;
    text-decoration: underline;" @dblclick="()=>{}">返回项目列表</router-link>
    </a-menu-item>
  </a-menu>
  </a-dropdown>
</template>

<script>
    export default {
        name: "index",
      props:['menuList'],
      data(){
        let buryObj={
          action:'actionGetProjectInfo',
          user: this.$store.state.userId,
          eventType:'buttonClick',
          eventName:'getProjectInfo',
          pageName:'项目详情',
          pageArea:'All',
          terminal:'PC'
        };
        let buryObj2={
          action:'actionEditProjectInfoAtPageDetailTab',
          user: this.$store.state.userId,
          eventType:'buttonClick',
          eventName:'editProjectInfoAtPageDetailTab',
          pageName:'项目详情编辑',
          pageArea:'All',
          terminal:'PC'
        };
          return{
            buryObj
          }
      },
      computed:{
           projectName(){
             return this.$store.state.projectName;
           },
        path(){
             return this.$route.name;
        }
      },
      methods:{
          changeProject(name){
             this.$store.commit('setProjectName',name);
          }
      },
      mounted(){
          if(!this.$store.state.projectName){
            let projectId=this.$route.params.projectId;
            this.$ajax('bomextract/project/getprojectbyprojid','GET',{projectId:projectId}).then(res=>{
                res=res.data;
              if(res.code==='001'){
                this.$store.commit('setProjectName',res.data.projectName);
              }
            })
          }
      }
    }
</script>
<style scoped>
.top-menu span{
   display: inline-block;
  max-width:206px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1;
}
  .top-menu.ant-dropdown-menu{
    width:336px;
  }
  .top-name{
    display:flex;
  }
  .top-name span{
    max-width:154px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
