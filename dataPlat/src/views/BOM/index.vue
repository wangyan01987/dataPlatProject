<template>
<div class="container">
 <div class="container-item link">
    <div class="item-top">
      <span>楼栋号：</span>
      <a-select  style="width: 120px" @change="handleChange" v-model="buildingid" placceholder="请选择">
          <a-select-option  v-for="item in  buildingNumArr" :value="item" :key='item' >{{item}}</a-select-option>
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
            dataList:['叠合楼板','分户墙'],
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
            console.log(this.buildingid)
            this.getType(val);
          },

        goBom(e,link){
            e.preventDefault();
            this.bomprops={
              objType:link.title,
              buildingid:this.buildingid
            }
        },
        //获取构件类型
          getType(val){
            this.$ajax('bomextract/bom/getcmpttypebybuildid','POST',{buildingid:val}).then(res=>{
                    res=res.data;
                    if(res.code==='001'){
                        this.dataList=res.data;
                    }
               })
          },
        //获取楼栋号
        getBuildingNum(){
              let  obj={
                  projectId: this.projectId,
                  "pageNum":1,
                  "pageSize":20
                };
          this.$ajax('bomextract/build/getmonomer','POST',obj).then((res) => {
            res=res.data;
            if(res.code==='001'){
                let arr=[];
                 res.data.forEach(item=>{
                    arr.push(item.floorCode);
                 });
                 this.buildingNumArr=arr;

            }

          });
        }
      },
      mounted(){
             //获取项目单体楼栋号
             this.getBuildingNum();

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
