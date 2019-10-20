<template>
  <a-dropdown>
    <a class="ant-dropdown-link" href="javascript:void(0)">
     {{projectName}} <a-icon type="down" />
    </a>
  <a-menu slot="overlay" >
    <a-menu-item v-for="item in menuList" :key="item.projectId" @click="changeProject(item.projectName)">
      <router-link :to='"/projectDetail/"+item.projectId' ><img :src="item.img"  style="width:30px;margin-right:10px;"/>
        <span >{{item.projectName}}</span></router-link>
    </a-menu-item>
  </a-menu>
  </a-dropdown>
</template>

<script>
    export default {
        name: "index",
      props:['menuList'],
      computed:{
           projectName(){
             return this.$store.state.projectName;
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
