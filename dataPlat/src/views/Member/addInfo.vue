<template>
    <div class="member">
      <a-form :form="form">
              <a-form-item v-for="(k,index) in form.getFieldValue('keys')" :key="k" :required="false">
                <a-input v-if="flagName==='手机号'"
                v-decorator="[`names[${k}]`,
              {
                validateTrigger:['blur'],
                rules:[{
                required:true,
                whitespace:true,
                message:`请输入${flagName}或者删除该字段`
                },
                {validator:checkMethods}
                ]
                }
                ]"
                :placeholder="`请输入${flagName}(*必填)`"
                style="margin-right:8px;width:60%;"
                />
                <a-auto-complete  @search="handleSearch" placeholder="请输入邮箱" :max="30"
                                 v-decorator="[`names[${k}]`,
              {
                validateTrigger:['change','blur'],
                rules:[{
                required:true,
                whitespace:true,
                message:`请输入${flagName}或者删除该字段`
                },
                {validator:checkMethods}
                ]
                }
                ]" :placeholder="`请输入${flagName}(*必填)`" style="margin-right:8px;width:60%;" v-else>
                  <template slot="dataSource">
                    <a-select-option v-for="email in result" :key="email">{{email}}</a-select-option>
                  </template>
                </a-auto-complete>
                <a-icon
                  v-if="form.getFieldValue('keys').length > 1"
                  class="dynamic-delete-button"
                  type="delete"
                  :disabled="form.getFieldValue('keys').length === 1"
                  @click="() => remove(k)"
                />

              </a-form-item>
      </a-form>
      <p class="action"><span @click="add">添加</span></p>
    </div>
</template>

<script>
  import {isOnlyMobile,email} from '@/utils/common.js'

    export default {
        name: "addInfo",
      props:['dataflag'],
      data(){
        let id=1;
          return{
               id,
            result:[]
          }
      },
      computed:{
          flagName(){
            return  this.dataflag==='002'?'手机号':'邮箱';
          }
      },
      methods:{
        handleSearch(value) {
          let result;
          if (!value || value.indexOf('@') >= 0) {
            result = [];
          } else {
            result = ['@163.com', '@126.com', '@qq.com',
              '@gmail.com','@sina.com','@sohu.com','@live.com','@msn.com','@hotmail.com','@googlemail.com'
            ].map(domain => `${value}${domain}`);
          }
          this.result = result;
        },
          checkMethods(rule, value, callback){
               if(this.dataflag==='002'){
                 this.checkAccount(rule, value, callback);

               }else{
                this.checkEmail(rule, value, callback);
               }
          },
        checkEmail(rule, value, callback){
          if(!value){
           callback()
          }else{
            if(!email(value)){
              callback('邮箱输入格式不正确')
            }else if(value.length>255){
               callback('超出字符限制255')
            }
            else{
              callback();
              this.initData();
            }
          }
        },
        checkAccount(rule, value, callback){
          if(!value){
            callback()
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
          remove(k){
             const {form}=this;
            const keys=form.getFieldValue('keys');
            if(keys.length===1){
              return;
            }
           // this.id--;
            form.setFieldsValue({
              keys:keys.filter(item=>item!==k)
            })
          },
        add(){
          const {form}=this;   //form=this.form
           const keys=form.getFieldValue('keys');
           if(keys.length>=10){
             this.$message.error(`当前页面有效${this.flagName}超出剩余额度`);
             return;
           }
           const nextKeys=keys.concat(++this.id);
           console.log(nextKeys)
           form.setFieldsValue({
             keys:nextKeys
           });
        },
        handleSubmit (e) {
          this.form.validateFields((err, values) => {
            if (!err) {
               //发送邀请
               let url;
              let link=this.$parent.urlInfo;
              let data=values.names.filter(item=>item!=null);
              let projectName=this.$store.state.projectName;
                    if(this.dataflag==='001'){
                  url='bomextract/buildmember/inviteemail';
                  this.$ajax(url,'POST',{link:link,projectName:projectName,emails:data}).then(res=>{
                         if(res.data.code==='001'){
                           this.$message.success('邀请成功',5);
                         }else{
                            this.$message.error(res.data.msg);
                         }
                  })
                }else{
                  url='bomextract/buildmember/invitesms';
                  this.$ajax(url,'POST',{link:link,projectName:projectName,phones:data}).then(res=>{
                    if(res.data.code==='001'){
                      this.$message.success('邀请成功',5);
                    }
                    else{
                      this.$message.error(res.data.msg);
                    }
                  })
                };

            }
          });
        }
      },
      beforeCreate(){
        this.form = this.$form.createForm(this);
        this.form.getFieldDecorator('keys', {initialValue: [1], preserve: true });
      }
    }
</script>

<style scoped>
  .action span{
    cursor:pointer;
    text-decoration: underline;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0px;
    color: #1890ff;
    text-align:left;
  }
  .dynamic-delete-button:hover {
    color: red;
  }
</style>
