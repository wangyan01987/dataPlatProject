<template>
<div>
  <a-form :form="formData">
    <a-form-item label="项目名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-input placeholder="请输入项目名称，支持中英文字符，字数为6-20" v-decorator="[ 'projectName', {rules: [{message:'项目名称'},{ required: true, message: '项目名称不可为空' },{validator:checkName}]}
        ]" v-show="dataflag===1||dataflag===2" ></a-input>
      <span v-show="dataflag===0">{{obj.projectName}}</span>
    </a-form-item>
    <a-form-item label="项目简称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-input placeholder="请输入项目名称，支持中英文字符，字数为6-20" v-decorator="['projectAbbr', {rules: [{validator:checkName}]} ]" v-show="dataflag===1||dataflag===2"></a-input>
      <span v-show="dataflag===0">{{obj.projectAbbr}}</span>
    </a-form-item>
    <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="项目编号">
      <a-input v-decorator="[ 'projectCode', {rules:[{validator:checkNumber}]}]" placeholder="请输入项目名称，支持中英文字符，字数为6-20" v-show="dataflag===1||dataflag===2"/>
      <span v-show="dataflag===0">{{obj.projectCode}}</span>
    </a-form-item>
    <a-form-item label="项目类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-select @change="handleChange" placeholder="请选择项目类型" v-decorator="[ 'protype']">
        <a-select-option v-for="item in arr" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="项目所在地" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-row :gutter="4">
        <a-col :span="8">
          <a-form-item>
            <a-select @change="handleChange" placeholder="省市" v-decorator="[ 'provinceId']">
              <a-select-option v-for="item in arr" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item>
            <a-select @change="handleChange" placeholder="城市" v-decorator="[ 'cityId']">
              <a-select-option v-for="item in arr" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item>
            <a-select @change="handleChange" placeholder="区县" v-decorator="[
          'districtId']">
              <a-select-option v-for="item in arr" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
            </a-select>

          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item class="special">
        <a-input placeholder="请输入详细地址，支持中英文字符，字数为6-20"  v-decorator="['proLocal', {rules: [{validator:checkName}]}]"  v-if="dataflag===1||dataflag===2"></a-input>
        <span v-else>{{obj.proLocal}}</span>
      </a-form-item>
    </a-form-item>
    <a-form-item label="项目公司" :label-col="formItemLayout.labelCol":wrapper-col="formItemLayout.wrapperCol">
      <a-input placeholder="请输入项目公司，支持中英文字符，字数为6-20" v-decorator="['proCompany',{rules: [{validator:checkName}]}]" v-if="dataflag===1||dataflag===2"></a-input>
      <span v-else>{{obj.proCompany}}</span>
    </a-form-item>
    <a-form-item label="建设单位" :label-col="formItemLayout.labelCol":wrapper-col="formItemLayout.wrapperCol">
      <a-input placeholder="请输入建设单位，支持中英文字符，字数为6-20" v-decorator="[
          'developmentUnit',
            {rules: [{validator:checkName}]}
        ]" v-show="dataflag===1||dataflag===2"></a-input>
      <span v-show="dataflag===0">{{obj.developmentUnit}}</span>
    </a-form-item>
    <a-form-item v-bind="formItemLayout"
                 label="立项时间"><a-date-picker v-decorator="['proTime']" placeholder="请选择日期" v-show="dataflag===1||dataflag===2"/>
      <span v-show="dataflag===0">{{obj.proTime}}</span>
    </a-form-item>
    <a-form-item label="栋数" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="dataflag===1">
      <a-input v-decorator="[ 'buildNum' ]" disabled></a-input>
    </a-form-item>
    <a-form-item label="项目简介" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-textarea v-show="dataflag===1||2" placeholder=" 请输入项目简介，支持中英文字符" :autosize="{ minRows: 3, maxRows: 6 }"v-decorator="[ 'introduction',{rules: [{validator:checkName}]}]"/>
      <span v-show="dataflag===0">{{obj.introduction}}</span>
    </a-form-item>
    <a-form-item label="合同名称" :label-col="formItemLayout.labelCol"
                 :wrapper-col="formItemLayout.wrapperCol">
      <a-input placeholder="请输入合同名称，支持中英文字符，字数为6-20" v-decorator="[
          'contractName',
            {rules: [{validator:checkName}]}
        ]" v-if="dataflag===1||dataflag===2"></a-input>
      <span v-else>{{obj.contractName}}</span>
    </a-form-item>
  </a-form>
  <div class="btn-box" v-if="dataflag!==0">
    <a-button  @click="cancel">取消</a-button>
    <a-button type="primary" style="margin-left:0.1rem" @click="submit">确定</a-button>
  </div>
