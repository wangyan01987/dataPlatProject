<template>
  <div class="hello">
  <a-form :form="formData" >
      <a-form-item label="项目名称"   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol"  >
          <a-input placeholder="请输入项目名称，支持中英文字符，字数为6-20"   v-decorator="[
           'name',
            {rules: [{ required: true, message: '请输入项目名称' },{validator:checkName}]}
        ]"></a-input>
      </a-form-item>

    <a-form-item label="项目简称"   :label-col="formItemLayout.labelCol"
                 :wrapper-col="formItemLayout.wrapperCol"  >
      <a-input placeholder="请输入项目名称，支持中英文字符，字数为6-20"  v-decorator="[
          'nickname'
        ]"></a-input>
    </a-form-item>
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="项目编号"
        >
      <a-input
        v-decorator="[
          'projectNumber'
        ]"
        placeholder="请输入项目名称，支持中英文字符，字数为6-20"
      />
    </a-form-item>
     <a-form-item label="项目类型"  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol" >
       <a-select @change="handleChange" placeholder="请选择项目类型"  v-decorator="[
          'type',
          {rules: [{ required: true, message: '请选择项目类型!' }]}
        ]">
         <a-select-option  v-for="item in arr" :key="item" :value="item">{{item}}</a-select-option>
       </a-select>

     </a-form-item>
    <a-form-item label="项目所在地"  :label-col="formItemLayout.labelCol"
                 :wrapper-col="formItemLayout.wrapperCol" >
       <a-row :gutter="4">
         <a-col :span="8">
           <a-form-item>
             <a-select @change="handleChange" placeholder="省市"  v-decorator="[
          'province',
          {rules: [{ required: true, message: '请选择项目所在省市!' }]}
        ]">
               <a-select-option  v-for="item in arr" :key="item" :value="item">{{item}}</a-select-option>
             </a-select>

           </a-form-item>
         </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select @change="handleChange" placeholder="城市"  v-decorator="[
          'city',
          {rules: [{ required: true, message: '请选择项目所在城市!' }]}
        ]">
                <a-select-option  v-for="item in arr" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>

            </a-form-item>

          </a-col>
         <a-col :span="8">
           <a-form-item>
             <a-select @change="handleChange" placeholder="区县"  v-decorator="[
          'county',
          {rules: [{ required: true, message: '请选择项目所在区县!' }]}
        ]">
               <a-select-option  v-for="item in arr" :key="item" :value="item">{{item}}</a-select-option>
             </a-select>

           </a-form-item>
         </a-col>
       </a-row>
        <a-form-item>
            <a-input placeholder="请输入详细地址，支持中英文字符，字数为6-20"></a-input>
        </a-form-item>
    </a-form-item>
     <a-button @click='submit' type="primary">提交</a-button>
  </a-form>

  </div>
</template>

<script>
  import {isName} from '@/utils/common.js'
export default {
  name: 'HelloWorld',
  data () {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
    const formTailLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8, offset: 4 },
    };
    return {
      formItemLayout,
      formTailLayout,
      formData:this.$form.createForm(this),
      arr:[1,2,3]

    }

  },
  components:{

  },
  methods:{
    checkName(rule, value, callback){
     if(!value){

       callback()
     }
     else {
       if(!isName(value)){
         callback('项目名称输入格式不正确')
       }else{
         callback();
       }
     }
    },
    submit(){
      this.formData.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        };
        console.log(fieldsValue);
      })
    },
    handleChange(val){
      console.log(val)
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
    var obj={
      name:'lalallalla',
      nickname:'ahahhaaha',
    };
    if(obj instanceof Object){
      this.formData.setFieldsValue(obj);

    }

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
