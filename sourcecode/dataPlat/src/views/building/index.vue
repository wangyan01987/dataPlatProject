<template>
   <div class="box-container">
     <p style="text-align:right;" class="action-btn"><a-button  type="primary" @click="addBuilding">+新建单体</a-button></p>
     <a-table :columns="columns" :dataSource="dataSource" :rowKey='getKey' :pagination="pagination" :customRow="click" :locale="{emptyText: '暂无数据'}"
     :loading="loading">
       <span slot="action" slot-scope="record,index" class="action">
         <img :src="require('../../assets/images/bianji@2x.png')" alt="" @click="editBuilding(record,$event,index)"/>
         <img :src="require('../../assets/images/shanchu@2x.png')" alt="" @click="deleteBuilding($event,record.index,index)" />
       </span>
     </a-table>
     <info-form :dataflag="dataflag" ref="infoform"></info-form>
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
          { title: '楼栋号', dataIndex: 'number', key: 'floorCode' },
          { title: '关联栋号', dataIndex: 'relationfloor', key: 'relationfloor' },
          { title: '建筑层数', dataIndex: 'floorNum', key: 'floorNum' },
          { title: '预制层数', dataIndex: 'preFloorNum', key: 'preFloorNum' },
          { title: '抗震等级', dataIndex: 'quakeGrade', key: 'quakeGrade' },
          { title: '单层建筑面积m²', dataIndex: 'monolayerArea', key: 'monolayerArea' },
          { title: '构建类型', dataIndex: 'cmpTypeName', key: 'cmpTypeName' },
          { title: '操作', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' } },
        ];
        const dataSource = [


        ];
          return{
            dataSource,
            columns,
            pagination:{},
            dataflag:'000',
            loading:false,
          }
      },
      methods:{
        deleteBuilding(e,index){
            e.stopPropagation();
          this.$confirm({
            title: '删除单体',
            icon:'close-circle',
            content: '确认删除此单体？一旦将单体删除，所有与此单体相关信息、文件将会被清除。',
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
              let dataSource=[...this.dataSource];
              this.dataSource=dataSource.filter(item=>item.index!==index);
              this.$message.success('删除成功！');
            }
          });
        },
        editBuilding(record,e){
          e.stopPropagation();
          this.$refs.infoform.visible=true;
          this.dataflag='001';
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
