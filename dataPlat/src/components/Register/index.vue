<template>
  <div class="register">
    <a-form :form="formData">
      <a-form-item >
        <a-input placeholder="请输入姓名"   v-decorator="[
           'username',
            {rules: [{validator:checkName},{max:20,message:'姓名最大长度为20个字符'},{required:true,message:'请输入姓名'}],validateTrigger:['blur']},]
">
          <img slot="prefix" src="../../assets/images/name@2x.png" style="width:14px"/>
        </a-input>
      </a-form-item>
      <a-form-item :class="{'ant-form-item-with-help':errorMsg}">
        <a-input placeholder="请输入手机号"   v-decorator="['phoneNumber',
            {rules: [{validator:checkAccount}],validateTrigger:['blur'],validateFirst:true}
      ]">
          <img slot="prefix" src="../../assets/images/iphone@2x.png" style="width:14px"/>
        </a-input>
        <p class="has-error" v-show="errorMsg">{{errorMsg}}</p>
      </a-form-item>
      <a-form-item>
        <a-row :gutter="8" style="line-height:40px;">
          <a-col :span="17">
            <a-input placeholder="请输入验证码" id="success"  v-decorator="[
          'code', {rules: [{validator:assignCode}],validateTrigger:['blur']}]">
              <img slot="prefix" src="../../assets/images/yanzh@2x.png" style="width:14px"/>
            </a-input>
          </a-col>
          <a-col :span="7">
            <a-button  :type="btnType" @click="sendCode" :disabled="btnabled" style="height:40px;width:100%">{{codeText}}</a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item  class="special" >
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
          :type="psdtype"
        >
          <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
          <a v-show="psdtype==='password'" slot="suffix"  ><i class="iconfont iconxianshi"  @click="psdtype='text'"  /></a>
          <a  v-show="psdtype==='text'"  slot="suffix"  ><i class="iconfont iconxiaoshi"   @click="psdtype='password'"  /></a>
        </a-input>
        <p style="font-size:12px;"><a-icon type="info-circle" style="color:#1890ff;margin-right:3px;margin-top:6px;" theme="filled" />6-16位字母、数字或符号组成，区分大小写</p>
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
            validateTrigger:['blur']
          }
        ]"
          :type="psdtype1"
        >
          <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
          <a v-show="psdtype1==='password'" slot="suffix"  ><i class="iconfont iconxianshi"  @click="psdtype1='text'"  /></a>
          <a  v-show="psdtype1==='text'"  slot="suffix"  ><i class="iconfont iconxiaoshi"   @click="psdtype1='password'"  /></a>
        </a-input>

      </a-form-item>
      <a-form-item>
        <a-auto-complete
          style="max-height:98px"
          v-decorator="[
          'email',
          {rules: [{
              validator: validEmail,
            }],validateTrigger:['blur']}
        ]"

          @change="handleEmailChange"
        >
          <template slot="dataSource" id="register" >
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
      </a-form-item>
      <a-form-item >
        <a-checkbox v-decorator="['agreement', {valuePropName: 'checked',rules: [{
              validator: checkAgreeMent,
            }]}]" style="font-size: 12px">
          已阅读并同意
          <a href="/static/index.html" target="_blank" style="color:#1890FF;">
            PST及平台服务协议
          </a>
        </a-checkbox>
      </a-form-item>
      <a-form-item >
        <a-button  type="primary" style="width:100%" size="large" @click="handleSubmit" >注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import {isOnlyMobile,isPassword, email} from '@/utils/common.js';
  import $ from "jquery"
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
        psdtype:'password',
        psdtype1:'password',
        errorMsg:'',
        timer:''
        }


    },
    components:{

    },
    methods:{
      setColor(){
        let colors=['#ecbc27','#ced182',' #f39798','#58b788','#f48e46','#5a91c9','#fb91bd','#5bbefc','#5ae0ca'];
        let key= Math.round(Math.random()*10);
        return colors[key];
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
                  this.$message.success('发送成功');
                }
                else{
                  if(res.code==='006'){
                    this.errorMsg=res.msg;
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
              clearTimeout(this.timer);
              this.initData()
            }
          }, 1000)
        }

      },
      checkName(rule,value,callback){

        if(!value){
          callback('');
        }else if(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g .test(value)){
          callback('姓名不能输入表情');
        }
        else if(!value.trim()){
          callback('姓名不能为空')
        }
        else if(value.length>20){
          callback('姓名最大输入为20位字符')
        }
        else{
          callback();
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
      handleSubmit  (e) {
        this.formData.validateFields({firstFields:['phoneNumber']},(err, fieldsValue) => {
          if (err) {
            return;
          };
          //提交表单
         let obj=fieldsValue;
         obj.personImage=this.setColor();
          obj.password=this.$md5(obj.password);
          delete obj.repassword;
          delete obj.agreement;
          this.$ajax('register','POST',obj).then(res=>{
                  res=res.data;
                  if(res.code==='001'){
                    this.$message.success('注册成功，请登录');
                    this.$emit('gologin');
                    this.formData.resetFields();
                  }
                  else{
                    this.$message.error(res.msg);
                  };
          })
        })
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
        this.errorMsg='';
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
      async assignCode(rule, value, callback){
        let mobile= this.formData.getFieldValue('phoneNumber');
        if(!mobile){

          callback('请输入验证码');
        }else if(!value){
          callback('请输入验证码');
          //验证码验证
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
  .register p:not(.has-error){
    margin: 0;
  }
  /*.special.ant-form-item{*/
    /*margin-bottom: 10px;*/
  /*}*/



</style>