</div>
</template>

<script>
  import {isName,isNum} from '@/utils/common.js'
  export default {
    name: 'HelloWorld',
    data() {
      const formItemLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 18},
      };
      const formTailLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 8, offset: 4},
      };
      return {
        obj:{},
        formItemLayout,
        formTailLayout,
        formData: this.$form.createForm(this),
        arr:[{label:'工程',value:'001'},{label:'工程2',value:'002'}],
      }

    },
    components: {},
    props: ['dataflag','projectId'],
    methods: {
      checkNumber(rule, value, callback){
            if(value&&!isNum(value)){
              callback('项目编号不符合规范，请重新输入');
            }
            else{
              callback();
            }
      },
      checkName(rule, value, callback) {
        let str;
        switch(rule.field){
          case 'nickname': str='项目简称' ;break;
          case 'address':str='项目详细地址';break;
          case 'company':str='项目公司';break;
          case 'projectInfo':str='项目简介';break;
          case 'developer':str='建设单位';break;
          case 'assign':str='合同名称';break;
          default :str='项目名称';
        };
        if (!value) {
          callback()
        }
        else {
          if (!isName(value)) {
            callback(str+"不符合规范，请重新输入")
          } else {
            callback();
          }
        }
      },
      submit() {
        this.formData.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          //提交表单
          //新建项目
          let url,obj,msg;
          if(this.dataflag===2){
            obj=fieldsValue;
             url='bomextract/project/addproject';
             msg='创建';
          }
          else{
            obj=fieldsValue;
            obj.projectId=this.projectId;
               url='bomextract/project/modifyproject';
               msg='编辑';
          };
         if(fieldsValue['proTime']){
           obj.proTime=fieldsValue['proTime'].format('YYYY-MM-DD');
         }
          this.$ajax(url,'POST',obj).then(res=>{
            res=res.data;
            if(res.code==='001'){
              this.$message.success(`${msg}成功`, 5);
              this.formData.resetFields();
            }else{
              this.$message.error(res.msg);
            }
          });
          this.$emit('save');
        })
      },
      cancel(){
           this.$emit('cancel');
      },
      handleChange(val) {

      },
      setMsg(obj) {
        this.obj=Object.assign({},obj);
        if (obj instanceof Object&&this.dataflag!==0) {
          this.formData.setFieldsValue(obj);
        }

      },
    },
    watch:{
        dataflag(val){

          var obj = {
            name: 'lalallalla',
            nickname: 'ahahhaaha',
            buildingNumber: 5,

          };
          var that=this;
            if(val===1) {
              //  setTimeout(function(){
              //    that.setMsg(obj)
              //  },50);
            }
        }
    },
    mounted() {
      //编辑信息 001
   if(this.dataflag===1||0){
     let id=this.projectId;
     this.$ajax('bomextract/project/getprojectbyprojid','GET',{projectId:id}).then(res=>{
       res=res.data;
       if(res.code==='001'){
           let obj=res.data;
           delete obj.projectId;
         setTimeout(()=>{
           this.setMsg(obj)
         },50);
       }
     });

   }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .special.ant-form-item {
    margin-bottom: 0;
  }
  .btn-box{
    display:flex;
   justify-content:flex-end;
  }
</style>
