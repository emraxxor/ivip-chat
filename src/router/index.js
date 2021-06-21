import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Chat from '@/views/Chat'
import Registration from '@/views/Registration'
import store from '../store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: Login,
      beforeEnter: (to, from, next) => {
        store.state.room && store.state.authenticated ? next('/chat') : next()
      }
    },
    {
      path: '/chat',
      name: 'ChatPage',
      component: Chat,
      beforeEnter: (to, from, next) => {
        !store.state.authenticated ? next('/') : next()
      }
    },
    {
      path: '/registration',
      name: 'Registration',
      component: Registration,
      beforeEnter: (to, from, next) => {
        store.state.room && store.state.authenticated ? next('/chat') : next()
      }
    }
  ]
})
