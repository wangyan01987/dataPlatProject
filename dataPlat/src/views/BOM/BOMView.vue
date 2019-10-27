<template>
    <div class="bom-item-container">
        <div class="bom-item-top">
          楼层：<a-select  style="width:20%;margin-right:0.24rem;"  @change="floorChange"  @focus="getOption" placeholder="请选择">
              <a-select-option v-for="item in floorArr" :value="item" :key="item">{{item}}</a-select-option>
            </a-select>
              版本号：<a-select placeholder="请选择版本号" style="width:20%;margin-right:0.24rem;" @focus="getVersion" @change="versionChange" >
                <a-select-option v-for="item in versionArr" :value="item" :key="item">{{item}}</a-select-option>
              </a-select>
              <a-input-search placeholder="请输入"  @search="onSearch"  style="width:25%" />
        </div>
       <div class="bom-item-body">
         <a-table :columns="columns" :dataSource="data" :loading="loading"  :rowKey='getKey' :pagination="pagination" :locale="{emptyText: '暂无数据'}">
           <template
             v-for="col in ['version', 'floor', 'prodId','remark']"
             :slot="col"
             slot-scope="text, record, index"
           >
             <div :key="col">
               <a-input
                 v-if="record.editable"
                 style="margin: -5px 0"
                 :value="text"
                 @change="e => handleChange(e.target.value, record.cmptId, col)"
               />
               <template v-else
               >{{text}}</template
               >
             </div>
           </template>
           <template slot="operation" slot-scope="text, record, index">
             <div class="editable-row-operations">
        <span v-if="record.editable">
             <a @click="() => save(record.cmptId)"><i class="iconfont iconsave"  /></a>
            <a><i class="iconfont iconcancel"  @click="cancel(record.cmptId)"/></a>
        </span>
               <span v-else>
                 <a @click="() => edit(record.cmptId)">
                   <i class="iconfont iconbianji"  /></a>
                 <a-popconfirm title="确定删除?" @confirm="() => deleteItem(record,record.cmptId)" okText="确定" cancelText="取消">
                       <a>  <i class="iconfont iconshanchu"   /></a>
                      <a-icon slot="icon" type="exclamation-circle" style="color: red" />
                 </a-popconfirm>
                 <a > <i class="iconfont iconxiangqing"  @click="goDetail(record)" /></a>
        </span>
             </div>
           </template>
         </a-table>
       </div>
      <a-drawer
        title="BOM详情"
        placement="right"
        :width="1300"
        @close="onClose"
        :visible="visible"
        :destroyOnClose="true"
        :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
      >
       <bom-info :propmsg="propmsg"></bom-info>
      </a-drawer>
    </div>
</template>

