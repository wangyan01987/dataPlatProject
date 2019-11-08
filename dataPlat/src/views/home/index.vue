<template>
  <div class="container">
   <p class="changeItem"></p>
    <a-spin size="large"  v-if="loaded"/>
    <div class="box">
          <div class="box-container">
            <div class="box-wrapper" v-for="item in itemList" @click="goToDetail(item.projectId,item.projectName,item.projectUserId)">
              <div class="box-item">
                <div class="item-img" >
                  <img   v-if="item.img"    :src="item.img" style="width:100%;height:100%;" />
                  <a-tooltip>
                    <template slot="title">
                      {{item.projectName}}
                    </template>
                    <p class="item-title" >{{item.projectName}}</p>
                  </a-tooltip>
                </div>
                <div class="editor-box">
                  <p class="editor" @click="$event.stopPropagation()" >
                    <a> <i class="iconfont iconbianji" @click="editItem(item.projectId,$event)"  v-bury="buryObj"/></a>
                    <a><i class="iconfont iconshanchu"  @click="deleteItem(item.projectId,$event)" v-show="item.isDelete" /></a>
                  </p>
                </div>
              </div>
            </div>
            <div class="box-wrapper">
              <div class="box-item ">
                <div class="add-item"  @click="addItem" >
                  <a-icon type="plus" class="icon"/>
                  <p style="margin-top:10px;font-size:14px;">创建新项目</p>
                </div>
              </div>
            </div>
          </div>
    </div>
    <div class="slide-item" @click='loadItem'>
      <p><i class="iconfont icongengduo" style="margin-right:14px"></i>加载更多</p>

    </div>
    <projectform ref="projectform" :propMsg="propMsg"></projectform>
  </div>
</template>

<script>
  import projectform from '@/components/ProjectForm'

    export default {
      name: "index",
      components:{projectform},
      data: function () {
        let count=2;
        let buryObj={
             action:'actionEditProjectAtListPage',
             user: this.$store.state.userId,
            eventType:'buttonClick',
           eventName:'editProjectAtListPage',
          pageName:'项目列表页编辑',
          terminal:'PC'
        };
        return {
          propMsg:{
            dataflag:0,
            projectId:'',
          },
          loaded:false,
          count,
          imgList:[{
            src:require('../../assets/projectImg/001.jpg')
          },{
            src:require('../../assets/projectImg/002.jpg')
          },
            {
              src:require('../../assets/projectImg/003.jpg')
            },{
              src:require('../../assets/projectImg/004.jpg')
            },
            {
              src:require('../../assets/projectImg/005.jpg')
            },
            {
              src:require('../../assets/projectImg/004.jpg')
            },
            ],
          itemList: [{img:'',projectName:''}],
          addItemList: [],
         buryObj
        }
      },
      methods: {
        goToDetail(id,name,userId){

          this.$router.push({name:'projectDetail',params:{projectId:id}});
           this.$store.commit('setProjectName',name);
           this.$store.commit('setprojectUserId',userId);

        },
        loadItem() {
          //获取新的数据
          this.getItem(this.count++).then(res=>{
            if(res.length!==0){
              this.addItemList= res;
              this.itemList=this.itemList.concat(this.addItemList);
            }
          });
        },
        editItem(id,e){
          //编辑信息 flag=1
          e.stopPropagation();
          this.propMsg={
            dataflag:1,
            projectId:id
          };
         this.$refs.projectform.visible=true;
        },
        deleteItem(id,e){
         e.stopPropagation();
         let self=this;

          this.$confirm({
            title: '确认删除此项目？',
            icon:'close-circle',
            content: '一旦将项目删除，所有与当前项目有关的信息、文件，以及项目成员组将会被清除。',
            okText: '确认',
            cancelText: '取消',
            onOk(){
                  //删除信息操作
              self.$ajax('bomextract/project/deleteproject','POST',{'projectId':id}).then(res=>{
                res=res.data;
                 if(res.code==='001'){
                    //itemList里删除
                  self.itemList= self.itemList.filter((item,index)=>{
                        return item.projectId!==id;
                   });
                   self.$message.success('删除成功', 5);
                 }else{
                   self.$message.success(res.msg)
                 }
              });
            },
            onCancel(){}
          });

        },
       async getItem(num,page,flag){
          page=19;
          this.loaded=true;
          let  storeList=[];
         await this.$ajax('bomextract/project/getprojectsbypage','POST',{"pageNum":num, "pageSize":page}).then(res=>{
            res=res.data;
            if(res.code==='001'){
              this.loaded=false;
              if(res.data.length!==0){
                storeList=res.data.map(item=>{
                 if(item.image){
                   item.img=this.imgList[item.image].src;
                 }
                  return item;
                });
                if(flag){
                  this.itemList=storeList;
                }
              }
              else{
                this.$message.info('没有更多数据了',5);
            }
            }
          });
           return storeList;
        },
        addItem(){
          //添加信息 flag=2
          this.propMsg.dataflag=2;
          this.$refs.projectform.visible=true;
        },
      },
      mounted() {
        //项目名称清零
        this.$store.commit('setProjectName',null);
        //获取项目列表
       this.getItem(1).then(res=>{
         this.itemList=res;
         let arr5=res.slice(0,5);
         this.$store.commit('setMenuList',arr5);
       });


      }
    }
</script>

<style scoped>
    .box-item{
     width:100%;
      height: 1.8rem;
      background-color: #fafafa;
      box-shadow: 0 2px 6px 0 #c8cacc;
      border-radius: 4px;
      position:relative;

    }
    .box-wrapper{
      width:20%;
      padding-right:20px;
      padding-bottom:20px;
      border-radius: 50%;
     }
  .item-title{
    border-radius:4px 4px 0 0;
    font-size:14px;
      width: 100%;
      height: 44px;
      letter-spacing: 0;
      color: #ffffff;
      position:absolute;
        top:0;
       overflow: hidden;
    text-overflow: ellipsis;
    text-align:left;
    padding:4px 14px 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  background-color:rgba(100,100,100,0.5);
    z-index:99;
  }
  .item-img{

      width:100%;
      height: 100%;
      background-color: rgba(229, 229, 229, 0.64);
      border-radius: 4px;
    position:relative;

  }
  .item-img img{
    border-radius: 4px;
  }
  .box{

  }
  .box-item:hover{
  cursor:pointer;
  }
  .editor-box{
    height:100%;
    width:100%;
    position:absolute;
    bottom: 0;
    background-color:transparent;
    opacity:0;
  }
  .editor{
    position:absolute;
    bottom: 0;
    height:0.4rem;
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding:0 16px;
    margin:0;
    transition:all 500ms ease-in-out;
    background-color:#fff;
    width:100%;
  }
  .editor-box:hover{
    opacity:1;
  }
  .editor img{
    width:14px;
    height:14px;
    cursor:pointer;
  }
  .box-item .add-item{
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    border-radius: 4px;
    padding-top:0.6rem;
    color: rgba(0, 0, 0, 0.45);
  }
  .add-item .icon{
    font-size:0.32rem;
  }
  .slide-item{
    position:fixed;
    bottom: 15px;
    color: rgba(0, 0, 0, 0.45);
    cursor:pointer;
    width:100%;
    font-size:14px;
  }
  .changeItem{
    text-align:right;
    margin-top:24px;
    margin-bottom: 80px;
    padding-right:0.24rem;
  }
  .changeItem img{
cursor:pointer;
    width:0.32rem;
  }
  .box-container{
    display:flex;
    flex-wrap: wrap;
    margin:0 auto;
    width:80%;
  }
</style>
