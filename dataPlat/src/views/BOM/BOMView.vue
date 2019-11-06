<template>
    <div class="bom-item-container">
        <div class="bom-item-top">
          <span class="title">楼层：</span><a-select
          style="width:20%;margin-right:0.24rem;"  @change="floorChange"  @focus="getOption" placeholder="请选择楼层" v-model="floor">
              <a-select-option v-for="item in floorArr" :value="item" :key="item">{{item}}</a-select-option>
            </a-select>
          <span class="title"> 版本号：</span><a-select placeholder="请选择版本号" style="width:20%;margin-right:0.24rem;" @focus="getVersion" @change="versionChange" v-model="version">
                <a-select-option v-for="item in versionArr" :value="item" :key="item">{{item}}</a-select-option>
              </a-select>
              <a-input-search placeholder="请输入"  @search="onSearch"  style="width:25%" />
              <a-button type="primary" style="margin-left:57px" @click="updateBom">刷新BOM</a-button>
        </div>
       <div class="bom-item-body">
         <a-table :columns="columns" :dataSource="data" :loading="loading"  :rowKey='getKey' :pagination="pagination" :locale="{emptyText: '暂无数据'}" >
           <template
             v-for="col in ['version', 'floor', 'prodId','remark']"
             :slot="col"
             slot-scope="text, record, index"
           >
             <div :key="col">
             <div  v-if="record.editable"><a-input
                 style="margin: -5px 0"
                 :value="text"
                 :maxlength="getMax(col)"
                 @change="e => handleChange(e.target.value, record.cmptId, col,e.target,record)"
               /><p class="has-error"></p>
             </div>
               <template v-else
               >
                 <a-tooltip>
                   <template slot="title">
                     <span v-show="text">{{text}}</span>
                   </template>
                   <span >  {{text?text:'---'}}</span>
                 </a-tooltip>

               </template>
             </div>
           </template>
           <template slot="operation" slot-scope="text, record, index">
             <div class="editable-row-operations">
        <span v-if="record.editable">
             <a @click="() => save(record.cmptId,record)"><i class="iconfont iconbaocun"  /></a>
            <a><i class="iconfont iconjianqu"  @click="cancel(record.cmptId)"/></a>
        </span>
               <span v-else>
                 <a @click="() => edit(record.cmptId,record)">
                   <i class="iconfont iconbianji"  /></a>

                       <a>  <i class="iconfont iconshanchu"  @click=" deleteItem(record,record.cmptId)" /></a>

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
  import $ from 'jquery'
  const data =[];
  export default {
    components:{BomInfo},
    data() {
      const columns = [
        { title: '序号',
          dataIndex: 'index',
          width:'10%',
          customRender:(text, record, index)=>`${this.pagination.pageSize * (this.current - 1) + index + 1}`
        },
        {
          title: '产品编号',
          dataIndex:'prodId',
          width: '15%',
          scopedSlots: { customRender: 'prodId' },
        },
        {
          title: '产品编码',
          dataIndex: 'prodCode',
          width: '15%',
         // scopedSlots: { customRender: 'prodCode' },
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
      return {
        data,
        columns,
        visible:false,
        loading:false,
        propmsg:'12345ddd',
        floorArr:[],
        versionArr:[],
        pagination:{
          pageSize:1
        },
        floor:'',
        version:'',
        prodId:'',
        cacheData:'',
        current:1,
        maxlength:30
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
      },

    },
    methods: {
     getMax(column){
       switch (column){
         case 'prodId':return  11;
         case 'floor': return  31;
         case 'remark':return 150;
       };
     },
      updateBom(){
        this.prodId='';
        this.version='';
        this.floor='';
        this.getBom(1,20);
      },
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
        let obj={};
        obj.pageNum=num;
        obj.pageSize=size;
        obj.buildingId=this.buildingid;
        obj.cmptType=this.objType;
        obj.version=this.version;
        obj.floor=this.floor;
        obj.prodId=this.prodId;
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
           this.cacheData=this.data.map(item => ({ ...item }));
          }
        })
      },
      changePage(page,size){
        this.current=page;
         this.getBom(page,20);
      },
      deleteItem(record,key){
        //删除构件
        this.$confirm({
          icon:'close-circle',
          title: '删除构件',
          content: '确认删除构件',
          okText: '确认',
          cancelText: '取消',
          onOk:()=>{
            //删除
            this.$ajax('bomextract/bom/deletecomponent','POST',{buildingId:this.buildingid,data:[record.cmptId]}).then(res=>{
              res=res.data;
              if(res.code==='001'){
                this.$message.success('删除成功',2);
                this.data.filter(item=>item.cmptId!==key);
                let newData= this.data.filter(item=>item.cmptId!==key);
                this.data=newData;
              }
              else{
                this.$message.error(res.msg);
              }
            });
          }
        });

      },
      onSearch(val){
        this.prodId=val;
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
      getDom(target1,msg){
        target1.style.border='1px solid red';
        target1.parentNode.nextSibling.style.display='block';
        $(target1).parent().siblings('.has-error').text(msg);
        $(target1).parents('td').css('padding-bottom',0);
      },
     async handleChange(value, key, column,target1,record) {
        record.save=true;
        //为空判断
       if(column!=='remark') {
         if(value.length===0){
           this.getDom(target1, '输入不能为空');
           record.save=false;
          }else  if ( column==='version') {
           if (value&&!/^[A-Z]$/.test(value)) {
             this.getDom(target1, '版本号输入格式不正确');
             record.save = false;
           }
           else {
             target1.style.border = '1px solid #d9d9d9';
             $(target1).parents('td').css('padding-bottom', 16);
             target1.parentNode.nextSibling.style.display = 'none';
             record.save = true;
           }
         }else if(column==='floor'){
           if(!/^[1-9]+[\-]?[0-9]*$/.test(value)){
             this.getDom(target1, '楼层输入格式不正确');
             record.save = false;
           }
           else{
             target1.style.border = '1px solid #d9d9d9';
             $(target1).parents('td').css('padding-bottom', 16);
             target1.parentNode.nextSibling.style.display = 'none';
             record.save = true;
           }
         }
          else{
            target1.style.border='1px solid #d9d9d9';
            $(target1).parents('td').css('padding-bottom',16);
            target1.parentNode.nextSibling.style.display='none';
            record.save=true;
          }
        };
       //格式判断

         const newData = [...this.data];
         const target = newData.filter(item => key === item.cmptId)[0];
         if (target) {
           target[column] = value;
           this.data = newData;
         }
      },
      edit(key,record) {
        record.save=true;
        const newData = [...this.data];
        const target = newData.filter(item => key === item.cmptId)[0];

        if (target) {
          target.editable = true;
          this.data = newData;
        }
      },
     async save(key,record) {
       if(!record.save){
         return;
       }
        const newData = [...this.data];
        const target = newData.filter(item => key === item.cmptId)[0];
        const newtarget={...target};
        if (target) {
          let bomList=newtarget.bomList;
          let sizeList=newtarget.sizeList;
           delete newtarget.editable;
          delete newtarget.bomList;
          delete newtarget.sizeList;
          let obj={cmptBaseInfo:newtarget, bomList:bomList, sizeList:sizeList};
          //服务器保存
          //没有校验编号唯一
          let proFlag= await  new Promise((resolve,reject)=>{
            this.$ajax('bomextract/bom/proidexist','GET',{buildingid:this.buildingid, floor:record.floor ,proId: record.prodId,cmptId:record.cmptId
            }).then(res=>{
              res=res.data;
              if(res.code==='001'){
                if(res.data==='true'){
                  this.$message.error('产品编号已存在');
                  resolve(false)
                }else{
                  resolve(true);
                }
              }else{
                reject();
              }
            });
          });
          if(proFlag){
            this.$ajax('bomextract/bom/modifycmpt','POST',obj).then(res=>{
              res=res.data;
              if(res.code==='001'){
                this.data = newData;
                delete target.editable;
                this.cacheData = newData.map(item => ({ ...item }));
                this.$message.success('修改成功！',2);
              }
              else{
                this.$message.error(res.msg);
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
      //监听esc事件
      let self=this;
      if(navigator.userAgent.indexOf("MSIE")>0)  {

        document.onkeydown=function(){
          if(27 == event.keyCode){
           self.visible=false;
          }
        }  }

        else{
        window.onkeydown=function(){
          if(27 == event.keyCode){
        self.onClose();
          }

        }  }

    }

  };
</script>

<style scoped>
  .bom-item-body{
    margin-top:0.16rem;
    flex:auto;
  }
  .bom-item-container{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title{
    font-weight:bold;
    font-size:14px;
  }


</style>