<script>
  import BomInfo from './BomInfo'
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '10%',
    customRender:(text, record, index)=>`${index+1}`
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: '15%',
      scopedSlots: { customRender: 'version' },
    },
    {
      title: '楼层',
      dataIndex: 'floor',
      width: '15%',
      scopedSlots: { customRender: 'floor' },
    },
    {
      title: '产品编号',
      dataIndex: 'prodId',
      width: '20%',
      scopedSlots: { customRender: 'prodId' },

    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '20%',
      scopedSlots: { customRender: 'remark' },

    },

    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  const data =[];
  export default {
    components:{BomInfo},
    data() {
      this.cacheData = data.map(item => ({ ...item }));
      return {
        data,
        columns,
        visible:false,
        loading:false,
        propmsg:'12345ddd',
        floorArr:[],
        versionArr:[],
        pagination:{},
        floor:'',
        version:'',
        prodid:'11'
      };
    },
    props:['objType','buildingid'],
    watch:{
      //构件类型
       'objType':{
         handler(val){
         //获取bom数据
        if(val){
          this.getBom(1,20);
        }
           },
         deep:true
       },
      'buildingid'(val,oldval){
         //楼栋号更新的话，并且构造类型有值
        if(oldval&&this.objType){
          this.getBom(1,20);
        }else{
          this.data=[];
        }
              }
    },
    computed:{
      bomprops(){
        let obj={
          cmptType:this.objType,
          buildingid:this.buildingid,
          };
          return obj;
      }
    },
    methods: {
      getKey(record){
           return  record.cmptId;
      },
      getVersion(){
        //获取版本号
        if(this.versionArr.length===0){}
        this.$ajax('bomextract/bom/getversiondict','POST',this.bomprops).then(res=>{
          res=res.data;
          if(res.code==='001'){
            this.versionArr=res.data;
          }
        })
      },
      getOption(){
         //获取楼层列表
        if(this.floorArr.length===0){
          this.$ajax('bomextract/bom/getfloordict','POST',this.bomprops).then(res=>{
            res=res.data;
            if(res.code==='001'){
              this.floorArr=res.data;
            }
          })
        }
      },
      floorChange(val){
           this.floor=val;
           this.getBom(1,20);
      },
      versionChange(val){
        this.version=val;
        this.getBom(1,20);
      },
      getBom(num,size){
        this.loading=true;
        this.data=[];
        size=20;
        let obj={};
        obj.pageNum=num;
        obj.pageSize=size;
        obj.buildingId=this.buildingid;
        obj.cmptType=this.objType;
        obj.version=this.version;
        obj.floor=this.floor;
        obj.prodid=this.prodid;
        this.$ajax('bomextract/bom/getbominfobypage','GET',obj).then(res=>{
          res=res.data;
          if(res.code==='001'||res.state=='success'){
            this.loading=false;
            const pagination = { ...this.pagination };
            pagination.total = res.count;
            pagination.pageSize=size;
            this.pagination=pagination;
            pagination.onChange=this.changePage;
            res.data.forEach(item=>{
              item.cmptBaseInfo.bomList=item.bomList;
              item.cmptBaseInfo.sizeList=item.sizeList;
              this.data.push(item.cmptBaseInfo);
            });
          }
        })
      },
      changePage(page,size){
         this.getBom(page,20);
      },
      deleteItem(record,key){
        //删除构件
        this.$ajax('bomextract/bom/deletecomponent','POST',{buildingId:this.buildingid,data:[record.cmptId]}).then(res=>{
          res=res.data;
          if(res.code==='001'){
               this.$message.success('删除成功',2);
               this.data.filter(item=>item.key!==key);
            let newData= this.data.filter(item=>item.key!==key);
            this.data=newData;
          }
          else{
            this.$message.error(res.msg);
          }
        });
      },
      onSearch(val){
        this.prodid=val;
         this.getBom(1,20);
      },
      onClose(){
        //关闭
        this.visible = false;
      },
      goDetail(record){
        this.propmsg=record;
        this.visible=true;
      },
      handleChange(value, key, column) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.cmptId)[0];
        if (target) {
          target[column] = value;
          this.data = newData;
        }
      },
      edit(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.cmptId)[0];
        if (target) {
          target.editable = true;
          this.data = newData;
        }
      },
     async save(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.cmptId)[0];
        const newtarget={...target};
        if (target) {
          let bomList=newtarget.bomList;
          let sizeList=newtarget.sizeList;
          delete target.editable;
          delete target.bomList;
          delete target.sizeList;
          let obj={cmptBaseInfo:target, bomList:bomList, sizeList:sizeList};
          this.data = newData;
          this.cacheData = newData.map(item => ({ ...item }));
           //服务器保存
          //没有校验编号唯一

          // let proFlag=  await  this.$ajax('bomextract/bom/proidexist','GET',{
          // }).then(res=>{
          //   res=res.data;
          //   if(res.code!=='001'){
          //     this.$message.error('产品编号已存在');
          //     return false;
          //   }
          // });
          if(true){
            this.$ajax('bomextract/bom/modifycmpt','POST',obj).then(res=>{
              res=res.data;
              if(res.code==='001'){
                this.$message.success('修改成功！',2);
              }
            });
          }
        }
      },
      cancel(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.cmptId)[0];
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.cmptId)[0]);
          delete target.editable;
          this.data = newData;
        }
      },
    },
    mounted(){

    }
  };
</script>

<style scoped>
  .bom-item-body{
    margin-top:0.16rem;
  }
  a i.iconfont{
    color:#999;
  }
  a i.iconfont:hover{
    color:#1890ff;
  }
  a i.iconshanchu:hover{
    color:red;
  }
</style>
