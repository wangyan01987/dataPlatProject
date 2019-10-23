<template>
   <div class="box-container">
     <p style="text-align:right;" class="action-btn"><a-button  type="primary" @click="addBuilding">+新建单体</a-button></p>
     <a-table :columns="columns" :dataSource="dataSource" :rowKey='getKey' :pagination="pagination" :customRow="click" :locale="{emptyText: '暂无数据'}"
     :loading="loading" :current='current' style="cursor: pointer">
       <span slot="action" slot-scope="record,index" class="action">
         <img :src="require('../../assets/images/bianji@2x.png')" alt="" @click="editBuilding(record,$event,index)"/>
         <img :src="require('../../assets/images/shanchu@2x.png')" alt="" @click="deleteBuilding($event,record.floorId,index)" />
       </span>
     </a-table>
     <info-form :dataflag="dataflag"  :floorId='floorId'  ref="infoform" @subSuccess='handlesubmitSucc'></info-form>
   </div>
</template>

<script>
  import  InfoForm from './infoForm'
    export default {
        name: "index",
       components:{InfoForm},
      data(){
        const columns = [
          { title: '序号', dataIndex: 'index', key: 'index',customRender:(text, record, index)=>`${index+1}`},
          { title: '楼栋名称', dataIndex: 'floorName', key: 'floorName' },
          { title: '楼栋号', dataIndex: 'floorCode', key: 'floorCode' },
          { title: '关联栋号', dataIndex: 'relationfloor', key: 'relationfloor' },
          { title: '建筑层数', dataIndex: 'floorNum', key: 'floorNum' },
          { title: '预制层数', dataIndex: 'preFloorNum', key: 'preFloorNum' },
          { title: '抗震等级', dataIndex: 'quakeGrade', key: 'quakeGrade' },
          { title: '单层建筑面积m²', dataIndex: 'monolayerArea', key: 'monolayerArea' },
          { title: '构件类型', dataIndex: 'cmpTypeName', key: 'cmpTypeName' },
          { title: '操作', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' } },
        ];
        const dataSource = [];
          return{
            dataSource,
            columns,
            pagination:{},
            dataflag:'000',
            loading:false,
            floorId:'',
            current:1
          }
      },
      methods:{
        handlesubmitSucc(){
          if(this.dataflag==='002'){
           this.fetch(1,20);
          }
          else{
            let currentIndex=this.current;
            this.fetch(currentIndex,20);
          }

        },
        deleteBuilding(e,floorId,index){
            e.stopPropagation();
          this.$confirm({
            title: '删除单体',
            icon:'close-circle',
            content: '确认删除此单体？一旦将单体删除，所有与此单体相关信息、文件将会被清除。',
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
              this.$ajax('bomextract/build/delmonomer','GET',{'floorId':floorId}).then((res) => {
              res=res.data;
              if(res.code==='001'){
              let dataSource=[...this.dataSource];
              this.dataSource=dataSource.filter(item=>item.floorId!==floorId);

              this.$message.success('删除成功！');
              }
              else{
                this.$message.error(res.msg);
              }
          });

            }
          });
        },
        editBuilding(record,e,index){
          // 获取单体信息
          e.stopPropagation();
          this.$refs.infoform.visible=true;
          this.dataflag='001';
          this.floorId=record.floorId;
          this.$store.commit("setRecord", record)
        },
          addBuilding(){
   this.$refs.infoform.visible=true;
   this.dataflag='002';
          },
          getKey(record){
               return record.floorId
          },
        click(record,index){

          let self=this;
            return{
              props:{
                    style:'cursor:pointer'
              },
              on:{
                click(){
                  self.$refs.infoform.visible=true;
                  self.dataflag='000';
                  self.$store.commit("setRecord",record);
                }
              }
            }
        },
        fetch (num,size) {
            this.loading=true;
            let obj={
              projectId:this.projectId,
              "pageNum":num,
              "pageSize":size

            };
            this.$ajax('bomextract/build/getmonomer','POST',obj).then((res) => {
              res=res.data;
              if(res.code==='001'){
                const pagination = { ...this.pagination };
                pagination.total = res.count;
                pagination.pageSize=size;
                this.loading = false;
                let obj=res.data;
                   let obj1= obj.map(item=>{
                     item.relationfloor=item.relationfloor.join('，');
                     item.cmpTypeName=[];
                         item.cmptType.forEach(item1=>{
                          item.cmpTypeName.push( item1.component)
                         });
                         return item;
                    });
                this.dataSource = obj1;

                this.pagination = pagination;
              }

          });
        }
      },
      watch:{
          '$route.params'(val){
              if(val){
                this.projectId=val.projectId;
                this.fetch(1,20);
              }
          }
      },
      mounted(){
          this.projectId=this.$route.params.projectId;
          this.fetch(1,20);
      }
    }
</script>

<style scoped>
   .box-container{
     width: 82%;
     height: auto;
     background-color: #ffffff;
     border: solid 1px #d9d9d9;
     margin:0.2rem auto;
   }
  .action-btn{
    padding:0.2rem;
  }
  .action img{
    width:14px;
    cursor:pointer;
    margin-left:0.1rem;
  }
</style>
