<template>
  <a-dropdown>
    <a class="ant-dropdown-link" href="javascript:void(0)">
     {{projectName}}  <a-icon type="down" />
    </a>
  <a-menu slot="overlay" >
    <a-menu-item v-for="item in menuList" :key="item.id">
      <router-link :to='"/projectDetail/"+item.id'>{{item.name}}</router-link>
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
      }
    }
</script>
<style scoped>

</style>
