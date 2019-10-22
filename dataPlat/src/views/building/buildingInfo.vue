<template>
  <a-form :form="form"
  >
    <a-form-item label="楼栋名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-input
        v-if="dataflag!=='000'"
        v-decorator="[ 'floorName', {rules: [{ max:20,message:'最大长度为20个字符' },{ required: true, message: '请输入楼栋名称' }]}
        ]"
      />
      <span v-else>{{buildingInfo.floorName}}</span>
    </a-form-item>
    <a-form-item label="楼栋号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-input v-if="dataflag!=='000'" v-decorator="['floorCode',
          {rules: [{ required: true, message: '请输入楼栋号' },{pattern:/^[\w]+$/,message:'楼栋号输入格式不正确'}]}
        ]"
        placeholder="请输入楼栋号"
      >
      </a-input>
      <span v-else>{{buildingInfo.floorCode}}</span>
    </a-form-item>
    <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="关联栋号">
      <span v-for="(item,index) in relationfloor1" v-if="dataflag!=='000'" >
        <a-input-number :min="0" :max="15"   :key="index"  v-model="item.val"  @focus="item.editable=true" @blur="item.editable=false"/>
        <a-icon type="close-circle" v-show="item.editable" @click="deleteInput(item.key)"/>
      </span>
      <span v-if="dataflag==='000'">{{buildingInfo.relationfloor}}</span>
      <a-icon type="plus-circle" @click="addAssociateNum" v-if="dataflag!=='000'" />
    </a-form-item>
    <a-form-item
      label="建筑层数"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol">
      <a-input-number :min="0" :max="15"  v-decorator="['floorNum']" v-if="dataflag!=='000' "/>
      <span v-else>{{buildingInfo.floorNum}}</span>
    </a-form-item>
    <a-form-item
      label="预制层数"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol">
      <a-input-number :min="0" :max="15"  v-decorator="[
          'preFloorNum'
        ]"  v-if="dataflag!=='000'"/>
      <span v-else>{{buildingInfo.preFloorNum}}</span>
    </a-form-item>
    <a-form-item
      label="抗震等级"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol">
      <a-select
        v-if="dataflag!=='000'"
        v-decorator="[
          'quakeGrade',
          {rules: []}
        ]"
        placeholder="请选择抗震等级"
        @change="handleSelectChange"
      >
        <a-select-option value="1">
          一级
        </a-select-option>
        <a-select-option value="2">
          二级
        </a-select-option>
        <a-select-option value="3">
          三级
        </a-select-option>
        <a-select-option value="4">
          四级
        </a-select-option>
      </a-select>
      <span v-else>{{buildingInfo.quakeGrade}}</span>
    </a-form-item>
    <a-form-item
      label="单层建筑面积"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol">
      <a-input-number  v-decorator="[ 'monolayerArea' ]" v-if="dataflag!=='000'" :min="0"/>
      <span v-else>{{buildingInfo.monolayerArea}}</span>
    </a-form-item>
    <a-form-item
      label="备注"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol">
      <a-textarea  v-decorator="[
          'remark',
          {rules: [{}]}
        ]" v-if="dataflag!=='000'"/>
      <span v-else>{{buildingInfo.remark}}</span>
    </a-form-item>
    <p>构建类型</p>
    <a-table :columns="columns" :dataSource="dataSource" :rowKey=getKey :pagination=false :locale="{emptyText:''}"  class="buildingTable">
      <template slot="floors" slot-scope="text, record, index">
        <div key="floors">
          <a-input
            v-if="dataflag!=='000'"
            style="margin: -5px 0; "
            :value="text"
            @change="e => handleChange(e.target.value, record.index,'floors')"
          />
          <template v-else>{{text}}</template>
        </div>
      </template>
      <template slot="cmpttypeId" slot-scope="text, record, index">
        <div key="cmpttypeId" >
          <a-select
            v-if="dataflag!=='000'"
            :value="text"
            style="margin: -5px 0"
            @change="value=> handleSelectChange(value,record.index,'cmpttypeId')"
            placeholder="请选择"
          >
            <a-select-option v-for="item in typeList" :value="item.typeId" :key="item.typeId">
              {{item.typeName}}
            </a-select-option>
          </a-select>
          <template v-else>{{text}}</template>
        </div>
      </template>
       <template slot="action" slot-scope="text,record" class="action" v-if="dataflag!=='000'">
         <a-popconfirm
           v-if="dataSource.length"
           title="确定删除？"
           cancelText="取消"
           okText="确定"
           okType="danger"
           @confirm="() => deleteBuilding(record.floors)">
           <a-icon slot="icon" type="question-circle-o" style="color: red" />
        <img :src="require('../../assets/images/shanchu@2x.png')" alt=""  style="width:14px;cursor:pointer;"/>
        </a-popconfirm>

       </template>
    </a-table>
     <div class="add-action" v-if="dataflag!=='000'">
      <span @click="addBuilding"><a-icon type="plus-circle" />添加</span>
     </div>
  </a-form>
