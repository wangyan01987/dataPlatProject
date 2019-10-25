<template>
  <div class="register">
    <a-form :form="formData">
     <div v-show="dataflag==='000'">
       <a-form-item >
         <a-input placeholder="请输入姓名"
                  v-decorator="[
           'username',
            {rules: [{max:20,message:'姓名最大长度为20个字符'},{required:true,message:'请输入姓名'}],validateTrigger:['change','blur']}
        ]">
           <img slot="prefix" src="../../assets/images/name@2x.png" style="width:14px"/>
         </a-input>
       </a-form-item>
       <a-form-item >
         <a-input placeholder="请输入手机号"   v-decorator="['phoneNumber',
            {rules: [{validator:checkAccount}],validateTrigger:['change','blur'],validateFirst:true}
      ]">
           <img slot="prefix" src="../../assets/images/iphone@2x.png" style="width:14px"/>
         </a-input>
       </a-form-item>
       <a-form-item>
         <a-row :gutter="8">
           <a-col :span="15">
             <a-input placeholder="请输入验证码" id="success"   v-decorator="[
          'code',
            {rules: [{validator:assignCode}],validateTrigger:['change','blur']}
        ]">
               <img slot="prefix" src="../../assets/images/yanzh@2x.png" style="width:14px"/>
             </a-input>
           </a-col>
           <a-col :span="7">
             <a-button  :type="btnType" @click="sendCode" :disabled="btnabled">{{codeText}}</a-button>
           </a-col>
         </a-row>
       </a-form-item>
       <a-form-item>
         <a-auto-complete
           v-decorator="[
          'email',
          {rules: [{
              validator: validEmail,
            }],validateTrigger:['change','blur']}
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

           <a-input placeholder="请输入邮箱地址（选填）" >
             <img slot="prefix" src="../../assets/images/youxiang@2x.png" style="width:14px"/>
           </a-input>
         </a-auto-complete>
       </a-form-item>
       <a-form-item >
         <a-checkbox v-decorator="['agreement', {valuePropName: 'checked',rules: [{
              validator: checkAgreeMent,
            }]}]">
           已阅读并同意
           <a href="/static" target="_blank">
             PST及平台服务协议
           </a>
         </a-checkbox>
       </a-form-item>
     </div>
      <div v-show="dataflag==='111'">
        <a-form-item>
          <a-input
            placeholder="请输入密码"
            v-decorator="[
          'password',
          {
            rules: [{
              validator: validPass,
            }],
          }
        ]"
            type="password"
          >
            <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
          </a-input>
          <p><a-icon type="exclamation-circle" style="color:#1890ff" theme="filled" />6-16位字母、数字或符号组成，区分大小写</p>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="请再次输入密码"
            v-decorator="[
          'repassword',
          {
            rules: [{
              validator: compareToFirstPassword,
            }],
            validateTrigger:['change','blur']
          }
        ]"
            type="password"
          >
            <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
          </a-input>

        </a-form-item>
      </div>
      <a-form-item >
        <a-button  type="primary" style="width:100%"  @click="handleSubmit(0)"  v-if="dataflag==='000'">下一步</a-button>
      <div v-else style="margin-top:8.4%;">
        <a-button  type="primary" style="width:100%"  @click="handleSubmit(1)" >注册</a-button>
         <div style="text-align:right;"> <a style="color:#1890ff;text-decoration: underline" @click="dataflag='000'">返回上一步</a></div>
      </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import {isOnlyMobile,isPassword, email} from '@/utils/common.js';
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
        dataflag:'000'
      }

    },
    components:{

    },
    methods:{
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
        this.$ajax('sendsms','POST',{type:'register',phoneNumber:mobile}).then(res=>{
          res=res.data;
          if(res.code==='001'){
            this.$message.success('发送成功');
          }
          else{
            this.$message.error(res.msg);
          }
        });
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
              this.codeText = `重新获取${this.count}s`;
              this.btnabled = true;
              this.btnType = 'default';
            } else {
              this.initData()
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
           this.formData.validateFields(['username','phoneNumber','code','email','agreement'],{firstFields:['phoneNumber']},(err, fieldsValue) => {
             if (err) {
               return;
             };
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
               delete obj.repassword;
               delete obj.agreement;
               this.$ajax('register','POST',obj).then(res=>{
                 res=res.data;
                 if(res.code==='001'){
                   this.$message.success('注册成功，请登录');
                   this.formData.resetFields();
                 }
                 else{
                   this.$message.error(res.msg)
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
          autoCompleteResult = ['@163.com', '@126.com', '@qq.com'].map(domain => `${value}${domain}`);
        }
        this.autoCompleteResult = autoCompleteResult;
      },

      checkAccount(rule, value, callback){
        this.mobile=null;
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
      assignCode(rule, value, callback){
        if(!value){
          callback('请输入验证码');
          //验证码验证
        }
        else {
          callback();
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
        if(val){
          this.initData();
        }
        else{
          this.resetData();
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
  .register p{
    margin:0;
    line-height:0;
  }



</style>
