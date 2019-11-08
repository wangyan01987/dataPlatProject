<template>
  <div class="hello">
    <a-form :form="formData" >
      <a-form-item >
        <a-input placeholder="请输入手机号"   v-decorator="[
           'phoneNumber',
            {rules: [{validator:checkName}],validateTrigger:['blur']}
        ]">
          <img slot="prefix" src="../../assets/images/iphone@2x.png" style="width:14px"/>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-row :gutter="8">
          <a-col :span="16">
            <a-input placeholder="请输入验证码" id="success"  v-decorator="['code',
            {rules: [{validator:assignCode}],validateTrigger:['blur']}]">
              <img slot="prefix" src="../../assets/images/yanzh@2x.png" style="width:14px"/>
            </a-input>
          </a-col>
          <a-col :span="8">
           <a-button  :type="btnType" @click="sendCode" :disabled="btnunabled" style="height:40px">{{codeText}}</a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <p class="error-msg">{{errorMsg}}</p>
      <a-button @click='submit' type="primary" style="width:100%;margin-bottom: 10px;margin-top: 30px;" size="large">登录</a-button>

    </a-form>

  </div>
</template>

<script>
  import {isOnlyMobile} from '@/utils/common.js'
  export default {
    name: 'login',
    data () {
      const formTailLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8, offset: 4 },
      };
      return {
        formTailLayout,
        formData:this.$form.createForm(this),
        arr:[1,2,3],
        btnType:'default',
        codeText:'获取验证码',
        errorMsg:'',
        mobile:'',
        btnunabled:true

      }

    },
    computed:{
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
    methods:{
      initData(){
         this.codeText='获取验证码';
        this.btnunabled = false;
         this.btnType='primary'
      },
      resetData(){
        this.codeText='获取验证码';
        this.btnunabled = true;
        this.btnType='default'
      },

      sendCode(){
        //获取验证码
         //发送请求

        const TIME_COUNT = 60;

        this.$ajax('sendsms','POST',{"phoneNumber":this.mobile, "type":"login"}).then(res=>{
           res=res.data;
          if(res.code==='001'){
               this.$message.success('发送成功')
          }
          else{
            this.$message.error(res.msg);
          }
        });
        this.timer='';
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
              this.codeText = `重新获取${this.count}s`;
              this.btnunabled = true;
              this.btnType = 'default';
            } else {
              this.initData()
            }
          }, 1000)
        };

      },

      checkName(rule, value, callback){
        this.mobile=null;
        if(!value){
          callback('请输入手机号')
        }
        else {
          if(!isOnlyMobile(value)){
            callback('手机号输入格式不正确')
          }else{
            this.mobile= this.formData.getFieldValue('phoneNumber');
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
          this.$ajax('loginbycaptcha','POST',obj,'form').then(res=>{
            res=res.data;
                      if(res.code==='001'){
                        let msg=this.$route.query.msg;
                        this.$message.success('登录成功',5);
                        this.$store.commit('setLogin',true);
                        this.$store.commit('setPhone',fieldsValue.phoneNumber);
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
                        else if(msg){
                          this.$router.push('/joinSuccesstext');
                        }
                        else{
                          //跳转到主页
                          this.$router.push('/home');
                        }
                      }
                      else{
                        this.$message.error(res.msg);
                        // this.errorMsg='手机号或验证码错误';
                        // document.querySelectorAll('.ant-input-affix-wrapper .ant-input')[3].style.cssText='border:1px solid red';
                        // document.querySelectorAll('.ant-input-affix-wrapper .ant-input')[4].style.cssText='border:1px solid red'
                      }
          });

        })
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
  .error-msg{
    text-align: left;
    height: 17px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #f5222d;
  }


</style>
