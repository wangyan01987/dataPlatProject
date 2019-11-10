<template>
  <a-form :form="form"
  >
    <a-form-item
      :class="{'ant-form-item-with-help':errorMsg}"
      label="楼栋名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" :hideRequiredMark="dataflag==='000'" >
      <div    v-if="dataflag!=='000'">
        <a-input
          maxlength="20"
          placeholder="请输入楼栋名称"

          v-decorator="[ 'floorName', {rules:
         [{required:true,message:'请输入楼栋名称'}, {validator:assignFloor}],validateTrigger:['blur']}
        ]"
        />
        <p class="has-error" v-show="errorMsg">{{errorMsg}}</p>
      </div>
      <span v-else>{{buildingInfo.floorName}}</span>
    </a-form-item>
    <a-form-item
      label="建筑层数"

      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      :validate-status="floornumber.validateStatus"
      :help="floornumber.errorMsg">
      <a-input @change="handleNumberChange"
      maxlength="15"
               style="width:150px;"
        placeholder="请输入建筑层数"
        v-if="dataflag!=='000'"
        v-decorator="[ 'floorNum', {rules:
         [{pattern:/^[1-9][0-9]{0,14}$/,message:'建筑层数输入格式为1-15位数字'}],validateTrigger:['blur']}
        ]"/>
      <span v-else>{{buildingInfo.floorNum}}</span>
    </a-form-item>
    <a-form-item
      label="预制层数"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      :validate-status="prenumber.validateStatus"
      :help="prenumber.errorMsg"
    >
      <a-input @change="handleNumberChange"
        maxlength="15"
               style="width:150px;"
        placeholder="请输入预制层数"
        v-if="dataflag!=='000'"
        v-decorator="[ 'preFloorNum', {rules:
         [{pattern:/^[1-9][0-9]{0,14}$/,message:'预制层数输入格式为1-15位数字'}],validateTrigger:['blur']}
        ]"/>
      <span v-else>{{buildingInfo.preFloorNum}}</span>
    </a-form-item>
    <a-form-item
      label="抗震等级"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol">
      <a-select
        style="width:150px;"
        v-if="dataflag!=='000'"
        v-decorator="['quakeGrade']"
         :allowClear="true"
        placeholder="请选择抗震等级"
        @change="handleSelectChangeLevel"
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
       <a-input @change="e=>handleNumberChange(e,'003')"  :formatter='limitDecimals'

       maxlength="15"
                style="width:150px;"
        placeholder="单层建筑面积"
        v-if="dataflag!=='000'"
        v-decorator="[ 'monolayerArea', {rules:
         [{pattern:/^([0-9][0-9]{0,14}[\.]?[0-9]{1,2})$/,message:'单层建筑面积输入格式为1-15位数字,小数点后两位'}],validateTrigger:['blur']}
        ]"/>m²</div>
      <span v-else>{{buildingInfo.monolayerArea}}m²</span>
    </a-form-item>
    <a-form-item
      label="备注"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol">
      <a-textarea  v-decorator="[
          'remark',{rules: [{max:400,message:'最大长度为400'}]}
        ]" v-if="dataflag!=='000'" :maxLength='400'/>
      <span v-else>{{buildingInfo.remark}}</span>
    </a-form-item>
    <p class="title">构件类型</p>
    <a-table :columns="dataflag==='000'?columns1:columns" :dataSource="dataSource" :rowKey=getKey :pagination=false :locale="{emptyText:'暂无数据'}"  class="buildingTable">
      <template slot="floors" slot-scope="text, record, index">
        <div key="floors">
           <div class="test-floor"  v-if="dataflag!=='000'" :class="{'has-error':record.errorInputType}">
             <a-input
               maxlength="10"
               style="margin: -5px 0; "
               :value="text"
               @blur="onblur($event.target.value,record.id)"
               placeholder="示例1-3,请输入数字和下划线（长度不超过10位）"
               @change="e => handleChange(e.target.value, record.id,'floors',e.target)"/>
             <!--1为空2错误-->
             <p class="has-error" style="height:15px" v-show="record.errorTypeSelect&&!record.errorInputType"></p>
             <p class="has-error" v-show="record.errorInputType">{{record.errorInputType===1?'请输入楼层段':'输入格式不正确'}}</p>
           </div>
          <template v-else>{{text}}</template>
        </div>
      </template>
      <template slot="cmpttypeId" slot-scope="text, record, index">
        <div key="cmpttypeId" >
          <div  v-if="dataflag!=='000'" :class="{'has-error':record.errorTypeSelect}">
            <a-select
              :value="text"
              style="margin: -5px 0"
              @blur="value=>handleBlur(value,record.id)"
              @change="value=> handleSelectChange(value,record.id,'cmpttypeId')"
              placeholder="请选择"
            >
              <a-select-option v-for="item in typeList" :value="item.typeId" :key="item.typeId">
                {{item.typeName}}
              </a-select-option>
            </a-select>
            <p class="has-error" style="height:15px" v-show="record.errorInputType&&!record.errorTypeSelect"></p>
            <p class="has-error" v-show="record.errorTypeSelect===1">{{record.errorTypeSelect===1?'请选择构件类型':''}}</p>
          </div>
          <template v-else>{{record.component}}</template>
        </div>
      </template>
       <template slot="action" slot-scope="text,record" class="action" v-if="dataflag!=='000'">
         <a><i class="iconfont iconshanchu" @click="deleteBuilding(record.id)"></i></a>
       </template>
    </a-table>
     <div class="add-action" v-if="dataflag!=='000'">
      <span @click="addBuilding"><a-icon type="plus-circle" style="margin-right:5px;" />添加</span>
     </div>
  </a-form>
