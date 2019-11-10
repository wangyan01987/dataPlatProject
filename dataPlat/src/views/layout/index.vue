<template>
<div class="main-container">
  <a-layout>
    <a-layout-header>
      <div class="top-header">
        <div style="margin-left:28px;" class="top-header-left">
           <a href="#/home"  >
             <i class="iconfont icondaqwwwqziyuan" style='font-size:24px;'  v-if="$route.name==='home'"></i>
               <a-tooltip v-else>
                 <template slot="title">
                 返回首页
                 </template>
                 <img :src="headerImg"   style="width:24px" @mouseover="showhome=true" @mouseout="showhome=false"/>
               </a-tooltip>
          </a>
          <i class="iconfont iconarr-right1" v-show="$route.name!=='home'" style="color: #999"></i>
          <top-menu :menuList="menuList" v-if="$route.params.projectId"></top-menu>
          <span v-else  class="top-name">{{topTitle}}</span>
        </div>
        <div class="top-item">
          <a  style="margin-right: 10px;text-decoration: none"
              href="javascript:void(0)" download="客户端软件" @click="downFile($event,1,$event.target)" @dblclick="downFile($event,2,$event.target)">客户端下载</a>
          <!--<img src="../../assets/images/zengjia.png" >-->
          <!--<img src="../../assets/images/xiaoxi@2x.png">-->
          <!--<img src="../../assets/images/youxiang@2x.png">-->
          <!--<img src="../../assets/images/help@2x.png">-->
          <a-dropdown :trigger="['click']" id="#icon-menu">
      <a-menu slot="overlay" >
        <a-menu-item>
          <router-link to="/personSet">账户设置</router-link>
        </a-menu-item>
        <a-menu-item>
          <span  @click="logout">退出登录</span>
        </a-menu-item>
      </a-menu>
            <a class="ant-dropdown-link" href="javascript:void(0)">
              <a-avatar :style="{color:'#fff',backgroundColor: iconColor}">{{userIcon}}</a-avatar>
            </a>
            </a-dropdown>
          <span class="userName">{{userName}}</span>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</div>
</template>
<script>
  import topMenu from '@/components/TopMenu';
  let timer;
    export default {
        name: "index",
      components:{topMenu},
      data(){
          return {
            env:process.env.Base_URL,
            colorArr:['#ecbc27','#ced182',' #f39798','#58b788','#f48e46','#5a91c9','#fb91bd','#5bbefc','#5ae0ca'],
            iconColor:'',
            showhome:false,
            homeImg:"require('../../assets/images/zhuye-hui@2x.png')"
          }
      },
      computed:{
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
            if(this.$store.state.userName){
              return this.$store.state.userName.toUpperCase().substring(0,1);
            }
            else{
              return '-';
            }

          },
          userName(){
                 return this.$store.state.userName
          },
        headerImg(){
            if(this.showhome){
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
                   if(res.data.personImage){
                     this.iconColor=res.data.personImage;
                   }
                   else{
                     let flag=Math.floor(Math.random()*9);
                           this.iconColor= this.colorArr[flag];
                   }
                 this.$store.commit('setUserName',res.data.userName);
                   this.$store.commit('setUserId',res.data.userId);
                }
                else{
                  this.$message.error(res.msg);
                }
          })
      },
      methods:{
          onSearch(){

          },
        downFile(e,flag,alink){

         //   e.preventDefault();
          //客户端下载
          if(flag===1){
            clearTimeout(timer);
           timer=setTimeout(()=>{

              alink.download = '客户端下载';
              alink.href =`${this.env}/bomextract/bom/download?code=khd1`;
            },500)
          }else{
            clearTimeout(timer);

            alink.download = '客户端下载';
            alink.href =`${this.env}/bomextract/bom/download?code=khd1`;
          }

        },
        logout(){
          this.$store.commit('setLogin',false);
            this.$ajax('logout','POST').then(res=>{
              res=res.data;

              if(res.code==='999'){
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
    font-size:14px;
    justify-content: space-between;
    align-items:center;
  }
  .top-header img{
    margin-right:10px;
    width:16px;
  }
  .top-item{
    padding-right:15px;
  }
  .top-header-left{
    display:flex;
    /*line-height:15px;*/
    vertical-align: center;
  }



</style>
