<template>
  <div class="info-container register">
    <div class="info-item">
      <p class="title"><span>修改密码</span></p>
      <div class="info-box">
        <a-form :form="form" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-form-item>
            <a-input
              maxlength="17"
              placeholder="请输入旧密码"
              v-decorator="[
          'oldPassword',
          {
            rules: [{
              validator: validPass,
            }],
              validateTrigger:['blur']
          }
        ]" :type="psdtype1">
              <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
              <a v-show="psdtype1==='password'" slot="suffix"  ><i class="iconfont iconxianshi"  @click="psdtype1='text'"  /></a>
              <a  v-show="psdtype1==='text'"  slot="suffix"  ><i class="iconfont iconxiaoshi"   @click="psdtype1='password'"  /></a>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input   maxlength="16"  placeholder="请输入新密码" v-decorator="[ 'newPassWord',{
            rules: [{
              validator: validnewPass,
            }],
            validateTrigger:['blur']
          }
        ]"
              :type="psdtype2"
            >
              <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
              <a v-show="psdtype2==='password'" slot="suffix"  ><i class="iconfont iconxianshi"  @click="psdtype2='text'"  /></a>
              <a  v-show="psdtype2==='text'"  slot="suffix"  ><i class="iconfont iconxiaoshi"   @click="psdtype2='password'"  /></a>
            </a-input>
            <p style="margin:3px 0 0 0;line-height:0;font-size:12px;">
              <a-icon type="info-circle" style="color:#1890ff;margin-right:3px;" theme="filled" />6-16位字母、数字或符号组成，区分大小写</p>
          </a-form-item>
          <a-form-item>
            <a-input   maxlength="16"
              placeholder="请再次输入密码"
              v-decorator="['repassword',
          {
            rules: [{
              validator: compareToFirstPassword,
            }],
            validateTrigger:['blur']
          },

        ]"
              :type="psdtype3"
            >
              <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
              <a v-show="psdtype3==='password'" slot="suffix"  ><i class="iconfont iconxianshi"  @click="psdtype3='text'"  /></a>
              <a  v-show="psdtype3==='text'"  slot="suffix"  ><i class="iconfont iconxiaoshi"   @click="psdtype3='password'"  /></a>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button @click='submit' type="primary" style="width:100%">提交</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
  import ResetPhone from './ResetPhone.vue'
  import {isPassword} from '@/utils/common.js'
  export default {
    name: "PersonInfo",
    components:{ResetPhone},
    data(){
      const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 },
        wrapperCol1: { span: 16 },
      };
      const formTailLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8, offset: 4 },
      };
      return{
        psdtype1:'password',
        psdtype2:'password',
        psdtype3:'password',
        visible:false,
        formItemLayout: formItemLayout,
        formTailLayout,
        form: this.$form.createForm(this),
      }

    },
    methods:{
      validnewPass(rule, value, callback){
        if(!value){
          callback('请输入新密码')
        }
        else if(value.length>16){
          callback('密码最大为16位');
        }
        else if(!isPassword(value)){
          callback('密码格式不正确');
        }
        else{
          callback();
        }
      },
      validPass(rule, value, callback){
        if(!value){
          callback('请输入密码')
        }
        else if(value.length>16){
          callback('密码最大为16位');
        }
        else if(!isPassword(value)){
          callback('密码格式不正确');
        }

        else{
          callback();
        }
      },
      compareToFirstPassword(rule, value, callback) {
        const form = this.form;
        if (!value) {
          callback('请再次输入密码');
        }
        else {
          if (value !== form.getFieldValue('newPassWord')) {
            callback('两次输入密码不一致');
          }
          else {
            callback();
          }

        }
      },
      submit(){
          this.form.validateFields((err, fieldsValue) => {
            if (err) {
              return;
            };
            fieldsValue.newPassWord=this.$md5(fieldsValue.newPassWord);
            fieldsValue.oldPassword=this.$md5(fieldsValue.oldPassword);
            delete fieldsValue.repassword;
            //提交表单
            this.$ajax('bomextract/user/modifypassword','POST',fieldsValue).then(res=>{
                res=res.data;
                if(res.code==='001'){
                  // 更新数据
                  this.$message.success('修改成功，请重新登录',5);
                  this.$store.state.isLogin=false;
                  this.$router.push('/login');
                  // 重新登录
                }
                else{
                  this.$message.error(res.msg);
                }
          })
          })
        },

      cancel(){
        this.form.resetFields();
        this.isEditor=false;
      }
    }
  }
</script>

<style scoped>
  .info-container{
    width:100%;
    height:100%;
    text-align:left;
    padding-bottom: 0.2rem;
  }
  .info-item{
    width:7.4rem;
    background-color: #ffffff;
    border: solid 1px #d9d9d9;
    margin:0.2rem auto;
    margin-top:0
  }
  .info-item .title{
    font-size:16px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 53px;
    margin:0;
    border-bottom: 1px solid  rgba(0, 0, 0, 0.1);
    padding:0 0.2rem;
  }
  .info-box{
    padding:24px 180px;

  }
  .action-box{
    text-align:right;
    padding:0.16rem 0.24rem;
  }
  .action{
    color: #1890ff;
    cursor:pointer;
  }
  .editor{
    float:right;
    cursor:pointer;
    color: #1890ff;
  }
</style>
