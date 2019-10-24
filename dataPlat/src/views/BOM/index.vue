<template>
<div class="container">
 <div class="container-item link">
    <div class="item-top">
      <span>楼栋号：</span>
      <a-select  style="width: 120px" @change="handleChange" v-model="buildingid" placeholder="请选择" >
          <a-select-option  v-for="item in  buildingNumArr" :value="item.val" :key='item.val' >{{item.label}}</a-select-option>
      </a-select>
    </div>
   <div>
   </div>
   <a-anchor @click="goBom">
     <a-anchor-link  :href="item"  v-for="item in dataList" :title="item" :key="item"  />
   </a-anchor>
      <span v-for="item in dataList" :id="item"></span>
 </div>
  <div class="container-item main-content">
      <bom-view v-bind="bomprops"></bom-view>
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
            bomprops:{},
            buildingNumArr:[],
            buildingid:''
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
          },
        goBom(e,link){
            e.preventDefault();
            this.bomprops={
              objType:link.title,
              buildingid:this.buildingid
            };
        },
        //获取构件类型
          getType(val){
            this.$ajax('bomextract/bom/getcmpttypebybuildid','GET',{buildingid:val}).then(res=>{
                    res=res.data;
                    if(res.code==='001'){
                        this.dataList=res.data;
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
                    arr.push({label:item.floorCode,val:item.floorId});
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
    padding-bottom: 0.33rem;
    padding-left:0.2rem;
  }
  .container-item{
    /*height:100%;*/
    background-color:#fff;
    margin-right:0.2rem;
    padding:0.24rem;
  }
  .link{
    width:2.3rem;
  }
  .main-content{
    flex:auto;
  }
</style>
