<template>
  <div class="register">
    <a-form :form="formData">
      <a-form-item >
        <a-input placeholder="请输入姓名"   v-decorator="[
           'name',
            {rules: [{max:20,message:'姓名最大长度为20个字符'},{required:true,message:'请输入姓名'}]}
        ]">
          <a-icon type="mobile"  slot="prefix"/>
        </a-input>
      </a-form-item>
      <a-form-item >
        <a-input placeholder="请输入手机号"   v-decorator="[
           'account',
            {rules: [{validator:checkAccount}]}
        ]">
          <a-icon type="mobile"  slot="prefix"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-row :gutter="8">
          <a-col :span="16">
            <a-input placeholder="请输入验证码" id="success"  v-decorator="[
          'assignCode',
            {rules: [{validator:assignCode}]}
        ]">
              <a-icon type="safety"  slot="prefix" />
            </a-input>
          </a-col>
          <a-col :span="8">
            <a-button  :type="btnType" @click="sendCode" :disabled="btnabled">{{codeText}}</a-button>
          </a-col>
        </a-row>
      </a-form-item>
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
          <a-icon type="lock"  slot="prefix"/>
        </a-input>
        <p>6-16位字母、数字或符号组成，区分大小写</p>
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
          }
        ]"
          type="password"
        >
          <a-icon type="lock"  slot="prefix"/>
        </a-input>

      </a-form-item>
      <a-form-item>
        <a-auto-complete
          v-decorator="[
          'email',
          {rules: [{
              validator: validEmail,
            }]}
        ]"
          placeholder="请输入邮箱地址"
          @change="handleEmailChange">
          <template slot="dataSource">
            <a-select-option
              v-for="email in autoCompleteResult"
              :key="email">
              {{ email }}
            </a-select-option>
          </template>
          <a-input />
        </a-auto-complete>
      </a-form-item>
      <a-form-item >
        <a-checkbox v-decorator="['agreement', {valuePropName: 'checked'}]">
          已阅读并同意
          <a href="/static" target="_blank">
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
  import {isOnlyMobile,isPassword} from '@/utils/common.js'
  export default {
    name: 'register',
    data () {
      return {
        codeText:'获取验证码',
        formData:this.$form.createForm(this),
        btnabled:true,
        btnType:'default',
        autoCompleteResult:'',
      }

    },
    components:{

    },
    methods:{
      sendCode(){

      },
      validEmail(){
      },
      handleSubmit  (e) {
        this.formData.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          };
          //提交表单
          // console.log(fieldsValue)

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
        if(!value){
          callback('请输入手机号')
        }
        else {
          if(!isOnlyMobile(value)){
            callback('手机号输入格式不正确')
          }else{
            callback();
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
      // handleChange(val){
      //   console.log(val)
      // },
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
  .register p{
    margin:0;
  }



</style>
