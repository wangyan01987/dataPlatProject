
<template>
<!-- 单体详情弹窗 -->
    <a-modal
      class="form-container"
      :title=title
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :destroyOnClose=true>
      <a class="blue"><span  @click="editInfo" v-if="dataflag==='000'" v-bury="buryObj">编辑</span></a>
      <template slot="footer" >
        <a-button type="default"  v-show="dataflag!=='000'" @click="handleCancel">取消</a-button>
        <a-button type="primary" v-show="dataflag!=='000'" @click="handleOk">确定</a-button>
      </template>

      <building-info :dataflag="dataflag" :floorId='floorId'  :editFlag="editFlag"   ref="building" @success='handleSuccess'></building-info>
    </a-modal>
</template>
<script>
  import BuildingInfo from './buildingInfo'
  export default {
    props:['dataflag','floorId'],
    components:{BuildingInfo},
    data() {
      let buryObj={
        action:'actionBuildingRowPopupEditBtn',
        user: this.$store.state.userId,
        eventType:'buttonClick',
        eventName:'BuildingRowPopupEditBtn',
        pageName:'项目详情单体弹窗',
        pageArea:'All',
        terminal:'PC'
      };
      return {
        visible: false,
        confirmLoading: false,
        buryObj,
        editFlag:'000'
      }
    },
    computed:{
       title(){
         switch(this.dataflag){
           case '000':return '单体详情';
           case '001':return '编辑单体信息';
           case '002':return '新增单体信息';
         }
       }
    },
    methods: {
      handleOk(e) {
    this.$refs.building.handleSubmit(e);


      },
      handleSuccess(){
           this.visible=false;
           this.$emit('subSuccess',true);
      },
      handleCancel(e) {
        this.visible = false
      },
      editInfo(){
        this.editFlag='001';
        this.$emit('edit');
      },
    }
  }
</script>
<style scoped>
  .form-container .ant-modal-content{
    position:relative;
  }
  .blue{
    cursor:pointer;
    color:dodgerblue;
    position:absolute;
    top:0;
    left:130px;
    line-height:54px;
  }
</style>
