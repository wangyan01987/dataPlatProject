<template>
  <div class="box-container">
    <p style="text-align:right;" class="action-btn"><a-button  type="primary" @click="addMember">+邀请新成员</a-button></p>
    <a-table :columns="columns" :dataSource="dataSource" :rowKey='getKey' :pagination="pagination"  :locale="{emptyText: '暂无数据'}">
      <template slot-scope="record,text" slot="icon">
        <a-avatar :style="{color:'#fff',backgroundColor: setColor}">{text.name.toUpperCase().substring(0,1)}}</a-avatar>
      </template>
       <span slot="action" slot-scope="record,index" class="action" v-if="record.isEdit">
         <img :src="require('../../assets/images/shanchu@2x.png')"  alt="" @click="deleteMember($event,record.index,index)" />
       </span>
    </a-table>
    <info-form :dataflag="dataflag" ref="infoform"></info-form>
    <a-modal
      :destroyOnClose=true
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
  import  InfoForm from './infoForm';
  import ModalInfo from './modalInfo'
  export default {
    name: "index",
    components:{InfoForm,ModalInfo},
    data(){
      const columns = [
        { title: '', dataIndex: 'icon', key: 'icon',scopedSlots: { customRender: 'icon' }},
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '性别', dataIndex: 'gender', key: 'gender' },
        { title: '手机', dataIndex: 'phone', key: 'phone' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '公司', dataIndex: 'company', key: 'company' },
        { title: '职位', dataIndex: 'position', key: 'position' },
        { title: '操作', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' } },
      ];
      return{
        visible:false,
        dataSource:[],
        columns,
        pagination:{},
        dataflag:'000',
        loading:false,
        title:'邀请新成员',
        projectId:''
      }
    },
    methods:{
      //弹窗操作
      addMember(){
        this.visible=true;
      },
      cancel(){

      },
      //单体操作
      deleteMember(e,index){
        e.stopPropagation();
        this.$confirm({
          icon:'close-circle',
            title: '移除成员',
            content: '确认从当前项目中移除此成员吗',
          okText: '确认',
          cancelText: '取消',
          onOk:()=>{
            let dataSource=[...this.dataSource];
            this.dataSource=dataSource.filter(item=>item.index!==index);
            this.$message.success('删除成功！');
          }
        });
      },
      getKey(record){
        return record.index;
      },
      //加载信息
      fetch (projectId,num,size) {
        this.loading = true;
       this.$ajax('bomextract/buildmember/getmember','POST',{projectid:projectId,pageNum:num,pageSize:size}).then((res) => {
                     res=res.data;
               if(res.code==='001'){
                 const pagination = { ...this.pagination };
                 pagination.total = res.count;
                 pagination.pageSize=size;
                 this.loading = false;
                 this.dataSource = res.data;
                 this.pagination = pagination;

               }
        });
      },

    },
    computed:{
       setColor(){
         let colors=['#ecbc27','#ced182',' #f39798','#58b788','#f48e46','#5a91c9','#fb91bd','#5bbefc','#5ae0ca'];
         let key= Math.round(Math.random()*10);
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
    height: 5.77rem;
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
