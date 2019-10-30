<template>
  <div class="box-container">
    <p style="text-align:right;" class="action-btn"><a-button  type="primary" @click="addMember">+邀请新成员</a-button></p>
    <a-table :columns="columns" :dataSource="dataSource" :rowKey='getKey' :pagination="pagination"  :locale="{emptyText: '暂无数据'}">
      <template slot-scope="text,record" slot="personImage">
        <a-avatar :style="{color:'#fff',backgroundColor: text}"><span v-if="record.userName">{{record.userName.substring(0,1)}}</span>
       <span v-else> ---</span>
        </a-avatar>
      </template>
          <template  v-for="item in arr"   slot-scope="text,record" :slot="item"  @click="handle(text)" style="cursor: pointer">
             <div :key="item">
               <span v-show="!text">---</span>
               <span v-show="text">{{text}}</span>
             </div>
          </template>
       <span slot="action" slot-scope="text,record,index" class="action" >
         <a> <i class="iconfont iconshanchu" @click="deleteMember($event,record.userId)" v-show="record.isDelete"/></a>
       </span>
    </a-table>
    <a-modal :destroyOnClose=true
      :title='title'
      v-model="visible"
      @cancel="cancel"
      :footer="null"
      width="460px"
    >
       <modal-info></modal-info>
    </a-modal>
  </div>
</template>
<script>
  import ModalInfo from './modalInfo'
  export default {
    name: "index",
    components:{ModalInfo},
    data(){
      const columns = [
        { title: '', dataIndex: 'personImage', key: 'personImage',scopedSlots: { customRender: 'personImage' }},
        { title: '姓名', dataIndex: 'userName', key: 'userName',scopedSlots: { customRender: 'userName' } },
        { title: '性别', dataIndex: 'gender', key: 'gender',scopedSlots: { customRender: 'gender' } },
        { title: '手机', dataIndex: 'phoneNumber', key: ',phoneNumber',scopedSlots: { customRender: 'phoneNumber' } },
        { title: '邮箱', dataIndex: 'email', key: 'email',scopedSlots: { customRender: 'email' } },
        { title: '公司', dataIndex: 'companyName', key: 'companyName',scopedSlots: { customRender: 'companyName' } },
        { title: '职位', dataIndex: 'position', key: 'position',scopedSlots: { customRender: 'position' } },
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } },
      ];
      return{
        visible:false,
        dataSource:[{}],
        columns,
        pagination:{},
        dataflag:'000',
        loading:false,
        title:'邀请新成员',
        projectId:'',
        arr:['userName','gender','phoneNumber','email','companyName','position']
      }
    },
    methods:{
      //弹窗操作
      addMember(){
        this.visible=true;
      },
      cancel(){

      },
      handle(val){

      },
      //单体操作
      deleteMember(e,userId){
        e.stopPropagation();
        this.$confirm({
          icon:'close-circle',
            title: '移除成员',
            content: '确认从当前项目中移除此成员吗',
          okText: '确认',
          cancelText: '取消',
          onOk:()=>{
            //删除
            this.$ajax('bomextract/buildmember/delbuildperson','POST',{userId:userId,projectId:this.projectId}).then(res=>{
              res=res.data;
              if(res.code==='001'){
                let dataSource=[...this.dataSource];
                this.dataSource=dataSource.filter(item=>item.userId!==userId);
                this.$message.success('删除成功！');
              }
              else{
                this.$message.error('删除失败');
              }
            });

          }
        });
      },
      getKey(record){
        return record.userId;
      },
      changePage(page, size){
        this.fetch( this.projectId,page,20)
      },
      //加载信息
      fetch (projectId,num,size) {
        this.loading = true;
       this.$ajax('bomextract/buildmember/getmember','POST',{projectId:projectId,pageNum:num,pageSize:size}).then((res) => {
                     res=res.data;
                     let mapset=['女','男'];
               if(res.code==='001'){
                 this.loading = false;
                 const pagination = { ...this.pagination };
                 pagination.total = res.count;
                 pagination.pageSize=size;
                 pagination.onChange=this.changePage;
                 this.dataSource = res.data;
                 this.dataSource.map(item=>{
                        item.gender=mapset[item['sex']-1];
                        return item;
                   });

                 this.pagination = pagination;
               }
        });
      },

    },
    watch:{
        '$route.params.projectId'(val){
           this.projectId=val;
           this.fetch(val,1,20);
        }
    },
    computed:{
       setColor(){
         let colors=['#ecbc27','#ced182',' #f39798','#58b788','#f48e46','#5a91c9','#fb91bd','#5bbefc','#5ae0ca'];
         let key= Math.floor(Math.random()*9);
         return colors[key];
       }
    },
    mounted(){
    this.projectId=this.$route.params.projectId;
      this.fetch( this.projectId,1,20);

    }
  }
</script>

<style scoped>
  .box-container{
    width: 82%;
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
  .userIcon{
    text-align:center;
    font-size: 14px;
   width:24px;
    height:24px;
    display:inline-block;
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
  }
</style>
