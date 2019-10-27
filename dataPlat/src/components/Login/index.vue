<template>
  <div class="register">
    <a-form :form="formData" >
      <a-form-item >
        <a-input placeholder="请输入手机号"   v-decorator="[
           'username',
            {rules: [{validator:checkName}],validateTrigger:['blur']}
        ]"  class="test">
          <img slot="prefix" src="../../assets/images/iphone@2x.png" style="width:14px"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-row :gutter="8">
          <a-col :span="16">
            <a-input placeholder="请输入验证码" id="success"  v-decorator="[
          'assignCode',
            {rules: [{validator:assignCode}],validateTrigger:['blur']}
        ]">
              <img slot="prefix" src="../../assets/images/yanzh@2x.png" style="width:14px"/>
            </a-input>

          </a-col>
             <a-col :span="6">
               <s-identify :identifyCode="identifyCode"></s-identify>
             </a-col>
          <a-col :span="2">
            <span><a-icon type="redo" @click="refreshCode"  /></span>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item>
        <a-input
          ref="password"
          :type="psdtype"
          placeholder="请输入密码"
          v-decorator="[
          'password',
          {
            rules: [{
              validator: validPass,
            }],
          }
        ]" >
          <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
          <a-icon type="eye"  slot="suffix"  style="cursor: pointer" @click="show('psd')"  v-show="psdtype==='text'" />
          <a-icon type="eye-invisible"  slot="suffix" style="cursor: pointer"  @click="show()"  v-show="psdtype==='password'" />
        </a-input>
      </a-form-item>
      <a-button @click='submit' type="primary" style="width:100%" size="large">登录</a-button>
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
        psdtype:'password',
        formTailLayout,
        formData:this.$form.createForm(this),
        identifyCodes: '1234567890ABCDEFKsdefb',
        identifyCode:''

      }

    },
    components:{
      SIdentify
    },
    methods:{
      show(str){
       if(!str){
         this.psdtype='text'
       }
       else{
         this.psdtype='password'
       }
      },
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
                  //判断是否需要跳到joinSuccess
                  let code=this.$route.query.code;
                  if(code){
                    //解析code
                    this.$ajax('bomextract/buildmember/getinvitparam','GET',{code:code}).then(res=>{
                      res=res.data;
                      if(res.code==='001'){
                        let projectId=res.data.projectId;
                        this.$ajax('bomextract/buildmember/acceptinvitation','GET',{projectId:projectId}).then(res=>{
                          res=res.data;
                          if(res.code==='001'){
                            this.$message.success(res.msg);
                            this.$router.push({name:'joinSuccess',query:{code:code}});
                          }
                          else{
                            this.$message.error(res.msg);
                            this.$router.push({name:'joinSuccess',query:{code:code}});
                          }
                        });
                      }

                    });
                  }
                  else{
                    //跳转到主页
                    this.$router.push('/home');
                  }
                }
                else{
                  this.$message.error(res.msg);
                }
          })
        })
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

      }
    },
    mounted(){
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)

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
