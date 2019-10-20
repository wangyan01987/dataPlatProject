<template>
<div class="main-container">
  <a-layout>
    <a-layout-header>
      <div class="top-header">
        <div><a href="#/home"><img :src='headerImg'  style="width:32px"></a><a-icon   type="right" />
          <top-menu :menuList="menuList" v-if="projectName"></top-menu>
          <span>{{topTitle}}</span>
        </div>
        <div>
          <a-input-search
          placeholder="请输入搜索内容"
          style="width: 268px"
          @search="onSearch"
        /></div>
        <div>
          <img src="../../assets/images/xiaoxi@2x.png">
          <img src="../../assets/images/youxiang@2x.png">
          <img src="../../assets/images/help@2x.png">
          <a-dropdown>
      <a class="ant-dropdown-link" href="javascript:void(0)">
        <span class="userIcon">{{userIcon}}</span>
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
          return{
            userName:'杨依',
            menuList:[{
              name:'1号项目',
              id:'001'
            },{
              name:'2号项目',
              id:'002'
            }],
            topTitle:''

          }
      },
      computed:{
          // menuList(){
          //   return this.$store.state.menuList;
          // },
          userIcon(){
            return this.userName.substring(0,1);
          },
        isInProject(){
             return this.$store.state.inProject;
        },
        projectName(){
            return this.$store.state.projectName;
        },
        headerImg(){
            if(this.$store.state.inProject){

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
      methods:{
          onSearch(){

          },
        logout(){
            this.$ajax('logout','POST').then(res=>{
              res=res.data;
              if(res.code==='001'){
                 this.$store.commit('setLogin',false);
                this.$router.push('/login')
                this.$message.success('退出登录');
                 }
              else{
                this.$message.error(res.msg);
              }
            });
        }
      },
      mounted(){
        let a=this.$route.name;
        if(a==='personSet'){
          this.topTitle='个人信息设置';
        }else{
          this.topTitle='';
        }
      }
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
  .userIcon{
    font-size:14px;
    padding:5px;
    background-color: #ecbc27;
    color:#fff;
    border-radius:50%;
    cursor:pointer;
  }

</style>
