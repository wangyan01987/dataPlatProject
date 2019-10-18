<template>
  <div class="register">
    <a-form :form="formData">

      <a-form-item >
        <a-input placeholder="请输入手机号"   v-decorator="[ 'account',
            {rules: [{validator:checkAccount}]}
        ]">
          <img slot="prefix" :src='require("../../assets/images/iphone@2x.png")' style="width:14px"/>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-row :gutter="8">
          <a-col :span="16">
            <a-input placeholder="请输入验证码" id="success"  v-decorator="[ 'assignCode',{rules: [{validator:assignCode}]}]">
              <img slot="prefix" src="../../assets/images/yanzh@2x.png" style="width:14px"/>
            </a-input>
          </a-col>
          <a-col :span="8">
            <a-button  :type="btnType" @click="sendCode" :disabled="btnabled">{{codeText}}</a-button>
          </a-col>
        </a-row>
      </a-form-item>

      <!--<div class="action-box">-->
        <!--<a-button  type="default"  @click="cancel" >取消</a-button>-->
        <!--<a-button  type="primary"   @click="handleSubmit" >确定</a-button>-->
      <!--</div>-->
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

      handleSubmit  (e) {
        this.formData.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          };
          //提交表单
          console.log(fieldsValue)
        })
      },
      cancel(){

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
            this.initData();
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
  .register p{
    margin:0;
    line-height:0;
  }
  .action-box{
    text-align:right;
  }



</style>
