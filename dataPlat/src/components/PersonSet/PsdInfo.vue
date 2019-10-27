<template>
  <div class="info-container">
    <div class="info-item">
      <p class="title"><span>修改密码</span></p>
      <div class="info-box">
        <a-form :form="form" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-form-item>
            <a-input
              placeholder="请输入旧密码"
              v-decorator="[
          'oldPassword',
          {
            rules: [{
              validator: validPass,
            }],
          }
        ]" :type="psdtype1">
              <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
              <a-icon type="eye"  slot="suffix"  style="cursor: pointer" @click="psdtype1='password'"  v-show="psdtype1==='text'" />
              <a-icon type="eye-invisible"  slot="suffix" style="cursor: pointer"  @click="psdtype1='text'"  v-show="psdtype1==='password'" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input placeholder="请输入新密码" v-decorator="[ 'newPassWord',{
            rules: [{
              validator: validnewPass,
            }],
          }
        ]"
              :type="psdtype2"
            >
              <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
              <a-icon type="eye"  slot="suffix"  style="cursor: pointer" @click="psdtype2='password'"  v-show="psdtype2==='text'" />
              <a-icon type="eye-invisible"  slot="suffix" style="cursor: pointer"  @click="psdtype2='text'"  v-show="psdtype2==='password'" />
            </a-input>
            <p style="margin:0;line-height:0"><a-icon type="exclamation-circle"  theme='filled' style="color:#1890ff" />6-16位字母、数字或符号组成，区分大小写</p>
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="请再次输入密码"
              v-decorator="['repassword',
          {
            rules: [{
              validator: compareToFirstPassword,
            }],
          }
        ]"
              :type="psdtype3"
            >
              <img slot="prefix" src="../../assets/images/mima@2x.png" style="width:14px"/>
              <a-icon type="eye"  slot="suffix"  style="cursor: pointer" @click="psdtype3='password'"  v-show="psdtype3==='text'" />
              <a-icon type="eye-invisible"  slot="suffix" style="cursor: pointer"  @click="psdtype3='text'"  v-show="psdtype3==='password'" />
            </a-input>
          </a-form-item>
          <div class="action-box">
            <a-button @click='submit' type="primary" style="width:100%">提交</a-button>
          </div>

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
            delete fieldsValue.repassword;
            //提交表单
            this.$ajax('bomextract/user/modifypassword','POST',fieldsValue).then(res=>{
                res=res.data;
                if(res.code==='001'){
                  // 更新数据
                  this.$message.success('修改成功！');
                  this.$store.state.isLogin=false;
                  this.$router.push('/login');
                  this.$message.warning('请先登录');

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
    padding:0 2rem;
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
