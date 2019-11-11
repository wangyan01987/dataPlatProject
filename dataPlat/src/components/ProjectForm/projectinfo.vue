<template>
<div>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <a-form :form="formData">
        <a-form-item label="项目名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                     :class="{'ant-form-item-with-help':errorMsg}">
          <a-input maxlength="50"  placeholder="请输入项目名称，支持英文、数字、符号，字数小于50" v-decorator="[ 'projectName', {validateTrigger:['blur'],rules: [{ required: true, message: '项目名称不可为空' },{validator:checkName}]}
        ]" v-show="dataflag===1||dataflag===2" ></a-input>
          <p class="has-error" v-show="errorMsg">{{errorMsg}}</p>
          <span v-show="dataflag===0">{{obj.projectName}}</span>
        </a-form-item>
        <a-form-item label="项目简称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入项目简称，支持中英文字符，字数小于50"  maxlength="51"  v-decorator="['projectAbbr', {validateTrigger:['blur'],rules: [{validator:checkName}]} ]" v-show="dataflag===1||dataflag===2"></a-input>
          <span v-show="dataflag===0">{{obj.projectAbbr?obj.projectAbbr:'---'}}</span>
        </a-form-item>
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="项目编号">
          <a-input maxlength="51" v-decorator="[ 'projectCode', {validateTrigger:['blur'],rules:[{validator:checkNumber},{ required: true, message: '项目编号不可为空' }]}]"   placeholder="请输入项目编号，支持英文、数字、符号，字数小于50" v-show="dataflag===1||dataflag===2"/>
          <span v-show="dataflag===0">{{obj.projectCode}}</span>
        </a-form-item>
        <a-form-item label="项目类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-show="dataflag===1||dataflag===2" >
          <a-select placeholder="请选择项目类型" v-decorator="['protype']">
            <a-select-option v-for="item in arr" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
          </a-select>
          <span v-show="dataflag===0">{{obj.protype?obj.protype:'---'}}</span>
        </a-form-item>

        <a-form-item label="项目所在地" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <span v-show="dataflag===0" class="area">{{obj.provinceName?obj.provinceName:'---'}}</span>
          <span v-show="dataflag===0" class="area">{{obj.cityName}}</span>
          <span v-show="dataflag===0" class="area">{{obj.districtName}}</span>
          <span v-show="dataflag===0">{{obj.proLocal}}</span>
          <a-row :gutter="4" v-show="dataflag===1||dataflag===2">
            <a-col :span="8">
              <a-form-item >
                <a-select
                  @change="handleprovince"
                  @select="(e)=>{
                provincehandleChange(e,'001')
                }" placeholder="省市" v-decorator="['provinceId']"  :allowClear=true>
                  <a-select-option v-for="item in provincearr" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>

            </a-col>
            <a-col :span="8">
              <a-form-item v-show="dataflag===1||dataflag===2">
                <a-select @select="(value)=>{handleChange(value,'001')}"
                          @change="handleCity"
                          placeholder="城市" v-decorator="['cityId']"   :allowClear=true>
                  <a-select-option v-for="item in cityarr" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>

            </a-col>
            <a-col :span="8">
              <a-form-item v-show="dataflag===1||dataflag===2">
                <a-select placeholder="区县" v-decorator="[ 'districtId']"  :allowClear=true>
                  <a-select-option v-for="item in districtarr" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>

            </a-col>
          </a-row>
          <a-form-item class="special">
            <a-input placeholder="请输入详细地址，支持中英文字符，字数小于50"  maxlength="50"  v-decorator="['proLocal', {validateTrigger:['blur'],rules: [{validator:checkName}]}]"  v-show="dataflag===1||dataflag===2"></a-input>
          </a-form-item>
        </a-form-item>
        <a-form-item label="项目公司" :label-col="formItemLayout.labelCol":wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入项目公司，支持中英文字符，字数小于50"  maxlength="51"  v-decorator="['proCompany',{validateTrigger:['blur'],rules: [{validator:checkName}]}]" v-if="dataflag===1||dataflag===2"></a-input>
          <span v-else>{{obj.proCompany?obj.proCompany:'---'}}</span>
        </a-form-item>
        <a-form-item label="建设单位" :label-col="formItemLayout.labelCol":wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入建设单位，支持中英文字符，字数小于50"  maxlength="51"  v-decorator="[
          'developmentUnit',
            {validateTrigger:['blur'],rules: [{validator:checkName}]}
        ]" v-show="dataflag===1||dataflag===2"></a-input>
          <span v-show="dataflag===0">{{obj.developmentUnit?obj.developmentUnit:'---'}}</span>
        </a-form-item>
        <a-form-item v-bind="formItemLayout"
                     label="立项时间"><a-date-picker v-decorator="['proTime']" placeholder="请选择日期" v-show="dataflag===1||dataflag===2"/>
          <span v-show="dataflag===0">{{obj.proTime?obj.proTime:'---'}}</span>
        </a-form-item>
        <a-form-item label="栋数" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="dataflag===1">
          <a-input v-decorator="[ 'buildNum' ]" disabled></a-input>
        </a-form-item>
        <a-form-item label="项目简介" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-textarea v-show="dataflag===1||dataflag===2" placeholder=" 请输入项目简介，支持中英文字符" :autosize="{ minRows: 3, maxRows: 6 }"
                      :maxLength='401'
                      v-decorator="[ 'introduction',{validateTrigger:['blur'],rules:[{max:400,message:'字数最多为400字'}]}]"/>
          <span v-show="dataflag===0">{{obj.introduction?obj.introduction:'---'}}</span>
        </a-form-item>
        <a-form-item label="合同名称" :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入合同名称，支持中英文字符，字数小于50"  maxlength="51"  v-decorator="[
          'contractName',
            {rules: [{validator:checkName}]}
        ]" v-if="dataflag===1||dataflag===2"></a-input>
          <span v-else>{{obj.contractName?obj.contractName:'---'}}</span>
        </a-form-item>
      </a-form>
      <div class="btn-box" v-if="dataflag!==0">
        <a-button  @click="cancel">取消</a-button>
        <a-button type="primary" style="margin-left:0.1rem" @click="submit">确定</a-button>
      </div>
    </div>
  </a-spin>

