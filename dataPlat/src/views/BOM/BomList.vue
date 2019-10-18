<template>
    <div>
      <a-table :columns="columsSource" :pagination="false" :dataSource="data">
        <template slot="barGrade" slot-scope="text,record,index">
          <div >
            <a-select  style="width: 120px" @change="handleChange"  v-if="record.editable">
              <a-select-option value="1" v-for="item in barGradeArr" :key="item" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template slot="specification" slot-scope="text,record,index">
          <div >
            <a-select  style="width: 120px" @change="handleChange"  v-if="record.editable">
              <a-select-option value="1" v-for="item in specificationArr" :key="item" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template
          v-for="col in ['length', 'amount', 'allWeight']"
          :slot="col"
          slot-scope="text, record, index"
        >
          <div :key="col">
            <a-input-number :min="0"
                            v-if="record.editable"
                            style="margin: -5px 0"
                            :value="text"
                            @change="e => handleChange(e.target.value, record.key, col)"
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
</template>

<script>
  const columsSource=[
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
      title: '名称',
      dataIndex: 'matlName',
      width: '15%',
    },
    {
      title: '规格',
      dataIndex: 'specification',
      width: '20%',
      scopedSlots: { customRender: 'specification' },
    },
    {
      title: '强度等级',
      dataIndex: 'barGrade',
      width: '20%',
      scopedSlots: { customRender: 'barGrade' },
    },
    {
      title: '长度/面积',
      dataIndex: 'length',
      width: '15%',
      scopedSlots: { customRender: 'length' },
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: '15%',
      scopedSlots: { customRender: 'amount' },
    },
    {
      title: '总量',
      dataIndex: 'allWeight',
      width: '15%',
      scopedSlots: { customRender: 'allWeight' },
    },
    {
      title: '图形',
      dataIndex: 'detailDrawing',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];
    export default {
        name: "BomList",
      data() {
          const data=[];
        for (let i = 1; i < 5; i++) {
          data.push({
            key: i.toString(),
            matlName: '001',
            version: `版本 ${i}`,
          });
        }
        this.cacheData = data.map(item => ({ ...item }));
        return {
          visible:false,
          loading:false,
          propmsg:'',
          columsSource,
          data,
          specificationArr:[{label:1,value:1}],
          barGradeArr:[{label:1,value:1}]
        };
      },
      props:['productId','productNum'],
      methods: {

        onClose(){
          //关闭
          this.visible = false;
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
    }
</script>

<style scoped>

</style>
