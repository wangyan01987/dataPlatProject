<template>
<div class="info-container">
    <div class="info-item">
      <p class="title"><span>基本信息</span><span class="editor" @click="editor" v-show="!isEditor">编辑</span></p>
       <div class="info-box">
         <a-form :form="form" :hideRequiredMark="!isEditor" >
           <a-form-item  label="姓名" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
             <a-input placeholder="请输入您的姓名"  v-show="isEditor"  v-decorator="[ 'userName',
{rules: [{required:true,message:'请输入姓名'},{max:20,message:'最大长度为20个字符'},{pattern:/^[\w\*]+$/,message:'姓名输入格式不正确'}]}
        ]">
             </a-input>
             <span v-show="!isEditor">{{personInfo.userName?personInfo.userName:'未设置'}}</span>
           </a-form-item>
           <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="性别" >
               <a-radio-group v-decorator="['sex']" v-show="isEditor">
                 <a-radio value="1">
                   女
                 </a-radio>
                 <a-radio value="2">
                   男
                 </a-radio>
               </a-radio-group>
             <span  v-show="!isEditor">{{personInfo.gender?personInfo.gender:'未设置'}}</span>
             </a-form-item>
           <a-form-item label="所属公司" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
             <a-input v-show="isEditor"
               placeholder="请输入所属公司"
               v-decorator="[
          'companyName',
          {rules: [{max:20,message:'最大长度为40个字符'}],
          }
        ]"
             >
             </a-input>
             <span  v-show="!isEditor">{{personInfo.companyName?personInfo.companyName:'未设置'}}</span>
           </a-form-item>
           <a-form-item label="职位" :label-col="formItemLayout.labelCol"
                        :wrapper-col="formItemLayout.wrapperCol">
             <a-input placeholder="请输入职位" v-show="isEditor"
                      v-decorator="[ 'position',{rules: [{max:20,message:'最大长度为20个字符'}], }  ]">
             </a-input>
             <span  v-show="!isEditor">{{personInfo.position?personInfo.position:'未设置'}}</span>
           </a-form-item>
           <div class="action-box" v-show="isEditor">
             <a-button @click='cancel' type="default" size="default"  >取消</a-button>
             <a-button @click='submit' type="primary" >确定</a-button>
           </div>

         </a-form>
       </div>
    </div>
   <div class="info-item">
     <p class="title">联系方式</p>
     <div class="info-box">
       <a-form :form="form" >
         <a-form-item  label="手机号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol1">
           <a-row :gutter="4">
             <a-col :span="18">
               <span v-show="!isEditPhone">{{personInfo.phoneNumber}}</span>
               <span class="action"  v-show="!isEditPhone" @click="changePhone">修改</span>
             </a-col>
             <a-col :span="6">
               <a-modal title="重置手机号" v-model="visible" @ok="handleOk" okText="确认" cancelText="取消"  :destroyOnClose="true" centered>
                 <reset-phone ref="resetphone"></reset-phone>
               </a-modal>
             </a-col>
           </a-row>
         </a-form-item>
         <a-form-item  label="邮箱" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol1">
           <a-row :gutter="4">
             <a-col :span="18">
               <a-auto-complete
                 v-if="isEditEmail"
                 v-decorator="[
          'email',
          {rules: [{
              validator: checkEmail,
            }],validateTrigger:['blur']}
        ]"

                 @change="handleEmailChange"
               >
                 <template slot="dataSource">
                   <a-select-option
                     v-for="email in autoCompleteResult"
                     :key="email">
                     {{ email }}
                   </a-select-option>
                 </template>

                 <a-input placeholder="请输入邮箱地址">
                   <img slot="prefix" src="../../assets/images/youxiang@2x.png" style="width:14px"/>
                 </a-input>
               </a-auto-complete>
               <span  v-show="!isEditEmail" >{{personInfo.email?personInfo.email:'未绑定'}}</span>
               <span class="action" v-show="!isEditEmail"  @click="isEditEmail=true">修改</span>
             </a-col>
             <a-col :span="6">
               <span  class="action"  v-show="isEditEmail" @click="isEditEmail=false">取消</span>
               <span  class="action"  v-show="isEditEmail" @click="modifyEmail">确定</span>
             </a-col>
           </a-row>
         </a-form-item>
       </a-form>
     </div>
   </div>
</div>
</template>

