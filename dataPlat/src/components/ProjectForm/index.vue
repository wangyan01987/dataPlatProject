<template>
  <div class="form-container">
    <!--查看-->
    <a-modal :destroyOnClose=true :title='title' v-model="visible" @cancel="cancel" :footer="null">
      <span class="blue" @click="currentDataflag=1" v-if="currentDataflag===0">编辑信息</span>
     <projectinfo ref="projectInfo" :dataflag="currentDataflag" :projectId="propMsg.projectId" @cancel="cancel" @save="save"></projectinfo>
    </a-modal>
    <br />
  </div>
</template>
<script>
  import projectinfo from './projectinfo.vue'
  export default {
    props:['propMsg'],
    components:{projectinfo},
    data() {
      return {
        visible: false,
        footer:null,
        currentDataflag:0
      }
    },
    methods: {

      save() {
        this.visible = false;
        setTimeout(()=>{
          this.$parent.getItem(1);
        },5);
      },
      cancel(){
            this.visible=false;
      },
    },
    computed:{
        title(){
          //查看0，编辑1，新增2，删除3
          switch (this.currentDataflag){
            case 0: return '查看项目信息';
            case 1:return '编辑项目信息';
            case 2:return '新建项目信息';
          }
        },


    },
    watch:{
         'propMsg.dataflag'(val){
             this.currentDataflag=val;
         }
    },
    mounted(){
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
    left:1.3rem;
    line-height:54px;
  }
</style>
