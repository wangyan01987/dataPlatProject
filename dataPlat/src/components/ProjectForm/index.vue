<template>
  <div class="form-container">
    <!--查看-->
    <a-modal :destroyOnClose=true :title='title' v-model="visible" @cancel="cancel" :footer="null" :width="550">
      <span class="blue" @click="currentDataflag=1;editFlag='001'" v-if="currentDataflag===0" v-bury="buryObjedit">编辑信息</span>
     <projectinfo ref="projectInfo" :dataflag="currentDataflag"  :editFlag="editFlag" :projectId="propMsg.projectId" @cancel="cancel" @save="save"></projectinfo>
    </a-modal>
  </div>
</template>
<script>
  import projectinfo from './projectinfo.vue'
  export default {
    props:['propMsg'],
    components:{projectinfo},
    data() {
      let buryObjedit={
        action:'actionProjectDetailGetProjectDetailPopupsEditBtn',
        user: this.$store.state.userId,
        eventType:'buttonClick',
        eventName:'ProjectDetailGetProjectDetailPopupsEditBtn',
        pageName:'项目详情编辑',
        pageArea:'All',
        terminal:'PC'
      };
      return {
        visible: false,
        footer:null,
        currentDataflag:0,
        editFlag:'000',
        buryObjedit
      }
    },
    methods: {

      save() {
        this.visible = false;
        setTimeout(()=>{
          this.$parent.getItem(1,19,true);
        },500);
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
    left:130px;
    line-height:54px;
  }
</style>
