<template>
  <div class="bom-item-container">
    <div class="bom-item-top">
      <span>产品编码：{{productNum}}</span>
     <span>产品编号：{{productId}}</span>

    </div>
    <div class="bom-item-body">
         <div class="body-item">
           <p class="title">基础信息</p>
           <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="false">
             <template
               v-for="col in ['length', 'width', 'height']"
               :slot="col"
               slot-scope="text, record, index"
             >
               <div :key="col">
                 <a-input-number :min="0"
                                 v-if="record.editable"
                                 style="margin: -5px 0"
                                 :value="text"
                                 @change="value => handleChange(value, record.key, col)"
                 />
                 <template v-else>{{text}}</template>
               </div>
             </template>
             <template slot="operation" slot-scope="text, record, index">
               <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)"><img :src="require('@/assets/images/baocun@2x.png')"alt="" style="width:14px"></a>
          <a-popconfirm title="确定取消?" @confirm="() => cancel(record.key)">
            <a><img :src="require('@/assets/images/jianqu@2x.png')"alt="" style="width:14px"></a>
          </a-popconfirm>
        </span>
                 <span v-else>
          <a @click="() => edit(record.key)"><img :src="require('@/assets/images/bianji@2x.png')"alt="" style="width:14px"></a>
        </span>
               </div>
             </template>
           </a-table>
         </div>
          <div class="body-item">
            <p class="title">统计信息</p>
          <a-table :columns="columnsStatics" :pagination="false" :dataSource="dataStatics">

          </a-table>
          </div>
      <div class="body-item">
        <p class="title">物料信息</p>
        <bom-list></bom-list>
      </div>
    </div>
  </div>
</template>

<script>
  import BomList from './BomList'
  const columnsStatics=[
    {
      title: '序号',
      dataIndex: 'index',
      width: '10%',
      customRender:(text, record, index)=>`${index+1}`
    },
    {
      title: '类型',
      dataIndex: 'version',
      width: '15%',
    },
    {
      title: '整版面积（m²）',
      dataIndex: 'length',
      width: '15%',
    },
    {
      title: '宽度',
      dataIndex: 'width',
      width: '15%',
      scopedSlots: { customRender: 'width' },

    },
    {
      title: '厚度',
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

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '10%',
      customRender:(text, record, index)=>`${index+1}`
    },
    {
      title: '类型',
      dataIndex: 'version',
      width: '15%',
    },
    {
      title: '长度',
      dataIndex: 'length',
      width: '15%',
      scopedSlots: { customRender: 'length' },
    },
    {
      title: '宽度',
      dataIndex: 'width',
      width: '15%',
      scopedSlots: { customRender: 'width' },

    },
    {
      title: '厚度',
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

  const data = [];
  for (let i = 1; i < 5; i++) {
    data.push({
      key: i.toString(),
      floor: 32,
      version: `版本 ${i}`,
    });
  }
  export default {
    components:{BomList},
    data() {
      this.cacheData = data.map(item => ({ ...item }));
      return {
        data,
        columns,
        visible:false,
        loading:false,
        propmsg:'',
        columnsStatics,
        dataStatics:[{key:'1'}]
      };
    },
    props:['productId','productNum'],
    methods: {

      onClose(){
        //关闭
        this.visible = false;
      },

      handleChange(value, key, column) {
        console.log(key)
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
          this.$message.success('保存成功',2);
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
