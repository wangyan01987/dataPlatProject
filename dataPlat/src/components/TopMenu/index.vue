<template>
  <a-dropdown :trigger="['click']">
    <span class="ant-dropdown-link top-name" >
     {{projectName}} <i class="iconfont icondown-fill1-xs"></i>
    </span>
  <a-menu slot="overlay" >
    <a-menu-item v-for="item in menuList" :key="item.projectId" @click="changeProject(item.projectName)">
      <router-link :to='"/projectDetail/"+item.projectId+"/"+path' ><img :src="item.img"  style="width:30px;margin-right:10px;"/>
        <span >{{item.projectName}}</span></router-link>
    </a-menu-item>
  </a-menu>
  </a-dropdown>
</template>

<script>
    export default {
        name: "index",
      props:['menuList'],
      data(){
          return{
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
      }
    }
</script>
<style scoped>

</style>
