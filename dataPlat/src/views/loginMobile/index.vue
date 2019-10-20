<template>
<div class="container">
  <a-form :form="formData" >
    <a-form-item >
      <a-input placeholder="请输入手机号"   v-decorator="[
           'username',
            {rules: [{validator:checkName}]}
        ]"  class="test">
        <img slot="prefix" src="../../assets/images/iphone@2x.png" style="width:14px"/>
      </a-input>
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
        ref="phone" class="test">
        <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
      </a-input>

    </a-form-item>
    <a-button @click='submit' type="primary" style="width:100%" size="large">登录</a-button>
  </a-form>
</div>
</template>

<script>
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
      }

    },
    components:{},
    methods:{
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
      assignCode(rule, value, callback){
        if(!value){
          callback('请输入验证码');
          //验证码验证
        }
        else if(value!==this.identifyCode.toLowerCase()){
          callback('验证码不正确');
        }
        else {
          callback();
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
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)

    }
  }
</script>


<style scoped>
   .container{
     height:100%;
     width:100%;
        background-image: url("../../assets/images/bg-dl@2x.png");
   }
</style>
