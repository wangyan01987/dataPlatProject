import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);
import createPersistedState from "vuex-persistedstate"
const store=new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })],
  state:{
      isLogin:false,
       projectName:'',
       phone:'',
       menuList:[],
       userName:"",
       record:{},
        userId:'',
    projectUserId:''
  },
  mutations:{
       setLogin(state,val){
         state.isLogin=val;
       },
    setProjectName(state,val){
         state.projectName=val;
    },
    setPhone(state, val){
      state.phone=val;
    },
    setMenuList(state,val){
         state.menuList=val;
    },
    setUserName(state, val){
      state.userName=val;
    },
    setRecord(state, val){
      state.record=val;
    },
    setUserId(state,val){
         state.userId=val;
    },
    setprojectUserId(state,val){
          state.projectUserId=val;
    }
  }

});
export default store;
