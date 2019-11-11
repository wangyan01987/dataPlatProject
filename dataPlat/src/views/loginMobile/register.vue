<template>
  <div class="register">
    <a-form :form="formData">
     <div v-show="dataflag==='000'">
       <a-form-item >
         <a-input placeholder="请输入姓名"  size="large"
                  v-decorator="[ 'username',
            {rules: [{max:20,message:'姓名最大长度为20个字符'},{required:true,message:'请输入姓名'}],validateTrigger:['blur']}
        ]">
           <img slot="prefix" src="../../assets/images/name@2x.png" style="width:14px"/>
         </a-input>
       </a-form-item>
       <a-form-item  :class="{'ant-form-item-with-help':phoneErr}">
         <a-input placeholder="请输入手机号"   size="large"  v-decorator="['phoneNumber',
            {rules: [{validator:checkAccount}],validateTrigger:['blur'],validateFirst:true}]">
           <img slot="prefix" src="../../assets/images/iphone@2x.png" style="width:14px"/>
         </a-input>
         <p class="has-error" v-show="phoneErr">{{phoneErr}}</p>
       </a-form-item>
       <a-form-item :class="{'ant-form-item-with-help':codeError}">
         <a-row :gutter="8">
           <a-col :span="15">
             <a-input placeholder="请输入验证码" id="success"  size="large"   v-decorator="[
          'code',
            {rules: [{validator:assignCode}],validateTrigger:['blur']}
        ]">
               <img slot="prefix" src="../../assets/images/yanzh@2x.png" style="width:14px"/>
             </a-input>
             <p class="has-error" v-show="codeError">{{codeError}}</p>
           </a-col>
           <a-col :span="9">
             <a-button  :type="btnType" @click="sendCode" :disabled="btnabled" style="height:40px;font-size:16px;width:100%">{{codeText}}</a-button>
           </a-col>
         </a-row>
       </a-form-item>
       <a-form-item>
         <a-auto-complete
           v-decorator="[
          'email',
          {rules: [{
              validator: validEmail,
            }],validateTrigger:['blur']}
        ]" @change="handleEmailChange"
         >
           <template slot="dataSource">
             <a-select-option
               v-for="email in autoCompleteResult"
               :key="email">
               {{ email }}
             </a-select-option>
           </template>
           <a-input placeholder="请输入邮箱地址（选填）"  size="large" >
             <img slot="prefix" src="../../assets/images/youxiang@2x.png" style="width:14px"/>
           </a-input>
         </a-auto-complete>
       </a-form-item>
       <a-form-item style="font-size:12px;">
         <a-checkbox v-decorator="['agreement', {valuePropName: 'checked',rules: [{
              validator: checkAgreeMent,
            }]}]">
           已阅读并同意
           <a  href="javascript:void(0)"  @click="visible=true" style="color:#1890ff;">
             PST及平台服务协议
           </a>
         </a-checkbox>
       </a-form-item>
       <a-drawer

         placement="right"
         :closable="false"
         @close="onClose"
         :visible="visible"
         width="100%"
       >
        <div style="display:flex;" class="top-title">
         <span > <a @click="visible=false" style="color:#1890ff;margin-right:30px;">
           <i class="iconfont iconxiangzuo" style="color: #1890ff;"></i>返回</a></span>
          <span></span>
        </div>
         <aggrement></aggrement>

       </a-drawer>
     </div>
      <div v-show="dataflag==='111'">
        <a-form-item>
          <a-input
            placeholder="请输入密码"
            size="large"
            v-decorator="[
          'password',
          {
            rules: [{
              validator: validPass,
            }],
             validateTrigger:['blur']
          }
        ]"
            :type="psdtype"
          >
            <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
            <a v-show="psdtype==='password'" slot="suffix"  ><i class="iconfont iconxianshi"  @click="psdtype='text'"  /></a>
            <a  v-show="psdtype==='text'"  slot="suffix"  ><i class="iconfont iconxiaoshi"   @click="psdtype='password'"  /></a>
          </a-input>
          <p class="small-size"><a-icon type="info-circle" style="color:#1890ff;margin-right:3px;font-size:12px;" theme="filled" />6-16位字母、数字或符号组成，区分大小写</p>
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            placeholder="请再次输入密码"
            v-decorator="[
          'repassword',
          {
            rules: [{
              validator: compareToFirstPassword,
            }],
            validateTrigger:['blur']
          }
        ]"
            :type="psdtype1"
          >
            <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
            <a v-show="psdtype1==='password'" slot="suffix"  ><i class="iconfont iconxianshi"  @click="psdtype2='text'"  /></a>
            <a  v-show="psdtype1==='text'"  slot="suffix"  ><i class="iconfont iconxiaoshi"   @click="psdtype2='password'"  /></a>
          </a-input>
           <p class="has-error" v-show="errorMsg">{{errorMsg}}</p>
        </a-form-item>
      </div>
      <a-form-item style="margin-bottom: 0" >
        <a-button  type="primary" style="width:100%"  @click="handleSubmit(0)"  v-if="dataflag==='000'">下一步</a-button>
      <a-form-item v-else >
        <a-button  type="primary" style="width:100%"  @click="handleSubmit(1)" >注册</a-button>
         <div style="text-align:right;margin-top:12px;"> <a style="color:#1890ff;text-decoration: underline" @click="dataflag='000'">返回上一步</a></div>
      </a-form-item>

      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import {isOnlyMobile,isPassword, email} from '@/utils/common.js';
  import aggrement from './aggrement'
  export default {
    name: 'register',
    data () {
      return {
        codeText:'获取验证码',
        formData:this.$form.createForm(this),
        btnabled:true,
        btnType:'default',
        autoCompleteResult:'',
        mobile:'',
        dataflag:'000',
        psdtype:'password',
        psdtype1:'password',
        visible:false,
        errorMsg:'',
        phoneErr:'',
        timer:'',
        codeError:''
      }

    },
    components:{
      aggrement
    },
    methods:{
      onClose(){
        this.visible=false;
      },
      initData(){
        this.codeText='获取验证码';
        this.btnabled = false;
        this.btnType='primary'
      },
      resetData(){
        this.codeText='获取验证码';
        this.btnabled = true;
        this.btnType='default'
      },
      sendCode(){
        //获取验证码
        //发送请求

        let mobile= this.formData.getFieldValue('phoneNumber');
        if(!mobile){
          return;
        }
        this.$ajax('sendsms','POST',{type:'register',phoneNumber:mobile}).then(res=>{
          res=res.data;
          if(res.code==='001'){
            this.phoneErr='';
            this.$message.success('发送成功');
          }
          else{
               if(res.code==='006'){
                 //手机号已注册
                 this.phoneErr=res.msg;
               }
               else{
                 this.$message.error(res.msg);
               }
          }
        });
        const TIME_COUNT = 60;
        this.timer='';
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
              this.codeText = `重新获取${this.count}s`;
              this.btnabled = true;
              this.btnType = 'default';
            } else {
              clearTimeout(this.timer)
              this.initData();
            }
          }, 1000)
        }

      },
      validEmail(rule, value, callback){
        if(value&&!email(value)){
          callback('邮箱格式不正确');
        }else{
          callback();
        }
      },
      checkAgreeMent(rule, value, callback){
        if(value){
          callback();
        }
        else{
          callback('请勾选“已阅读并同意PST及平台服务协议”');
        }
      },
      handleSubmit(val) {
         if(!val){
           this.formData.validateFields(['username','phoneNumber','code','email','agreement'],{firstFields:['phoneNumber']},(err, value) => {
             if (err) {
               return;
             }
             this.dataflag='111';
           })
         }
         else{
           this.formData.validateFields({firstFields:['phoneNumber']},(err, fieldsValue) => {
             if (err) {
               return;
             };
             if(val){
               //提交表单
               let obj=fieldsValue;
               obj.password=this.$md5(obj.password);
               delete obj.repassword;
               delete obj.agreement;
               this.$ajax('bomextract/CloseBate/registAndTrial','POST',obj).then(res=>{
                 res=res.data;
                 if(res.code==='001'){
                   this.errorMsg='';
                   this.dataflag='000';
                   this.$emit('registerSuccess',true);

                   this.formData.resetFields();
                 }
                 else{
                   if(res.code==='009'){
                     this.dataflag='000';
                     this.codeError=res.msg;
                   }else{
                     this.errorMsg=res.msg;

                     this.dataflag='111';
                   }
                 };
               })
             }
           })
         }
      },
      handleEmailChange  (value) {
        let autoCompleteResult;
        if (!value) {
          autoCompleteResult = [];
        } else {
          autoCompleteResult = ['@163.com', '@126.com', '@qq.com',
            '@gmail.com','@sina.com','@sohu.com','@live.com','@msn.com','@hotmail.com','@googlemail.com'].map(domain => `${value}${domain}`);
        }
        this.autoCompleteResult = autoCompleteResult;
      },

      checkAccount(rule, value, callback){
        this.mobile=null;
        this.phoneErr='';
        if(!value){
          callback('请输入手机号');
        }
        else {
          if(!isOnlyMobile(value)){
            callback('手机号输入格式不正确')
          }else{
            callback();
            this.mobile=value;
          }
        }
      },
      checkName(rule, value, callback){
        if(!value){
          callback('请输入姓名')
        }
        else {
          if(!isOnlyMobile(value)){
            callback('姓名输入格式不正确')
          }else{
            callback();
          }
        }
      },
      async assignCode(rule, value, callback){
        this.codeError='';
        let mobile= this.formData.getFieldValue('phoneNumber');
     if(!value){
          callback('请输入验证码');
          //验证码验证
        }
        else    if(!mobile){
       callback('请获取正确的验证码');
               }
     else {
        await  this.$ajax('/chechcode','GET',{phoneNumber:mobile,code:value,type:'register'}).then(res=>{
          res=res.data;
          if(res.code==='001'){
            callback();
          }else{
            callback(res.msg);
          }
        })
        }
      },
      validPass(rule, value, callback){
        if(!value){
          callback('请输入密码')
        }
        else  if(!isPassword(value)){
          callback('密码格式不正确');
        }
        else{
          callback();
        }
      },
      handleChange(val){
        console.log(val)
      },
      setMsg(obj){
        if(obj instanceof Object){
          for(var item in obj){
            this.formData.setFieldsValue({item:obj[item]});
          }
        }

      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.formData;
        if(!value){
          callback('请再次输入密码');
        }
        if (value && value !== form.getFieldValue('password')) {
          callback('请输入相同的密码');
        } else {
          callback();
        }
      },
    },
    watch:{
      mobile(val){
        if(val&&isOnlyMobile(val)&&!this.timer){
          this.initData();
        }
        else{
          //this.resetData();
        }
      }
    },
    mounted(){


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
  .has-error{
    margin-top:5px;
  }
  .register p:not(.has-error){
    margin:0;
    line-height:0;
  }
.top-title span{
  flex:1;
}
p.small-size{
  margin-top:3px !important;
}
  .container{
    margin-top:20px;

  }
.container .title{
  text-align:center;
  font-weight:bold;
  font-size:18px;
}

</style>
