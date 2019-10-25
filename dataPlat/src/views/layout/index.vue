<template>
<div class="main-container">
  <a-layout>
    <a-layout-header>
      <div class="top-header">
        <div><a href="#/home"><img :src='headerImg'  style="width:32px"></a>
          <a-icon   type="right"  v-show="$route.name!=='home'" />
          <top-menu :menuList="menuList" v-if="$route.params.projectId"></top-menu>
          <span v-else>{{topTitle}}</span>
        </div>
        <div>
          <a-input-search
          placeholder="请输入搜索内容"
          style="width: 268px"
          @search="onSearch"
        /></div>
        <div class="top-item">
          <img src="../../assets/images/xiaoxi@2x.png">
          <img src="../../assets/images/youxiang@2x.png">
          <img src="../../assets/images/help@2x.png">
          <a-dropdown>
      <a class="ant-dropdown-link" href="javascript:void(0)">
        <a-avatar :style="{color:'#fff',backgroundColor: iconColor}">{{userIcon}}</a-avatar>
      </a>
      <a-menu slot="overlay">
        <a-menu-item>
          <router-link to="/personSet">账户设置</router-link>
        </a-menu-item>
        <a-menu-item>
          <span  @click="logout">退出登录</span>
        </a-menu-item>
      </a-menu>
  </a-dropdown>

          <span class="userName">{{userName}}</span>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content><router-view></router-view></a-layout-content>
  </a-layout>
</div>
</template>

<script>
  import topMenu from '@/components/TopMenu';
    export default {
        name: "index",
      components:{topMenu},
      data(){
          return {

            colorArr:['#ecbc27','#ced182',' #f39798','#58b788','#f48e46','#5a91c9','#fb91bd','#5bbefc','#5ae0ca'],
          }
      },
      computed:{
        iconColor(){
                  let flag=Math.floor(Math.random()*9);
                  return this.colorArr[flag];
        },
          menuList(){
            return this.$store.state.menuList;
          },
            topTitle(){
              let a=this.$route.name;
              if(a==='personSet'){
               return '个人信息设置';
              }else{
               return '';
              }
            },
          userIcon(){
            return this.$store.state.userName.toUpperCase().substring(0,1);
          },
          userName(){
                 return this.$store.state.userName
          },
        headerImg(){
            if(this.$route.name=='home'){
              return require('../../assets/images/zhuye-hui@2x.png');
            }
            else{
               return  require('../../assets/images/zhuye@2x.png');
            }
        }
      },
      watch:{
          '$router':function(to,from){
           // console.log(to)
          }

      },
      mounted(){
        // 获取个人信息
        this.$ajax('bomextract/user/getpersoninfo','POST').then(res=>{
                res=res.data;
                if(res.code==='001'){
                  // 更新数据
                 // this.userName = res.data.userName;
                 this.$store.commit('setUserName',res.data.userName);
                }
                else{
                  this.$message.error(res.msg);
                }
          })
      },
      methods:{
          onSearch(){

          },
        logout(){
            this.$ajax('logout','POST').then(res=>{
              res=res.data;
              if(res.code==='999'){
                 this.$store.commit('setLogin',false);
                 //this.$message.success('退出登录');
                this.$router.push('/login');
                 }
            });
        }
      },
    }
</script>

<style scoped>
  .ant-layout-header{
    background-color: #ffffff;
    box-shadow: 0px 1px 0px 0px
    #eeeeee;
    padding:0 0.1rem;
  }
  .top-header{
    width:100%;
    height:100%;
    display:flex;
    justify-content: space-between;
    align-items:center;
  }
  .top-header img{
    margin-right:0.2rem;
    width:16px;
    cursor:pointer;
  }
  .top-item{
    padding-right:15px;
  }

</style>
