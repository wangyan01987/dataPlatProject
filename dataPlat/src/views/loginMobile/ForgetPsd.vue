<template>
  <div class="register">
    <a-form :form="formData">
      <a-form-item :class="{'ant-form-item-with-help':errorphone}">
        <a-input placeholder="请输入手机号" size="large"   v-decorator="[
           'phoneNumber',
            {rules: [{validator:checkAccount}],validateTrigger:['blur']}
        ]">
          <img slot="prefix" src="../../assets/images/iphone.png" style="width:14px"/>
        </a-input>
        <p class="has-error" v-show="errorphone">{{errorphone}}</p>
      </a-form-item>
      <a-form-item :class="{'ant-form-item-with-help':codeErr}">
        <a-row :gutter="8">
          <a-col :span="15">
            <a-input placeholder="请输入验证码"  size="large" v-decorator="[ 'code',
            {rules: [{validator:assignCode}],validateTrigger:['blur']}
        ]">
              <img slot="prefix" src="../../assets/images/yanzh.png" style="width:14px"/>
            </a-input>
            <p class="error-msg">{{codeErr}}</p>
          </a-col>
          <a-col :span="9">
            <a-button  :type="btnType" @click="sendCode" :disabled="btnabled" style="height:40px;font-size:16px;width:100%">{{codeText}}</a-button>
          </a-col>
        </a-row>
      </a-form-item>
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
          <img slot="prefix" src="../../assets/images/mima.png" style="width:14px"/>
          <a v-show="psdtype==='password'" slot="suffix"  ><i class="iconfont iconxianshi"    @click="psdtype='text'"  /></a>
          <a  v-show="psdtype==='text'"  slot="suffix"  ><i class="iconfont iconxiaoshi"    @click="psdtype='password'" /></a>
        </a-input>
        <p style="margin-top:3px"><a-icon type="info-circle" style="color:#1890ff;margin-right:5px;" theme="filled" />6-16位字母、数字或符号组成，区分大小写</p>
      </a-form-item>
      <a-form-item>
        <a-input
          placeholder="请再次输入密码"
          size="large"
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
          <img slot="prefix" src="../../assets/images/mima.png" style="width:14px"/>
          <a v-show="psdtype1==='password'" slot="suffix"  ><i class="iconfont iconxianshi"    @click="psdtype1='text'"  /></a>
          <a  v-show="psdtype1==='text'"  slot="suffix"  ><i class="iconfont iconxiaoshi"    @click="psdtype1='password'" /></a>
        </a-input>
        <p class="has-error" v-show="errorMsg">{{errorMsg}}</p>
      </a-form-item>
      <a-form-item >
        <a-button  type="primary" style="width:100%" size="large" @click="handleSubmit" >提交</a-button>
      </a-form-item>
    </a-form>

  </div>
</template>

<script>
  import {isOnlyMobile,isPassword} from '@/utils/common.js'
  export default {
    name: 'ForgetPsd',
    data () {
      return {
        codeText:'获取验证码',
        formData:this.$form.createForm(this),
        btnabled:true,
        btnType:'default',
        autoCompleteResult:'',
        mobile:'',
        psdtype1:'password',
        psdtype:'password',
        errorMsg:'',
        codeErr:'',
        errorphone:'',
        timer:''
      }

    },
    watch:{
      mobile(val){
        if(val&&!this.timer){
          this.initData()
        }else{
         // this.resetData();
        }
      }
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
        this.$ajax('sendsms','POST',{type:'modifyPwd',phoneNumber:mobile}).then(res=>{
          res=res.data;
          if(res.code==='001'){
            this.errorphone='';
            this.$message.success('发送成功');
          }
          else{
            if(res.code==='005'){
              this.errorphone=res.msg;
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
              clearTimeout(this.timer);
              this.initData()
            }
          }, 1000)
        }

      },

      handleSubmit  (e) {
        this.formData.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          };
          let obj=fieldsValue;
          obj.password=this.$md5(obj.password);
           delete obj.repassword;
          //提交表单
          this.$ajax('bomextract/user/retrievepwd','POST',fieldsValue).then(res=>{
                 res=res.data;
            if(res.code==='001'){
              this.errorMsg='';
              this.codeErr='';
                this.$emit('changePsd',true);
            }
            else{
                if(res.code==='008'){
                  this.codeErr=res.msg;
                }
                else{
                  this.errorMsg=res.msg;
                }

            }
          })
        })
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
        this.errorphone='';
        if(!value){
          callback('请输入手机号')
        }
        else {
          if(!isOnlyMobile(value)){
            callback('手机号输入格式不正确')
          }else{
            callback();
            this.mobile=this.formData.getFieldValue('phoneNumber');
          }
        }
      },
      async assignCode(rule, value, callback){
        let mobile= this.formData.getFieldValue('phoneNumber');
        if(!mobile){
          callback('请输入手机号，获取验证码');
        }else if(!value){
          callback('请输入验证码');
          //验证码验证
        }
        else{
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
          callback('两次输入密码不一致');
        } else {
          callback();
        }
      },
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
  .register .has-error{
   margin-top:5px;
  }
  .register p{
    margin:0;
  }



</style>