</div>
</template>
<script>
  import {isName,isNum} from '@/utils/common.js';
  import moment from 'moment'
  export default {
    name: 'HelloWorld',
    props: ['dataflag','projectId'],
    data() {
      const formItemLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 18},
      };
      const formTailLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 8, offset: 4},
      };
      let buryObj={
        action:'actionEditProjectAtListPage',
        user: this.$store.state.userId,
        eventType:'buttonClick',
        eventName:'commitProjectAtListPage',
        pageName:'项目列表页编辑提交',
        pageArea:'All',
        terminal:'PC'
      };
      return {
        provincearr:[],
        obj:{},
        formItemLayout,
        formTailLayout,
        formData: this.$form.createForm(this),
        arr:[{label:'住宅',value:'1'},{label:'商业',value:'2'},
          {label:'办公',value:'3'},{label:'教育',value:'4'},
          {label:'其他',value:'5'}],
        spinning:false,
        errorMsg:'',
        cityarr:[],
        districtarr:[],
        buryObj,
        imgList:[{
          src:require('../../assets/projectImg/001.jpg')
        },{
          src:require('../../assets/projectImg/002.jpg')
        },
          {
            src:require('../../assets/projectImg/003.jpg')
          },{
            src:require('../../assets/projectImg/004.jpg')
          },
          {
            src:require('../../assets/projectImg/005.jpg')
          },
          {
            src:require('../../assets/projectImg/003.jpg')
          },
        ],
      }

    },
    components: {},
    methods: {
      checkNumber(rule, value, callback){
            if(value){
              if(value.length>50){
                callback("超出字符限制50");
              }else if(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g .test(value)){
                callback('项目编号不符合规范，请重新输入');
              }else{
                callback();
              }
            }
            else{
              callback()
            }
      },
      checkName(rule, value, callback) {
        let str;
        switch(rule.field){

          case 'projectAbbr': str='项目简称' ;break;
          case 'proLocal':str='项目详细地址';break;
          case 'proCompany':str='项目公司';break;
          case 'developmentUnit':str='建设单位';break;
          case 'contractName':str='合同名称';break;
          default :str='项目名称';
        };
          if(str==='项目名称'){
            this.errorMsg='';
          }
        if (!value) {
          callback()
        }
        else {
          if(value.length>50){
            callback(str+"超出字符限制50");
          }else if(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g .test(value)){
            callback(str+"不符合规范，请重新输入")
          }else{
            callback();
          }

        }
      },
      handleprovince(val){
        if(!val){
          //清空市区
          this.districtarr=[];
          this.cityarr=[];
          this.formData.setFieldsValue({'cityId':undefined});
          this.formData.setFieldsValue({'districtId':undefined});

        }
      },
      handleCity(val){
        //清空区
        this.districtarr=[];
        this.formData.setFieldsValue({'districtId':undefined});
      },
      randomImg(item){
        //产生随机数
        let key= Math.floor(Math.random()*5);
        item.image=key;
        return item;
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
            //设置随机图片
            this.randomImg(obj);
          }
          else{
            obj=fieldsValue;
            if(!fieldsValue.provinceId){
              obj.provinceId=null;
              obj.cityId=null;
              obj.districtId=null;
            }
            else if(!fieldsValue.cityId){
              obj.cityId=null;
              obj.districtId=null;
            }
            else if(!fieldsValue.districtId){
              obj.districtId=null;
            }
            obj.projectId=this.projectId;
               url='bomextract/project/modifyproject';
               msg='编辑';
          };
         if(fieldsValue['proTime']){
           obj.proTime=fieldsValue['proTime'].format('YYYY-MM-DD');
         };
          this.$ajax(url,'POST',obj).then(res=>{
            res=res.data;
            if(res.code==='001'){
              this.errorMsg='';
              if(obj.projectName){
                let arr=this.$store.state.menuList;
                this.$store.state.menuList= arr.map(item=>{
                  if(item.projectId===obj.projectId){
                    item.projectName=obj.projectName;
                  };
                  return item;
                });
              }
              this.$message.success(`${msg}成功`, 5);
              this.formData.resetFields();

              this.$store.commit("setProjectName", obj.projectName);
              this.$emit('save');
            }else{
              if(res.code==='004'){
                this.errorMsg=res.msg;
              }else{
                this.$message.error(res.msg);
              }

            }
          });
        })
      },
      cancel(){
           this.$emit('cancel');
      },
      provincehandleChange(val,flag){
        this.cityarr=[];
          this.$ajax("bomextract/project/getprovandcity",'GET',{"parentId":val}).then(res=>{
            res=res.data;
            if(res.code==='001'){
              this.cityarr=res.data;
            if(flag){
              this.formData.setFieldsValue({'cityId':this.cityarr[0].id});
              this.handleChange(this.cityarr[0].id,'001');
             }
            }else{
              this.$message.error(res.msg);
            }
          });
      },
      handleChange(val,flag) {
            this.$ajax("bomextract/project/getprovandcity",'GET',{"parentId":val}).then(res=>{
              res=res.data;
              if(res.code==='001'){
                this.districtarr=res.data;
                if(flag){
                   this.formData.setFieldsValue({'districtId':this.districtarr[0].id});
                }
              }else{
                this.$message.error(res.msg);
              }
            });
      },
      getProvince(){
        this.$ajax("bomextract/project/getprovandcity",'GET').then(res=>{
          res=res.data;
          if(res.code==='001'){
            this.provincearr=res.data;
          }else{
            this.$message.error(res.msg);
          }
        });
      },
     async getProjectInfo(){
       this.spinning=true;
        let id=this.projectId;
        let flag=this.dataflag;  //0查看 1编辑
       let obj= await new Promise((reslove,reject)=>{
         this.$ajax('bomextract/project/getprojectbyprojid','GET',{projectId:id}).then(res=>{
           res=res.data;
              if(res.code==='001'){
                reslove(res.data);
              }
         });
       });
         delete obj.projectId;
         if(flag===0){
           this.obj=Object.assign({},obj);
           this.spinning=false;
         }
         //编辑时获取值
         if(flag===1){
           delete obj.provinceName;
           delete obj.cityName;
           delete obj.districtName;
           //获取联动值
           //获取省
          await  this.getProvince();
           if(obj.provinceId){
             //获取市
            await this.provincehandleChange(obj.provinceId);
            await  this.handleChange(obj.cityId);
           };
           setTimeout(()=>{
             this.setMsg(obj)
           },100);
         }
      },
     async setMsg(obj) {
        if (obj instanceof Object&&this.dataflag!==0) {
         if(obj.proTime){
           obj.proTime=moment(obj.proTime,'YYYY-MM-DD HH:mm:ss');
         }
          this.formData.setFieldsValue(obj);
          setTimeout(()=>{
            this.spinning=false;
          },1000);
        }

      },
    },
    watch:{
        dataflag(val){
          var that=this;
          if(val===1) {
            that.getProjectInfo();
          }
        }
    },
    mounted() {
      //编辑信息 001 产看000
   if(this.dataflag===1||this.dataflag===0){
     this.getProjectInfo();
   };
    if(this.dataflag===2){
      //新建
      this.getProvince();
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
  .area{
    margin-right:10px;
  }
</style>