<script>
  import ResetPhone from './ResetPhone.vue'
  import {email} from '@/utils/common.js'
    export default {
        name: "PersonInfo",
      components:{ResetPhone},
      data(){
        const formItemLayout = {
          labelCol: { span: 4 },
          wrapperCol: { span: 12 },
          wrapperCol1: { span: 16 },
        };
        const formTailLayout = {
          labelCol: { span: 4 },
          wrapperCol: { span: 8, offset: 4 },
        };
        return{
          visible:false,
          formItemLayout: formItemLayout,
          formTailLayout,
          form: this.$form.createForm(this),
          personInfo:{
            userName:'',
            emial:'',
            phoneNumber:'',
            gender:'',
            companyName:'',
            position:'',
          },
          isEditPhone:false,
          isEditEmail:false,
          isEditor:false,
          autoCompleteResult:[]
        }

      },
      mounted(){
        // 获取个人信息
        this.$ajax('bomextract/user/getpersoninfo','POST').then(res=>{
                res=res.data;
                if(res.code==='001'){
                  // 更新数据
                  this.form.setFieldsValue(res.data);
                  this.personInfo=res.data;

                  if (res.data.sex === "1"){
                    this.personInfo.gender = "女";
                  }else if(res.data.sex === "2"){
                    this.personInfo.gender = "男";
                  }
                  t
                  // 返回
                  this.isEditEmail=false;
                }
                else{
                  this.$message.error(res.msg);
                }
          })
      },
      methods:{
        handleEmailChange  (value) {
          let autoCompleteResult;
          if (!value) {
            autoCompleteResult = [];
          } else {
            autoCompleteResult = ['@163.com', '@126.com', '@qq.com'].map(domain => `${value}${domain}`);
          }
          this.autoCompleteResult = autoCompleteResult;
        },
        modifyEmail(){
             let email=this.form.getFieldValue('email');
        },
          editor(){
            this.isEditor=true;
          //  this.form.set
          },
          checkName(){

          },
          checkEmail(rule, value,callback){
              if(value&&!email(value)){
                callback('邮箱格式不正确');
              }
              else{
                callback();
              }
          },
        checkPhone(){

        },
        modifyEmail(){
          var newEmail = this.form.getFieldValue("email");
          this.$ajax('bomextract/user/modifyemail','POST',{"email":newEmail}).then(res=>{
                res=res.data;
                if(res.code==='001'){
                  // 更新数据
                  this.$message.success('修改成功！');
                  this.personInfo.email = newEmail;
                  // 返回
                  this.isEditEmail=false;
                }
                else{
                  this.$message.error(res.msg);
                }
          })

        },
        changePhone(){
          this.visible=true;
        },
        handleOk(){
              this.$refs.resetphone.handleSubmit();

        },
        submit(){
           this.form.validateFields((err, fieldsValue) => {
            if (err) {
              return;
            };
            //提交表单
            this.$ajax('bomextract/user/modifypersoninfo','POST',fieldsValue).then(res=>{
                res=res.data;
                if(res.code==='001'){
                  // 更新数据
                  this.$message.success('修改成功！');
                  this.form.setFieldsValue(fieldsValue);
                  this.personInfo.userName = fieldsValue.userName;
                  this.personInfo.companyName = fieldsValue.companyName;
                  this.personInfo.position = fieldsValue.position;
                  this.$store.commit('setUserName',this.personInfo.userName);
                  if (fieldsValue.sex === "1"){
                    this.personInfo.gender = "女";
                  }else if(fieldsValue.sex === "2"){
                    this.personInfo.gender = "男";
                  }
                  // 返回
                  this.isEditor=false;

                }
                else{
                  this.$message.error(res.msg);
                }
          })
          })
        },
        cancel(){
                 //this.form.resetFields();
                 this.isEditor=false;
        let obj={
        userName:  this.personInfo.userName,
        companyName:  this.personInfo.companyName,
         position: this.personInfo.position,
          sex:this.personInfo.sex
        };

                 this.form.setFieldsValue(obj)
           }
      }
    }
</script>

<style scoped>
 .info-container{
   width:100%;
   height:100%;
   text-align:left;
   padding-bottom: 0.2rem;
 }
  .info-item{
    width:7.4rem;
    background-color: #ffffff;
    border: solid 1px #d9d9d9;
    margin:0.2rem auto;
    margin-top:0
  }
  .info-item .title{
    font-size:16px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 53px;
    margin:0;
    border-bottom: 1px solid  rgba(0, 0, 0, 0.1);
    padding:0 0.2rem;
  }
  .info-box{
padding-top:24px;

  }
  .action-box{
    text-align:right;
    padding:0.16rem 0.24rem;
  }
  .action{
   color: #1890ff;
    cursor:pointer;
  }
  .editor{
    float:right;
    cursor:pointer;
    color: #1890ff;
  }
</style>
