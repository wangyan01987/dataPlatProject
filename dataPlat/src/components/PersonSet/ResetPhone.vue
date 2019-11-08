<template>
  <div class="register">
    <a-form :form="formData">
      <a-form-item :class="{'ant-form-item-with-help':errorMsg}">
        <a-input placeholder="请输入手机号"  autocomplete="off"  v-decorator="[ 'phoneNumber',
            {rules: [{validator:checkAccount}],validateTrigger:['blur']}
        ]">
          <img slot="prefix" :src='require("../../assets/images/iphone@2x.png")' style="width:14px"/>

        </a-input>
        <p class="has-error" v-show="errorMsg">{{errorMsg}}</p>
      </a-form-item>
      <a-form-item :class="{'ant-form-item-with-help':allError}">
        <a-row :gutter="8">
          <a-col :span="18">
            <a-input placeholder="请输入验证码" id="success"  v-decorator="[ 'code',{rules: [{validator:assignCode}],validateTrigger:['blur']}]" autocomplete="off">
              <img slot="prefix" src="../../assets/images/yanzh@2x.png" style="width:14px"/>
            </a-input>
          </a-col>
          <a-col :span="6">
            <a-button  :type="btnType" @click="sendCode" :disabled="btnabled" style="width:100%;height:40px;">{{codeText}}</a-button>
          </a-col>
        </a-row>
        <p class="has-error" v-show="allError">{{allError}}</p>
      </a-form-item>

    </a-form>

  </div>
</template>

<script>
  import {isOnlyMobile} from '@/utils/common.js'
  export default {
    name: 'ForgetPsd',
    data () {
      return {
        codeText:'获取验证码',
        formData:this.$form.createForm(this),
        btnabled:true,
        btnType:'default',
        autoCompleteResult:'',
        errorMsg:'',
        isCount:false,
        timer:'',
        allError:''
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
      sendCode(){
        //获取验证码
        //发送请求
        let mobile= this.formData.getFieldValue('phoneNumber');
        this.$ajax('sendsms','POST',{type:'mdfpwd',phoneNumber:mobile}).then(res=>{
          res=res.data;
          if(res.code==='001'){
            this.$message.success('发送成功');
          }
          else if(res.code==='006'){
            this.errorMsg=res.msg;
          }

        });
        this.timer='';
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
          //提交表单
          this.$ajax('bomextract/user/modifyphone','POST', fieldsValue).then(res=>{
            res = res.data;
            if(res.code==='001'){
                  // 更新数据
              this.allError='';
                  this.$message.success('修改成功！');
                  //
                  this.$parent.phoneNumber=fieldsValue.phoneNumber;
                  this.$parent.visible=false;
                }
                else{
                  this.allError=res.msg;
                  }

        })
        })
      },
      checkAccount(rule, value, callback){
        this.errorMsg='';
        if(!value){
          callback('请输入手机号')
        }
        else {
          if(!isOnlyMobile(value)){
            callback('手机号输入格式不正确')
          }else{
            callback();
          if(!this.timer){
            this.initData();
          }

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

      setMsg(obj){
        if(obj instanceof Object){
          for(var item in obj){
            this.formData.setFieldsValue({item:obj[item]});
          }
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
  .register p:not(.has-error){
    margin:0;
    line-height:0;
  }
  .action-box{
    text-align:right;
  }



</style>
