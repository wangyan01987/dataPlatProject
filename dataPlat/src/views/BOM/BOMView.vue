<template>
    <div class="bom-item-container">
        <div class="bom-item-top">
          楼层：<a-select defaultValue="1" style="width: 200px;margin-right:0.24rem;"  @change="handleChange">
              <a-select-option value="1">1</a-select-option>
            </a-select>
              版本号：<a-select defaultValue="1" style="width: 200px;margin-right:0.24rem;" >
                <a-select-option value="1">版本号</a-select-option>
              </a-select>
              <a-input-search placeholder="搜索"  @search="onSearch"  style="width:300px"/>

        </div>
       <div class="bom-item-body">
         <a-table :columns="columns" :dataSource="data" bordered>
           <template
             v-for="col in ['version', 'floor', 'prodId','addinfo']"
             :slot="col"
             slot-scope="text, record, index"
           >
             <div :key="col">
               <a-input
                 v-if="record.editable"
                 style="margin: -5px 0"
                 :value="text"
                 @change="e => handleChange(e.target.value, record.key, col)"
               />
               <template v-else
               >{{text}}</template
               >
             </div>
           </template>
           <template slot="operation" slot-scope="text, record, index">
             <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)"><a-icon type="save" style="font-size:16px;" /></a>
          <a-popconfirm title="确定取消?" @confirm="() => cancel(record.key)">
            <a><a-icon type="close-circle" style="font-size:16px;" /></a>
          </a-popconfirm>
        </span>
               <span v-else>
          <a @click="() => edit(record.key)"><a-icon type="edit" style="font-size:16px;" /></a>
                 <a > <a-icon type="copy"  @click="goDetail"/></a>
        </span>
             </div>
           </template>
         </a-table>
       </div>
      <a-drawer
        title="BOM详情"
        placement="right"
        :closable="false"
        @close="onClose"
        :visible="visible"
      >
       <bom-info></bom-info>
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
      width: '15%',
      scopedSlots: { customRender: 'prodId' },

    },
    {
      title: '备注',
      dataIndex: 'addinfo',
      width: '20%',
      scopedSlots: { customRender: 'addinfo' },

    },

    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  const data = [];
  for (let i = 1; i < 100; i++) {
    data.push({
      key: i.toString(),
      index: ` ${i}`,
      floor: 32,
      version: `版本 ${i}`,
    });
  }
  export default {
    components:{BomInfo},
    data() {
      this.cacheData = data.map(item => ({ ...item }));
      return {
        data,
        columns,
        visible:false
      };
    },
    props:['objType','buildNum'],
    watch:{
       'objType'(val){
         //更新数据
       },
      'buildNum'(val){
         //楼栋号更新的话，将objType清空
      }
    },
    methods: {
      onSearch(){

      },
      onClose(){
        //关闭
        this.visible = false;
      },
      goDetail(){
        this.visible=true;
      },
      handleChange(value, key, column) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.data = newData;
        }
      },
      edit(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.editable = true;
          this.data = newData;
        }
      },
      save(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          delete target.editable;
          this.data = newData;
          this.cacheData = newData.map(item => ({ ...item }));
        }
      },
      cancel(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
          delete target.editable;
          this.data = newData;
        }
      },
    },
  };
</script>

<style scoped>
  .bom-item-body{
    margin-top:0.16rem;
  }
</style>
