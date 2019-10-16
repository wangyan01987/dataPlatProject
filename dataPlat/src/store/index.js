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
    }
  }

});
export default store;
