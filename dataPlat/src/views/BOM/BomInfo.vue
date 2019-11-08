<template>
  <div class="bom-item-container">
    <div class="bom-item-top">
      <span>产品编码：{{productNum}}</span>
     <span>产品编号：{{productId}}</span>
    </div>
    <div class="bom-item-body">
      <!--基础信息-->
      <div class="body-item">
           <p class="title">基础信息</p>
           <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="false" :rowKey="record => record.sizeId">
             <template
               v-for="col in ['length', 'width', 'height']"
               :slot="col"
               slot-scope="text, record, index"
             >
               <div :key="col">
                 <a-input-number :min="0" :max="Math.pow(10,6)-1"   :precision="0"

                                 v-if="record.editable" style="margin: -5px 0" :value="text" @change="value => handleChange(value, record.sizeId, col,'001')"
                 />
                 <template v-else>{{text?text:'---'}}</template>
               </div>
             </template>
             <template slot="operation" slot-scope="text, record, index">
               <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.sizeId,'001')"><i class="iconfont iconbaocun"></i></a>
            <a @click="cancel(record.sizeId,'001')"> <i class="iconfont iconjianqu"></i></a>
        </span><span v-else>
          <a @click="() => edit(record.sizeId,'001')"><i class="iconfont iconbianji"></i></a>
        </span>
               </div>
             </template>
           </a-table>
         </div>
      <!--统计信息-->
      <div class="body-item">
            <p class="title">统计信息</p>
          <a-table :columns="columnsStatics" :pagination="false" :dataSource="dataStatics" :rowKey='getKey'>

          </a-table>
          </div>
      <!--物料信息-->
      <div class="body-item">
        <p class="title">物料信息</p>
        <a-table :columns="columsSource" :pagination="false" :dataSource="dataSource" :rowKey="record=>{record.matlId}">
          <template slot="barGrade" slot-scope="text,record,index">
            <div >
              <a-select  v-show="record.matl1stName==='钢材类'"  width="80%"  @focus="handleChangeLevel(record)"   @change="value => handleChange(value, record.matlId, 'barGrade','002')"  v-if="record.editable" placeholder="请选择" :value="text">
                  <a-select-option  v-for="item in barGradeArr " :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
              <template v-else>{{text?text:'---'}}</template>
            </div>
          </template>
          <template slot="detailDrawing" slot-scope="text,record,index">
            <div >
              <img :src="`data:image/png;base64,${text}`" alt="图片" v-show="text" style="width:100px;">
              <span v-show="!text">---</span>
            </div>

          </template>
          <template slot="specification" slot-scope="text,record,index">
            <div >
              <a-select   @focus="handleChangeSize(record)"  v-if="record.editable" placeholder="请选择" :value="text"  @change="value => handleChange(value, record.matlId,'specification','002')">
                <a-select-option v-for="item in specificationArr" :key="item.specification" :value="item.specification">{{item.specification}}</a-select-option>
              </a-select>
              <template v-else>{{text?text:'---'}}</template>
            </div>
          </template>
          <template slot="length" slot-scope="text, record, index">
            {{text?text:'---'}}
          </template>
          <template slot="allweight" slot-scope="text, record, index">
            {{text?text:'---'}}{{record.allUnit}}
          </template>
          <template slot="amount" slot-scope="text, record, index">
            <div>
              <a-input-number :min="0"     v-show="record.matl1stName!=='混凝土类'"
                              :max="Math.pow(10,6)-0.01"
                              :precision="2"
                              v-if="record.editable"
                              style="margin: -5px 0"
                              :value="text"
                              @change="value => handleChange(value, record.matlId,'amount','002')"
              />
              <template v-else>{{text?text:'---'}}</template>{{record.unit}}
            </div>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.matlId,'002')"><i class="iconfont iconbaocun"></i></a>

          <a><i class="iconfont iconjianqu" @click="cancel(record.matlId,'002')"></i></a>

        </span>
              <span v-else>
          <a @click="() => edit(record.matlId,'002')"><i class="iconfont iconbianji"/></a>
        </span>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
  const columnsStatics=[

    {
      title: '序号',
      dataIndex: 'index',
      width: '10%',
      customRender:(text, record, index)=>`${index+1}`
    },
    {
      title: '类型',
      dataIndex: 'sizeId',
      width: '10%',
      customRender:(text, record, index)=>'整板信息'
    },
    {
      title: '整板面积（m²）',
      dataIndex: 'area',
      width: '10%',
    },
    {
      title: '整板体积(m³)',
      dataIndex: 'volume',
      width: '10%',

    },
    {
      title: '洞口面积(m²)',
      dataIndex: 'holeArea',
      width: '10%',

    },
    {
      title: '缺口体积(m³)',
      dataIndex: 'gapVolume',
      width: '10%',

    },
    {
      title: '整板净面积(m²)',
      dataIndex: 'actualArea',
      width: '10%',

    },
    {
      title: '整板净体积(m³)',
      dataIndex: 'actualVolume',
      width: '10%',
    },
  ];
  //尺寸信息
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '10%',
      customRender:(text, record, index)=>`${index+1}`
    },
    {
      title: '类型',
      dataIndex: 'sizeName',
      width: '15%',
    },
    {
      title: '长度(mm)',
      dataIndex: 'length',
      width: '15%',
      scopedSlots: { customRender: 'length' },
    },
    {
      title: '宽度(mm)',
      dataIndex: 'width',
      width: '15%',
      scopedSlots: { customRender: 'width' },

    },
    {
      title: '厚度(mm)',
      dataIndex: 'height',
      width: '20%',
      scopedSlots: { customRender: 'height' },

    },

    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];
   //物料信息
  const columsSource=[
    {
      title: '序号',
      dataIndex: 'index',
      width: '8%',
      customRender:(text, record, index)=>`${index+1}`
    },
    {
      title: '类型',
      dataIndex: 'matl1stName',
      width: '10%',
    },
    {
      title: '名称',
      dataIndex: 'matlName',
      width: '10%',
    },
    {
      title: '规格',
      dataIndex: 'specification',
      width: '17%',
      scopedSlots: { customRender: 'specification' },
    },
    {
      title: '强度等级',
      dataIndex: 'barGrade',
      width: '12%',
      scopedSlots: { customRender: 'barGrade' },
    },
    {
      title: '长度/面积(mm/m²)',
      dataIndex: 'length',
      width: '13%',
      scopedSlots: { customRender: 'length' },
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: '10%',
      scopedSlots: { customRender: 'amount' },
    },
    {
      title: '总量',
      dataIndex: 'allweight',
      width: '5%',
      scopedSlots: { customRender: 'allweight' },

    },
    {
      title: '图形',
      dataIndex: 'detailDrawing',
      scopedSlots: { customRender: 'detailDrawing' },
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      width: '5%',
    },
  ];
  const data = [];
  const typeMap={
    '混凝土类':'01',
    '钢材类':'02',
    '钢筋半成品类':'03',
    '水电预埋件类':'04',
    '预埋件类':'05',
    '保温材料类':'06',
    '装饰面类':'07',
    '混凝土配料类':'08'
  };
  export default {
    data() {

      const dataSource=[];
      return {
        data,
        columns,
        visible:false,
        loading:false,
        columnsStatics,
        dataStatics:[],
        dataSource,
        columsSource,
        barGradeArr:[],
        specificationArr:[],
        cacheData1:'',
        cacheData2:''
      };
    },
    props:['propmsg'],
    computed:{
      productNum(){
        return this.propmsg.prodCode;
      },
      productId(){
        return this.propmsg.prodId;
      },
      },
    methods: {
      onClose(){
        //关闭
        this.visible = false;
      },
      getKey(record){
        return record.index;
      },
      handleChange(value, key, column,flag) {
        if(flag==='001'){
          const newData = [...this.data];
          const target = newData.filter(item => key === item.sizeId)[0];
          if (target) {
            target[column] = value;
            this.data = newData;
          }
        }
          else if(flag==='002'){
          const newData = [...this.dataSource];
          const target = newData.filter(item => key === item.matlId)[0];
          if (target) {
            target[column] = value;
            this.dataSource = newData;
          }
        }

      },
      edit(key,flag) {
       if(flag==='001'){
         const newData = [...this.data];
         const target = newData.filter(item => key === item.sizeId)[0];
         if (target) {
           target.editable = true;
           this.data = newData;
         }
       }else if(flag=='002'){
         //修改物料信息
         const newData = [...this.dataSource];
         const target = newData.filter(item => key === item.matlId)[0];
         if (target) {
           target.editable = true;
           this.dataSource = newData;
         }
       }
      },
      save(key,flag) {
        if(flag==='001'){
          const newData = [...this.data];
          const target = newData.filter(item => key === item.sizeId)[0];
          if (target) {
            delete target.editable;
            this.data = newData;
            this.cacheData1 = newData.map(item => ({ ...item }));
            //保存尺寸信息
            let target1={...target};
            target1.cmptSizeId=target.sizeId;
            delete  target1.sizeId;
            delete target1.sizeName;
            delete target1.diameter;
            this.$ajax('bomextract/bom/modifycmptsize','POST',target1).then(res=>{
              res=res.data;
              if(res.code==='001'){
                this.$message.success('修改成功',2);
                //修改统计信息
                this.dataStatics=[res.data];
              }
              else{
                this.$message.error('修改失败',2);
              }
            })

          }
        }
        else if(flag==='002'){
          const newData = [...this.dataSource];
          const target = newData.filter(item => key === item.matlId)[0];
          if (target) {

            //保存物料信息
            let obj={
              materialId:target.matlId,
              amount:target.amount,
              specification:target.specification,
              barGrade:target.barGrade,
              length:target.length
            };
            this.$ajax('bomextract/bom/modifymaterial','POST',obj).then(res=>{
              res=res.data;
              if(res.code==='001'){
                this.$message.success('修改成功',2);
                if(res.data){
                    target.allweight=res.data;
                }
                delete target.editable;
                  this.dataSource = newData;
                this.cacheData2 = newData.map(item => ({ ...item }));
              }
              else{
                this.$message.error('修改失败',2);
              }
            })

          }
        }

      },
      handleChangeSize(record){
           //获取规格列表
              let obj={};

                obj.firsttype=record.matl1st;
                obj.matlname=record.matlName;
                this.$ajax('bomextract/bom/getspecifications','GET',obj).then(res=> {
                  res = res.data;
                  if(res.code==='001') {
                    this.specificationArr= res.data;
                  }
                })

      },
      handleChangeLevel(val){
             //获取钢筋强度列表
        this.$ajax('bomextract/bom/getbargrade','GET').then(res=>{
          res=res.data;
          if(res.code==='001'){
              this.barGradeArr=res.data;
          }
        })
      },
      cancel(key,flag) {
        if(flag==='001'){
          const newData = [...this.data];
          const target = newData.filter(item => key === item.sizeId)[0];
          if (target) {
            Object.assign(target, this.cacheData1.filter(item => key === item.sizeId)[0]);
            delete target.editable;
            this.data = newData;
          }
        }
        else if(flag==='002'){
          const newData = [...this.dataSource];
          const target = newData.filter(item => key === item.matlId)[0];
          if (target) {
            Object.assign(target, this.cacheData2.filter(item => key === item.matlId)[0]);
            delete target.editable;
            this.dataSource = newData;
          }
        }
      },
    },
    mounted() {
      //尺寸信息
      this.data = this.propmsg.sizeList;
      this.cacheData1 = this.data.map(item => ({...item}));
      //统计信息数组
      this.dataStatics = [this.propmsg];
      //物料信息
      this.dataSource = this.propmsg.bomList;
      this.cacheData2 = this.dataSource.map(item => ({...item}));
    }
  };
</script>

<style scoped>
  .bom-item-body{
    margin-top:0.16rem;
  }
  .bom-item-top{
    overflow: hidden;
  }
  .bom-item-top span{
     float:right;
    line-height: 0.2rem;
  }
  .title{
    color: rgba(0, 0, 0, 0.85);
    font-size:16px;
  }
  .body-item{
    padding-bottom: 32px;
  }
</style>
