<template>
    <a-modal
      :title=title
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :destroyOnClose=true>
      <template slot="footer" >
        <a-button type="default"  v-show="dataflag!=='000'" @click="handleCancel">取消</a-button>
        <a-button type="primary" v-show="dataflag!=='000'" @click="handleOk">确定</a-button>
      </template>
      <building-info :dataflag="dataflag" ref="building"></building-info>
    </a-modal>

</template>
<script>
  import BuildingInfo from './buildingInfo'
  export default {
    props:['dataflag'],
    components:{BuildingInfo},
    data() {
      return {
        visible: false,
        confirmLoading: false,

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
      showModal() {
        this.visible = true
      },
      handleOk(e) {
        this.$refs.building.handleSubmit(e);
      },
      handleCancel(e) {
        this.visible = false
      },
    }
  }
</script>
