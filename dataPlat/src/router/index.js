import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
};
const router= new Router({
  routes: [
    {
      path:'/joinSuccessMobile',
      name:'joinSuccessMobile',
      component:()=>import('@/views/invite/joinSuccessMobile.vue')
    },
    {
      path:'/joinSuccesstext',
      name:'joinSuccesstext',
      component:()=>import('@/views/invite/joinSuccesstext.vue')

    },
    {
       path:'/joinSuccess',
      name:'joinSuccess',
     component:()=>import('@/views/invite/joinSuccess.vue')
    },
    {
      path:'/login',
      name:'login',
      component:()=>import('@/views/login')
    },
    {
      path:'/loginMobile',
      name:'loginMobile',
      component:()=>import('@/views/loginMobile')
    },
    {
      path:'/invite',
      name:'invite',
      component:()=>import('@/views/invite/index')
    },
    {
      path:'/',
      name:'layout',
      component:()=>import('@/views/layout'),
      redirect:'/home',
      children:[
        {
          path:'home',
          name:'home',
          component:()=>import('@/views/home')
        },
        {
          path:'personSet',
          name:'personSet',
          component:()=>import('@/views/personSet')
        },
        {
          path:'projectDetail/:projectId',
          name:'projectDetail',
          component:()=>import('@/views/sublayout'),
          redirect:'/projectDetail/:projectId/building',
          children:[
            {
              path:'building',
              name:'building',
              component:()=>import('@/views/building')

            },
            {
              path:'BOM',
              name:'BOM',
              component:()=>import('@/views/BOM'),
            },
            {
              path:'file',
              name:'file',
              component:()=>import('@/views/file')
            },{
              path:'issue',
              name:'issue',
              component:()=>import('@/views/issue')
            },
            {
              path:'member',
              name:'member',
              component:()=>import('@/views/member')
            },
          ]
        },
      ]
    },

    {
      path:'*',
      component:()=>import('@/views/404')
    }
  ]
});

import  store from '../store';
  router.beforeEach((to,from,next)=>{
  let client=document.body.clientWidth;
  let token=localStorage.getItem('token');
  //未登录
  // if (to.name!== 'invite' && to.name !== 'joinSuccess'&&to.name!=='loginMobile'&&!token && to.path !== '/login' ) {
  //   console.log('--------------')
  //        if(client<750){
  //          next({path:'/loginMobile' })
  //        }
  //        else if(to.name==='home'&&to.query.token){
  //          localStorage.setItem('token',to.query.token);
  //          next('/home');
  //        }
  //        else{
  //          next('/login');
  //        }
  //     } else if(token&&to.name!=='joinSuccessMobile'){
  //   console.log('22222222222222222222')
  //       if(client<750){
  //          next({path:'/joinSuccessMobile' })
  //         }
  //         else{
  //         next();
  //         }
  //     }
  //     else {
  //       console.log('3333333333333333333')
  //     if(to.name==='home'&&to.query.token){
  //        localStorage.setItem('token',to.query.token);
  //        next();
  //      } else{
  //         next();
  //        }
  //
  //     }
      if(to.name==='invite' || to.name === 'joinSuccess'){
        next();
      }else{
        if(!token){
          //未登录
          if(client<750){
            if(to.name==='loginMobile'){
              next();
            }
            else{
              next('/loginMobile')
            }
          }else{
            //web端
            if(to.name==='login'||to.name==='home'&&to.query.token){
              if(to.query.token){
                localStorage.setItem('token',to.query.token);
              }
              next();
            }
            else{
              next('/login')
            }
          }
        }else if(token){
          //已登录
          if(client<750){
            if(to.name==='joinSuccessMobile'){
              next();
            }else if(to.name==='joinSuccesstext'){
              next();
            }else{
              next('/joinSuccessMobile');
            }

          }else{
            //web端
            if(to.name==='home'&&to.query.token){
                       localStorage.setItem('token',to.query.token);
                       next('/home');
                     }
                     else{
                        next();
                     }
          }
        }
      }

});
export default router;