</template>

<script>
let a=0;
  export default {

    props:['dataflag','floorId'],
    data () {
      let count=0;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16},
      };
      const columns = [
        { title: '序号', dataIndex: 'index', key: 'index',customRender:(text, record, index)=>`${index+1}`,width:'15%' },
        { title: '楼层段', dataIndex: 'floors', key: 'floors',scopedSlots: { customRender: 'floors' },width:'30%' },
        { title: '构件类型', dataIndex: 'cmpttypeId', key: 'cmpttypeId',scopedSlots: { customRender: 'cmpttypeId' } ,width:'40%'},
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } ,width:'15%'},
      ];
      const columns1 = [
        { title: '序号', dataIndex: 'index', key: 'index',customRender:(text, record, index)=>`${index+1}`,width:'20%' },
        { title: '楼层段', dataIndex: 'floors', key: 'floors',scopedSlots: { customRender: 'floors' },width:'30%' },
        { title: '构件类型', dataIndex: 'cmpttypeId', key: 'cmpttypeId',scopedSlots: { customRender: 'cmpttypeId' } ,width:'40%'},
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
        isSubmit:true,
        projectId,
        count,
        columns1,
        errorMsg:'',
        number:{

        },
        floornumber:{

        },
        prenumber:{

        }
      };
    },
    methods: {
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
      onblur(val,key){
        const newData = [...this.dataSource];
        const target = newData.filter(item => key === item.id)[0];
        let exg=/^([1-9]{1,8}[\-]?[0-9]{0,8})$/;
        if (target) {
          if(val===''){
            target.errorInputType=1;

          }else if(!exg.test(val)){
            target.errorInputType=2;
          }
          else{
            target.errorInputType=0;
          }
          this.dataSource = newData;
        }

      },
      handleBlur(val,key){
        const newData = [...this.dataSource];
        const target = newData.filter(item => key === item.id)[0];
      if(!val){
        target.errorTypeSelect=1;
      }
      else{
        target.errorTypeSelect=0;
      };
        this.dataSource = newData;

      },
      handleNumberChange(value,flag) {
        if(flag==='003'){
          value=value.toString().split('.')[0];
        }
        if(value&&value.toString().length>15){
        // value=this.form.getFieldValue('preFloorNum');
       //  console.log(value);
         return;
          // value=value.slice(0,15);
        };
      },

      assignFloor(rule,value,callback){
        this.errorMsg='';
            if(!value){
             callback();
            } else if(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g .test(value)){
          callback("楼栋名称不符合规范，请重新输入")
                }
                else{
                  callback();
            }
            // else{
            //   //新建单体校验楼栋名称
            //     if(this.dataflag==='002'){
            //       // this.$ajax('bomextract/build/buildnumexist','GET',{projectId:this.projectId,floorName:value}).then(res=>{
            //       //   res=res.data;
            //       //   if(res.code==='001'){
            //       //     if(res.data){
            //       //       callback('楼栋名称已存在，请重新输入');
            //       //     }
            //       //     else{
            //       //       callback()
            //       //     }
            //       //   }
            //       //   else{
            //       //     callback()
            //       //   }
            //       //
            //       // })
            //     }else{
            //       callback();
            //     }
            // }
      },
      addBuilding(){
        //let a=this.dataSource.length+1;
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

      handleSubmit(e) {
        this.isSubmit=true;
        e.preventDefault();
        //循环数组
        this.dataSource =this.dataSource.map(item=>{
          if(!item.floors){
            item.errorInputType=1;
            this.isSubmit=false;
          }

          if(!item.cmpttypeId){
            item.errorTypeSelect=1;
            this.isSubmit=false;
          }
          return item;
        });
        this.form.validateFields((err, values) => {
          if (!err&&this.isSubmit) {
            let obj=Object.assign({},values);
            obj.projectId=this.$route.params.projectId;
            let data=JSON.parse(JSON.stringify(this.dataSource));
            let newArr=data.map(item=>{
              delete item.index;
              delete item.component;
              return item;
            });
            if(!this.form.getFieldValue('quakeGrade')){
              obj.quakeGrade=null;
            }

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
            let params=obj;
            this.$ajax(url,'POST',obj).then(res=>{
              res=res.data;
              if(res.code==='001'){
                this.errorMsg='';
                this.$message.success(msg,5);
                this.$emit('success',true);
                // params.relationfloor=params.relationfloor.join('、');
                this.$store.commit("setRecord",params);
              }else{
                if(res.code==='002'){
                  this.errorMsg=res.msg;
                }
                else{
                  this.$message.error(res.msg);
                }


              }
            })
          }
        });

      },
      handleSelectChangeLevel(val){
     if(!val){
       this.form.setFieldsValue({'quakeGrade':0});
       console.log(this.form.getFieldValue('quakeGrade'))

     }
        // //console.log(val)
        // if(!val){
        //   console.log(val)
        //   val='';
        //
        // };

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
        let quake;
        this.buildingInfo={...record};
        for(let item in this.buildingInfo){
             if(!this.buildingInfo[item]){
               this.buildingInfo[item]='---';
             }
        };
        if(!record.quakeGrade){
          quake=undefined;
        }else{
          quake=record.quakeGrade;
        }
        let copyRecord={
         // relationfloor:arr,
          floorName:record.floorName,
          floorCode:record.floorCode,
          floorNum:record.floorNum,
          preFloorNum:record.preFloorNum,
          quakeGrade:quake,
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
    watch:{
      dataflag(val,oldval){
        if(oldval&&val==='001') {
          let record = this.$store.state.record;
          this.buildingDetails(record);
          this.getBuildingType();
        }
      }
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
    text-align:left;
    color: #f5222d;
    margin-top:3px;
    margin-bottom: 0;
    line-height:1.5;
  }
  .add-item{
    cursor: pointer;
    text-align:center;
    display:block;
    border:1px dashed #999;
    line-height:30px;
    width:60px;
  }
  .title{
    font-weight:bold;
    color: rgba(0, 0, 0, 0.85);

  }
</style>
