<template>
  <div class="container">
   <p class="changeItem"><img src="../../assets/images/zhanshi@2x.png" alt=""><img src="../../assets/images/suolue@2x.png" alt=""></p>
    <a-spin size="large"  v-if="loaded"/>
    <div class="box">
          <div class="box-wrapper" v-for="item in itemList" @click="goToDetail(item.projectId,item.projectName)">
           <div class="box-item">
             <div class="item-img" >
               <img :src="item.img" style="width:100%;height:100%;"/>
               <p class="item-title" :title="item.projectName">{{item.projectName}}</p>
             </div>
             <p class="editor" >
               <img src="../../assets/images/bianji@2x.png" alt="编辑" @click="editItem(item.projectId,$event)">
               <img src="../../assets/images/shanchu@2x.png" alt="删除" @click="deleteItem(item.projectId,$event)" v-show="item.isDelete">
             </p>
           </div>
         </div>
          <div class="box-wrapper">
         <div class="box-item ">
           <div class="add-item"  @click="addItem" >
             <a-icon type="plus" class="icon"/>
             <p>创建新项目</p>
           </div>
           <p class="editor"></p>
         </div>
       </div>
    </div>
    <div class="slide-item" @click='loadItem'>
      <p>加载更多</p>
      <p><a-icon type="down" /></p>
    </div>
    <projectform ref="projectform" :propMsg="propMsg"></projectform>
  </div>
</template>

<script>
  import projectform from '@/components/ProjectForm'
  let count=1;
    export default {
      name: "index",
      components:{projectform},
      data: function () {
        return {
          propMsg:{
            dataflag:0,
            projectId:''
          },
          loaded:false,
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
            }
            ],
          itemList: [],
          addItemList: []
        }
      },
      watch:{
        // 'itemList'(newval,oldval){
        //      if(newval.length<oldval.length){
        //
        //      }
        // }

      },
      methods: {
        goToDetail(id,name){
          this.$router.push({name:'projectDetail',params:{projectId:id}});
           this.$store.commit('setProjectName',name);
        },
        loadItem() {
          //获取新的数据
          this.getItem(count++).then(res=>{
            this.addItemList= res. map(this.randomImg);
            this.itemList=this.itemList.concat(this.addItemList);
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
            title: '删除项目',
            content: '确认删除此项目？',
            okText: '确认',
            cancelText: '取消',
            okButtonProps: {
              props: {type:'danger'},
            },
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
            onCancel(){

            }
          });

        },
       async getItem(num,page){
          page=19;
          this.loaded=true;
          let  storeList=[];
         await this.$ajax('bomextract/project/getprojectsbypage','POST',{"pageNum":num, "pageSize":page}).then(res=>{
            res=res.data;
            if(res.code==='001'){
              this.loaded=false;
              if(res.data.length!==0){
                storeList=res.data.map(this.randomImg);
              }
              else{
                this.$message.loading('没有更多数据了',1);
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
        randomImg(item){
            //产生随机数
            let key= Math.floor(Math.random()*5);
            item.img=this.imgList[key].src;
            return item;

        }
      },
      mounted() {
        //项目名称清零
        this.$store.commit('setProjectName',null);
        //获取项目列表
       this.getItem(1).then(res=>{
         this.itemList=res;
         let arr5=res.slice(0,4);
         this.$store.commit('setMenuList',arr5);
       });

        //滑动加载
        var that = this;
        window.addEventListener("scroll", function () {
          if (document.body.scrollHeight <= window.screen.height + document.body.scrollTop) {
          //  that.loadItem();
          }
          else{

          }
        })

      }
    }
</script>

<style scoped>
    .box-item{
     width:100%;
      height: 1.8rem;
      background-color: #fafafa;
      box-shadow: 0 2px 6px 0
      #c8cacc;
      border-radius: 4px;

    }
    .box-wrapper{
      width:2.2rem;
      padding-right:20px;
      padding-bottom:20px;
     }
  .item-title{

      width: 100%;
      height: 48px;
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

  }
  .item-img{

      width:100%;
      height: 1.4rem;
      background-color: rgba(229, 229, 229, 0.64);
      border-radius: 4px;
    position:relative;

  }
  .box{
    padding:0 1.3rem;
    display:flex;
    flex-wrap: wrap;
  }
  .box-item:hover{
  cursor:pointer;
  }
  .editor{
    height:0.4rem;
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding:0 16px;
    opacity:0;
    transition:all 500ms ease-in-out;
  }
  .editor:hover{
    opacity:1;
  }
  .editor img{
    width:14px;
    height:14px;
    cursor:pointer;
  }
  .box-item .add-item{
    width: 100%;
    height: 1.4rem;
    background-color: #ebebeb;
    border-radius: 4px;
    padding-top:0.3rem;
  }
  .add-item .icon{
    font-size:0.32rem;
  }
  .slide-item{
    position:fixed;
    bottom: 0;
    color:dodgerblue;
    cursor:pointer;
    width:100%;
  }
  .changeItem{
    text-align:right;
    margin-top:24px;
    margin-bottom: 24px;
    padding-right:0.24rem;
  }
  .changeItem img{
cursor:pointer;
    width:0.32rem;
  }
</style>
