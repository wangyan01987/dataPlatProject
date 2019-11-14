<template>
<div class="container">
 <div class="container-item link">
    <div class="item-top">
      <span class="title">楼栋名称：</span>
      <a-select  style="width: 120px" @change="handleChange" v-model="buildingid" placeholder="请选择"  defaultValue="请选择" >
          <a-select-option  v-for="item in  buildingNumArr" :value="item.val" :key='item.val' >{{item.label}}</a-select-option>
      </a-select>
    </div>
   <div>
   </div>
   <a-anchor @click="goBom" class="anchor-box">
     <a-anchor-link  :id="'anchor'+index" :href="item"  v-for="(item,index) in dataList" :title="item" :key="item"  :class="{'ant-anchor-link-active':index===0 }

"/>
   </a-anchor>
      <span v-for="item in dataList" :id="item"></span>
 </div>
  <div class="container-item main-content">
      <bom-view :objType="objType" :buildingid="buildingid" ref="bomView"></bom-view>
  </div>
</div>
</template>
<script>
  import BomView from './BOMView'
    export default {
        name: "index",
      components:{BomView},
      data(){
          return{
            dataList:[],
            buildingNumArr:[],
            buildingid:'',
            objType:'',
          }
      },
      computed:{
           projectId(){
             return this.$route.params.projectId;
           }
      },
      methods:{
          handleChange(val){
            //获取构件类型列表
            this.getType(val);
            this.objType=null;

          },
        goBom(e,link){
            e.preventDefault();
            if(this.objType===link.title){
              this.$refs.bomView.updateBom();
            }else{
              this.objType=link.title;
            }
        },
        //获取构件类型
          getType(val){
            this.$ajax('bomextract/bom/getcmpttypebybuildid','GET',{buildingid:val}).then(res=>{
                    res=res.data;
                    if(res.code==='001'){
                        this.dataList=res.data;
                         if(res.data.length>0){
                           this.objType=res.data[0];
                           this.$nextTick(function () {
                             document.getElementById('anchor0').previousSibling.lastChild.style.cssText='top:10.5px;display:inline-block';
                           })
                         }
                    }
               })
          },
        //获取楼栋号
        getBuildingNum(num,size){
              let  obj={
                  projectId: this.projectId,
                  "pageNum":num,
                  "pageSize":size
                };
          this.$ajax('bomextract/build/getmonomer','POST',obj).then((res) => {
            res=res.data;
            if(res.code==='001'){
                let arr=[];
                 res.data.forEach(item=>{
                    arr.push({label:item.floorName,val:item.floorId});
                 });
                 this.buildingNumArr=arr;
            }

          });
        }
      },
      watch:{
        '$route.params'(val){
          if(val){
            this.getBuildingNum(1,20);
          }
        }
      },
      mounted(){
             //获取项目单体楼栋号
             this.getBuildingNum(1,20);

      }
    }
</script>

<style scoped>
  .container{
    display:flex;
    width:100%;
    flex:auto;
    padding-top:0.2rem;
    padding-bottom: 0.2rem;
    padding-left:0.2rem;
    background-color:#F2F3F5;
  }
  .container-item{
    /*height:100%;*/
    background-color:#fff;
    margin-right:0.2rem;
    padding:0.2rem;
  }
  .link{
    width:2.4rem;
  }
  .main-content{
    flex:auto;
  }
  .title{
    font-weight:bold;
    font-size:14px;
  }
  .anchor-box{
    margin-top:24px;
  }

</style>
