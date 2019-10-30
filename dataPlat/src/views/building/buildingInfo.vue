<template>
  <a-form :form="form"
  >
    <a-form-item label="楼栋名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-input
        maxlength="21"
        v-if="dataflag!=='000'"
        v-decorator="[ 'floorName', {rules: [{ max:20,message:'最大长度为20个字符' }],validateTrigger:['blur']}
        ]"
      />
      <span v-else>{{buildingInfo.floorName}}</span>
    </a-form-item>
    <a-form-item label="楼栋号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-input v-if="dataflag!=='000'"  maxlength="16"
               v-decorator="['floorCode',
          {rules: [{ required: true, message: '请输入楼栋号' },{pattern:/^[\w]+$/,message:'楼栋号输入格式不正确'},
            {validator:assignFloor}],validateTrigger:['blur'],
          }
        ]"
        placeholder="请输入楼栋号">
      </a-input>
      <span v-else>{{buildingInfo.floorCode}}</span>
    </a-form-item>
    <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="关联栋号">
      <a-row :gutter="16">
        <a-col :span="12" v-for="(item,index) in relationfloor1" :key="item.key" v-if="dataflag!=='000'" >
          <a-form-item>
            <a-input-number :min="1"  :max="Math.pow(10,15)-1"     style="width:90px"
                            v-decorator="[`relationfloor[${item.key}]`,
          {rules: [ {validator:assignReFloor}],validateTrigger:['blur'],
          }
        ]"/>
            <a-icon type="minus-circle" @click="deleteInput(item.key)" style="margin-left:1px;"/>
          </a-form-item>
        </a-col>
      </a-row>
      <span v-if="dataflag==='000'" :title="buildingInfo.relationfloor">{{buildingInfo.relationfloor}}</span>
      <span @click="addAssociateNum" v-if="dataflag!=='000'" class="add-item">+添加</span>
    </a-form-item>
    <a-form-item
      label="建筑层数"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      :validate-status="floornumber.validateStatus"
      :help="floornumber.errorMsg">
      <a-input-number  @change="e=>handleNumberChange(e,'001')" v-decorator="['floorNum',]" v-if="dataflag!=='000' "/>
      <span v-else>{{buildingInfo.floorNum}}</span>
    </a-form-item>
    <a-form-item
      label="预制层数"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      :validate-status="prenumber.validateStatus"
      :help="prenumber.errorMsg"
    >
      <a-input-number :min="0"   v-decorator="[
          'preFloorNum'
        ]"  v-if="dataflag!=='000'"  @change="e=>handleNumberChange(e,'002')"/>
      <span v-else>{{buildingInfo.preFloorNum}}</span>
    </a-form-item>
    <a-form-item
      label="抗震等级"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol">
      <a-select
        v-if="dataflag!=='000'"
        v-decorator="['quakeGrade']"
        placeholder="请选择抗震等级"
        @change="handleSelectChange"
      >
        <a-select-option :value=1>
          一级
        </a-select-option>
        <a-select-option :value=2>
          二级
        </a-select-option>
        <a-select-option :value=3>
          三级
        </a-select-option>
        <a-select-option :value=4>
          四级
        </a-select-option>
      </a-select>
      <span v-else>{{buildingInfo.quakeGradeName}}</span>
    </a-form-item>
    <a-form-item
      label="单层建筑面积"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      :validate-status="number.validateStatus"
      :help="number.errorMsg"
    >
     <div v-if="dataflag!=='000'">
       <a-input-number v-decorator="[ 'monolayerArea' ]" :min="0.01" :step="0.01"  @change="e=>handleNumberChange(e,'003')"  :formatter='limitDecimals'
       />m²</div>
      <span v-else>{{buildingInfo.monolayerArea}}m²</span>
    </a-form-item>
    <a-form-item
      label="备注"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol">
      <a-textarea  v-decorator="[
          'remark',{rules: [{max:399,message:'最大长度为400'}]}
        ]" v-if="dataflag!=='000'" :maxLength='400'/>
      <span v-else>{{buildingInfo.remark}}</span>
    </a-form-item>
    <p>构件类型</p>
    <a-table :columns="columns" :dataSource="dataSource" :rowKey=getKey :pagination=false :locale="{emptyText:''}"  class="buildingTable">
      <template slot="floors" slot-scope="text, record, index">
        <div key="floors">
           <div class="test-floor"  v-if="dataflag!=='000'">
             <a-input
               maxlength="11"
               style="margin: -5px 0; "
               :value="text"
               placeholder="示例1-3,请输入数字和下划线（长度不超过10位）"
               @change="e => handleChange(e.target.value, record.id,'floors',e.target)"/><p class="has-error">输入格式错误</p>
           </div>
          <template v-else>{{text}}</template>
        </div>
      </template>
      <template slot="cmpttypeId" slot-scope="text, record, index">
        <div key="cmpttypeId" >
          <a-select
            v-if="dataflag!=='000'"
            :value="text"
            style="margin: -5px 0"
            @change="value=> handleSelectChange(value,record.id,'cmpttypeId')"
            placeholder="请选择"
          >
            <a-select-option v-for="item in typeList" :value="item.typeId" :key="item.typeId">
              {{item.typeName}}
            </a-select-option>
          </a-select>
          <template v-else>{{record.component}}</template>
        </div>
      </template>
       <template slot="action" slot-scope="text,record" class="action" v-if="dataflag!=='000'">
         <a-popconfirm
           v-if="dataSource.length"
           title="确定删除？"
           cancelText="取消"
           okText="确定"
           okType="danger"
           @confirm="() => deleteBuilding(record.id)">
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

  function validatePrimeNumber(number) {

     if(typeof number==='number'){
       if (number<=Math.pow(10,15)-1) {
         return {
           validateStatus: 'success',
           errorMsg: null,
         };
       }else{
         return {
           validateStatus: 'error',
           errorMsg: '最大为15位数字',
         };
       }
     }
  }
  export default {
    props:['dataflag','floorId'],
    data () {
      let count=0;
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
      let projectId=this.$route.params.projectId;
      return {
        buildingInfo:{},
        typeList:[],
        formLayout: 'horizontal',
        formItemLayout,
        form: this.$form.createForm(this),
        relationfloor1:[],
        columns,
        dataSource,
        isSubmit:false,
        projectId,
        count,
        number:{

        },
        floornumber:{

        },
        prenumber:{

        }
      };
    },
    methods: {
      assignReFloor(rule,value,callback){
        //判断输入是否重复
        let arr=this.form.getFieldValue('relationfloor');
         let arr1=arr.filter(item=>{
           return item.length>0;
         });
        if(arr1.length>1){
          arr1=arr1.filter(item=>{
            return item.length!==0;
          });
          let singleArr=[...arr1];
          singleArr.pop();
        console.log(singleArr)
          if(singleArr.indexOf(value)!==-1){
            callback('该单体号已存在')
          }else if(value.toString().length>10){
            callback('最大为10位数字')
          }
        }
        else{
          callback();
        }


      },
      limitDecimals(value){
        const reg = /^(\-)*(\d+)\.(\d\d).*$/;
        if(typeof value === 'string') {
          return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
        } else if (typeof value === 'number') {
          return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
        } else {
          return ''
        }
      },
      handleNumberChange(value,flag) {

       if(flag==='003'){
         this.number = {
           ...validatePrimeNumber(value),
           value,
         };

        if(value&&value.toString().length>15){
          return;
        }
       }
       else if(flag==='001'){
         this.floornumber = {
           ...validatePrimeNumber(value),
           value,
         };
       }
       else{
         this.prenumber = {
           ...validatePrimeNumber(value),
           value,
         };
       }
      },
      addAssociateNum(){
         if(this.count<=30){
           this.relationfloor1.push({key:this.count++});
         }else{
           this.$message.error('已超过添加上限30');
           return;
         }
      },
      assignFloor(rule,value,callback){
            if(!value){
             callback();
            }
            else if(!/^[\w]+$/.test(value)){
              callback()
            }
            else if(value.length>15){
              callback('最大字符长度为15')
            }
            else{
              //新建单体
                if(this.dataflag==='002'){
                  this.$ajax('bomextract/build/buildnumexist','GET',{projectId:this.projectId,buildNum:value}).then(res=>{
                    res=res.data;
                    if(res.code==='001'){
                      if(res.data){
                        callback('楼栋号已存在，请重新输入');
                      }
                      else{
                        callback()
                      }
                    }
                    else{
                      callback()
                    }

                  })
                }else{
                  callback();
                }
            }
      },
      addBuilding(){
        let a=this.dataSource.length+1;
        let obj={id:a++};
        this.dataSource.push(obj)
      },
      deleteBuilding(key) {
        const dataSource = [...this.dataSource];
      this.dataSource=dataSource.filter(item=>item.id!==key)
      },
      getKey(record) {
        return record.id;
      },
      deleteInput(key){
        this.count--;
        this.relationfloor1=this.relationfloor1.filter(item=>{
          return  item.key!==key;
        });
      },
      handleCancel(){

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
                  delete item.component;
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
            obj.relationfloor=obj.relationfloor.filter(item=>{
             return item.length!==0;
            });
            //obj.relationfloor=[];
                  // this.relationfloor1.forEach((item,index)=>{
                  //   obj.relationfloor.push(item.val);
                  // });
                  let params=obj;
              this.$ajax(url,'POST',obj).then(res=>{
                res=res.data;
                if(res.code==='001'){
                  this.$message.success(msg,5);
                  this.$emit('success',true);
                  params.relationfloor=params.relationfloor.join('、');
                  this.$store.commit("setRecord",params);
                }else{
                  this.$message.error(res.msg);
                }
              })
          }
        });
      },
      handleSelectChange(value,key,column){
        const newData = [...this.dataSource];
        const  target= newData.filter(item=>item.id===key)[0];
        if(target){
          target[column]=value;
          this.dataSource=newData;

        }
      },
      handleChange(value, key, column,target1) {
        let str=/^[\d\-]{0,10}$/;
        if(!str.test(value)){
            target1.style.border='solid 1px red';
          target1.parentElement.nextSibling.style.display='block';
            return;
        }
        target1.parentElement.nextSibling.style.display='none';
          target1.style.borderColor='#d9d9d9';
        const newData = [...this.dataSource];
         const  target= newData.filter(item=>item.id===key)[0];
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
        let arr;
        if(record.relationfloor){
          arr= record.relationfloor.split('、');
         let arr1=[];
           arr.forEach((item,index)=>{
             arr1.push({val:item,key:index});
           });
          this.count=arr.length;
          this.relationfloor1=arr1;
        }
        this.buildingInfo={...record};
        for(let item in this.buildingInfo){
             if(!this.buildingInfo[item]){
               this.buildingInfo[item]='---';
             }
        };
        let copyRecord={
          relationfloor:arr,
          floorName:record.floorName,
          floorCode:record.floorCode,
          floorNum:record.floorNum,
          preFloorNum:record.preFloorNum,
          quakeGrade:record.quakeGrade,
          monolayerArea:record.monolayerArea,
          remark:record.remark
          };
        if(this.dataflag==='001'){
          setTimeout(()=>{
            this.form.setFieldsValue(copyRecord);
          },500);
        };

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
        //查看单体
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
    text-align:center;
    color: #f5222d;
    line-height:0;
    margin-top:11px;
    display:none;
    margin-bottom: 0;
  }
  .add-item{
    cursor: pointer;
    text-align:center;
    display:block;
    border:1px dashed #999;
    line-height:30px;
    width:60px;
  }
</style>
