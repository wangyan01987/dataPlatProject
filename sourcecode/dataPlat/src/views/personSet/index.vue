
<template>
  <div>
    <a-tabs defaultActiveKey="1" @change="callback" tabPosition="top">
      <a-tab-pane tab="个人信息" key="1"><person-info></person-info></a-tab-pane>
      <a-tab-pane tab="修改密码" key="2"><psd-info></psd-info></a-tab-pane>

    </a-tabs>
  </div>
</template>
<script>
  import PersonInfo from '@/components/PersonSet/PersonInfo'
  import PsdInfo from '@/components/PersonSet/PsdInfo'
  export default {
    components:{PersonInfo,PsdInfo},
    data () {
      return {
      }
    },
    methods: {
      callback (key) {

      },
    },
  }
</script>
<style scoped>

</style>
