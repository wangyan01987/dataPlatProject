<template>
<div class="container">
 <div class="container-item link">
    <div class="item-top">
      <span>楼栋号：</span>
      <a-select  style="width: 120px" @change="handleChange">
          <a-select-option value="001">#1</a-select-option>
      </a-select>
    </div>
   <a-anchor @click="goBom">
     <a-anchor-link  href="javascript:void(0)"  v-for="item in dataList" :title="item" :key="item" />
   </a-anchor>
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
            bomprops:{}
          }
      },
      methods:{
          handleChange(){

          },

        goBom(e,link){
            e.preventDefault();
            this.bomprops={
              objType:link.title
            }
        },
        //获取构件类型
          getType(){
            this.$ajax('bomextract/bom/getcmpttypebybuildid','POST',{buildingid:'2'}).then(res=>{

            })
          }
      },
      mounted(){

            // this.getType();
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
