<template>
   <div class="box-container">
     <p style="text-align:right;" class="action-btn"><a-button  type="primary" @click="addBuilding" icon="plus">新建单体</a-button></p>
     <a-table :columns="columns" :dataSource="dataSource" :rowKey='getKey' :pagination="pagination" :customRow="click" :locale="{emptyText: '暂无数据'}"
     :loading="loading" :current='current' style="cursor: pointer">

       <template v-for="item in ['floorCode','floorName','relationfloor','floorNum','preFloorNum','quakeGradeName','monolayerArea','cmpTypeNameJoin']" :slot="item" slot-scope="text,record">

          <a-tooltip>
            <template slot="title">
              <span v-show="text">{{text}}</span>
            </template>
            <span v-show="text">{{text}}</span>
            <span v-show="!text">---</span>
          </a-tooltip>

       </template>
       <span slot="action" slot-scope="record,index" class="action" @click="$event.stopPropagation()" style="cursor:default">
         <a style="margin-right:30px"> <i class="iconfont iconbianji" @click="editBuilding(record,$event,index)" /></a>
         <a><i class="iconfont iconshanchu"  @click="deleteBuilding($event,record.floorId,index)"  /></a>
       </span>
     </a-table>

     <info-form :dataflag="dataflag"  :floorId='floorId'  ref="infoform" @subSuccess='handlesubmitSucc' @edit='lookEditBuilding'></info-form>

   </div>
</template>

<script>
  import  InfoForm from './infoForm'
    export default {
        name: "index",
       components:{InfoForm},
      data(){
        const columns = [
          { title: '序号', dataIndex: 'index', key: 'index',customRender:(text, record, index)=>`${this.pagination.pageSize*(this.current-1)+index+1}`},
          { title: '楼栋名称', dataIndex: 'floorName', key: 'floorName',scopedSlots: { customRender: 'floorName' },width:'15% '},
          { title: '建筑层数', dataIndex: 'floorNum', key: 'floorNum',scopedSlots: { customRender: 'floorNum',width:'10% ' } },
          { title: '预制层数', dataIndex: 'preFloorNum', key: 'preFloorNum',scopedSlots: { customRender: 'preFloorNum' },width:'10% ' },
          { title: '抗震等级', dataIndex: 'quakeGradeName', key: 'quakeGradeName',scopedSlots: { customRender: 'quakeGradeName' },width:'10%' },
          { title: '单层建筑面积m²', dataIndex: 'monolayerArea', key: 'monolayerArea',scopedSlots: { customRender: 'monolayerArea' },width:'12%' },
          { title: '构件类型', dataIndex: 'cmpTypeNameJoin', key: 'cmpTypeNameJoin',scopedSlots: { customRender: 'cmpTypeNameJoin' },width:'20%' },
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
            title: '确认删除此单体？',
            icon:'close-circle',
            content: '一旦将单体删除，所有与此单体相关信息、文件将会被清除。',
            okText: '确认',
            cancelText: '取消',
            okButtonProps:{},
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
        lookEditBuilding(){

          this.$refs.infoform.visible=true;
          this.dataflag='001';
          this.floorId=this.$store.state.record.floorId;
          this.$store.commit("setRecord", this.$store.state.record)
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
        changePage(page,size){
          this.current=page;
           this.fetch(page,20)
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
                pagination.onChange=this.changePage;
                this.loading = false;
                let gradeMap=['一级','二级','三级','四级'];
                let obj=res.data;
                   let obj1= obj.map(item=>{
                      item.quakeGradeName= gradeMap[item.quakeGrade-1];
                    // item.relationfloor=item.relationfloor.join('、');
                     item.cmpTypeName=[];
                         item.cmptType.forEach(item1=>{
                          item.cmpTypeName.push( item1.component);
                         });
                     item.cmpTypeNameJoin=[...new Set(item.cmpTypeName)].join('、');
                         return item;
                    });
                this.dataSource=obj1;
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
