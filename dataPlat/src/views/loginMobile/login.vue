<template>
  <div class="register-mobile">
    <a-form :form="formData" >
      <a-form-item >
        <a-input placeholder="请输入手机号" size="large"  v-decorator="[
           'username',
            {rules: [{validator:checkName}]}
        ]"  class="test">
          <img slot="prefix" src="../../assets/images/iphone@2x.png" style="width:14px"/>
        </a-input>
      </a-form-item>
      <a-form-item style="margin-top:6.8%;">
        <a-input
          placeholder="请输入密码"
          size="large"
          v-decorator="[
          'password',
          { rules: [{
              validator: validPass,
            }],
          }
        ]"
          type="password"
          ref="phone" class="test">
          <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
        </a-input>
      </a-form-item>
     <a-form-item>
       <a-button @click='submit' type="primary" style="width:100%;margin-top:20px;" size="large">登录</a-button>
     </a-form-item>
    </a-form>


  </div>
</template>

<script>
  import SIdentify from '@/components/identify'
  import {isOnlyMobile} from '@/utils/common.js'
  export default {
    name: 'HelloWorld',
    data () {

      const formTailLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8, offset: 4 },
      };
      return {
        formTailLayout,
        formData:this.$form.createForm(this),
        identifyCodes: '1234567890ABCDEFJKhfhg',
        identifyCode:''

      }

    },
    components:{
      SIdentify
    },
    methods:{
      randomNum (min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      refreshCode () {
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
      },
      makeCode (o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
        }
      },

      checkName(rule, value, callback){
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
      validPass(rule, value, callback){
        if(!value){
          callback('请输入密码')
        }
        else {
          callback();
        }
      },
      submit(){
        this.formData.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          };

          //提交表单
          let obj=fieldsValue;
          delete obj.assignCode;
          this.$ajax('loginbypwd','POST',obj,true).then(res=>{
            res=res.data;
            if(res.code==='001'){
              this.$message.success('登录成功！');
              this.$store.commit('setLogin',true);
              this.$store.commit('setPhone',fieldsValue.username);
              //跳转到主页
              this.$router.push('/home');
            }
            else{
              this.$message.error(res.msg);
            }
          })
        })
      },

      setMsg(obj){
        if(obj instanceof Object){
          for(var item in obj){
            this.formData.setFieldsValue({item:obj[item]});
          }
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


</style>
