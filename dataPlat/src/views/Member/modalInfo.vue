<template>
<div class="modal-container">
  <!--默认链接邀请 000-->
  <div class="modal-item" v-show="dataflag==='000'">
     <div class="item-body">
        <div class="item-title">
          <p>通过微信扫码，邀请成员</p>
          <div id="qrCode" ref="qrCodeDiv"></div>
        </div>
       <div>
          <p class="action"><span @click="toEmail" >邮箱邀请</span><span @click="toPhone">手机号邀请</span></p>
       </div>
     </div>
    <div class="item-footer">
      <p>通过发送链接，邀请成员</p>
       <div><a-input style="margin-right:5px;width:290px;" v-model="urlInfo"></a-input> <a-button type="primary" @click="copyUrl(urlInfo)">复制链接</a-button></div>
    </div>
  </div>
  <!--邮箱邀请 001-->
  <!--手机号邀请002-->
  <div class="modal-item" v-if="dataflag!=='000'">
    <div class="item-body">
      <div class="item-title" v-if="dataflag==='001'">
        <p>通过邮箱邀请项目组成员</p>
        <p >今日可邀请次数{{emailLimitNum}}</p>
      </div>
      <div class="item-title" v-else>
        <p>通过手机号邀请项目组成员</p>
      </div>
      <div>
        <p class="action" v-if="dataflag==='001'"><span @click="toPhone" >手机号邀请</span><span @click="toUrl">链接邀请</span></p>
        <p class="action" v-else><span @click="toEmail" >邮箱邀请</span><span @click="toUrl">链接邀请</span></p>
      </div>
    </div>
    <div class="item-info" >
      <add-info  ref="mobileInfo" :dataflag="dataflag" :key="dataflag" @stateCount="changeCount" :emailLimitNum="emailLimitNum" :mobilelimitNumber="mobilelimitNumber"></add-info>
    </div>

    <div class="item-info">
      <a-button type="primary"  @click="sendCode(dataflag)" style="width:112px">发送邀请</a-button>
    </div>
  </div>
</div>
</template>

<script>
  import AddInfo from './addInfo';
  import QRCode from 'qrcodejs2';
    export default {
        name: "modalInfo",
      components:{AddInfo},
      data(){
          return{
            dataflag:'000',
            urlInfo:'',
            mobilelimitNumber:0,
            emailLimitNum:0,
            phoneArr:[]
          }
      },
      methods:{
        changeCount(val){
          if(this.dataflag==='001'){
            //邮箱
            this.emailLimitNum=this.emailLimitNum-val;
            console.log(this.emailLimitNum)

          }
          else if(this.dataflag==='002'){
            this.mobilelimitNumber=this.mobilelimitNumber-val;
          }
        },
          copyUrl(data){
            let url = data;
            let oInput = document.createElement('input');
            oInput.value = url;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象;
            oInput.style.lineHeight=0;
            document.execCommand("Copy"); // 执行浏览器复制命令
            this.$message.success('复制成功,点击粘贴');
          },
        getUrl(id){
             this.$ajax('bomextract/buildmember/getprojinvitationlink','GET',{projectId:id}).then(res=>{
                   res=res.data;
                   if(res.code==='001'){
                     this.urlInfo=res.data.link;
                     this.emailLimitNum=res.data.emailNum;
                     this.mobilelimitNumber=res.data.phoneNum;
                     this.getUrlCode(this.urlInfo);
                   }

             })
        },
        toEmail(){
             this.dataflag='001'
        },
        toPhone(){
          this.dataflag='002'
        },
        toUrl(){
            this.dataflag='000';
        },
        sendCode(){
              this.$refs.mobileInfo.handleSubmit();
          },
        getUrlCode(url){
          new QRCode(this.$refs.qrCodeDiv, {
            text: url,
            width: 112,
            height: 112,
            colorDark: "#333333", //二维码颜色
            colorLight: "#ffffff", //二维码背景色
            correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
          })
        }
      },
      beforeCreate(){
        this.form = this.$form.createForm(this);
        this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
      },
      mounted(){
          let id=this.$route.params.projectId;
          this.getUrl(id);
      }
    }
</script>

<style scoped>
 .modal-container{

 }
 .item-title{
   color: rgba(0, 0, 0, 0.65);
   line-height:22px;
   text-align:center;
 }
 .item-title img{
   width:112px;
   height:112px;

 }
  .item-body{
       display:flex;
      justify-content: space-between;
  }
  .action{
    text-align:left;
  }
  .action span{
    cursor:pointer;
    text-decoration: underline;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0px;
    color: #1890ff;
    text-align:left;
  }
  .action span:nth-child(2){
    margin-left:24px;
  }
 .item-footer .ant-input{
   width: 200px;
   margin-right:5px;
 }
 .item-footer{
   margin-top:32px;
 }
 .item-footer div{
   display:flex;
 }
  .item-title p:nth-of-type(2){
    color: rgba(0, 0, 0, 0.25);
  }
 .item-info{
   margin-top:40px;
 }
  #qrCode{
    height:120px;
    margin-left:20px;
  }
  .item-title p{
    text-align:left;
  }
  .item-title p:nth-of-type(2){
    margin-bottom: 0;
  }
</style>