</template>

<script>
  let count=0;
  export default {
    props:['dataflag','floorId'],
    data () {
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 12},
      };
      const columns = [
        { title: '序号', dataIndex: 'index', key: 'index',customRender:(text, record, index)=>`${index+1}` },
        { title: '楼层段', dataIndex: 'floors', key: 'floors',scopedSlots: { customRender: 'floors' } },
        { title: '构件类型', dataIndex: 'cmpttypeId', key: 'cmpttypeId',scopedSlots: { customRender: 'cmpttypeId' } },
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } },
      ];
      const dataSource = [
      ];
      return {
        buildingInfo:{},
        typeList:[],
        formLayout: 'horizontal',
        formItemLayout,
        form: this.$form.createForm(this),
        relationfloor1:[{}],
        columns,
        dataSource,
        isSubmit:false,
        projectId:""
      };
    },
    methods: {
      addAssociateNum(){
          this.relationfloor1.push({key:count++});
      },
      addBuilding(){
        let a=this.dataSource.length+1;
        let obj={index:a++
        };
        this.dataSource.push(obj)
      },
      deleteBuilding(key) {
        const dataSource = [...this.dataSource];
      this.dataSource=dataSource.filter(item=>item.floors!==key)
      },
      getKey(record) {
        return record.index;
      },
      deleteInput(key){
        this.relationfloor1=this.relationfloor1.filter(item=>{
          return  item.key!==key;
          });
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            this.isSubmit=true;
            let obj=Object.assign({},values);
              obj.projectId=this.$route.params.projectId;
              let data=JSON.parse(JSON.stringify(this.dataSource));
                let newArr=data.map(item=>{
                  delete item.index;
                  delete item.cmpttypeId;
                    return item;
                });
              obj.cmptType=newArr;
              var url = "";let msg;
              if(this.dataflag==='002'){
                msg='添加成功';
                url='bomextract/build/addmonomer'
              }else if(this.dataflag==='001'){
                msg='修改成功';
                url='bomextract/build/modifymonomer';
                obj.floorId=this.floorId;
                delete obj.projectId;
              };
              //关联楼栋
            obj.relationfloor=[];
                  this.relationfloor1.forEach(item=>{
                    obj.relationfloor.push(item.val);
                  });
                  let params=obj;
              this.$ajax(url,'POST',obj).then(res=>{
                res=res.data;
                if(res.code==='001'){
                  this.$message.success(msg,5);
                  this.$emit('success',true);
                  params.relationfloor=params.relationfloor.join('，');
                  this.$store.commit("setRecord",params);
                }else{
                  this.$message.error(res.msg);
                }
              })
          }
        });
      },
      handleSelectChange(value,index,column){
        const newData = [...this.dataSource];
        const  target= newData.filter(item=>item.index===index)[0];
        if(target){
          target[column]=value;
          this.dataSource=newData;

        }
      },
      handleChange(value, index, column) {
        const newData = [...this.dataSource];
         const  target= newData.filter(item=>item.index===index)[0];
               if(target){
                 target[column]=value;
                 this.dataSource=newData;
               }
      },
      //获取构件类型下拉框
       getBuildingType(){
        this.$ajax('bomextract/build/getcmpttypeidname','GET').then(res=>{
          res=res.data;
          if(res.code==='001'){
            this.typeList=res.data;

          }
        })
       },
      buildingDetails(record){
        // 单体详情
        let gradeMap=['一级','二级','三级','四级'];
        if(record.quakeGrade){
           record.quakeGrade=gradeMap[ record.quakeGrade-1];
        }
        if(record.relationfloor){
         let arr= record.relationfloor.split('，');
         let arr1=[];
           arr.forEach((item)=>{
             arr1.push({val:item});
           });
          this.relationfloor1=arr1;
        }
        this.buildingInfo={...record};
       setTimeout(()=>{
         let copyRecord={...record};
         delete copyRecord.floorId;
         delete copyRecord.cmptType;
         delete copyRecord.cmpTypeName;
         delete copyRecord.relationfloor;
         this.form.setFieldsValue(copyRecord);
       },300);
        this.dataSource=record.cmptType;
      },
    },
    mounted(){
      if(this.dataflag==='002'){
        this.dataSource=[];
        this.getBuildingType();
      }else if(this.dataflag==='001'){
        //编辑单体
        let record = this.$store.state.record;
        this.buildingDetails(record);
        this.getBuildingType();
      }else {
        //产看单体

        let record = this.$store.state.record;
        this.buildingDetails(record);
      }
    }
  };
</script>
<style scoped>
.add-action{
  width: 100%;
  height: 32px;
  line-height:32px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 4px;
  border: dashed 1px rgba(0, 0, 0, 0.15);
  margin-top:10px;
}
.add-action span{
  cursor:pointer;
}
  p.has-error{
    margin:0;
    text-align:center;
    color: #f5222d;
    line-height:0;
  }
</style>
