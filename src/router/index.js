import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Chat from '@/views/Chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: Login
    },
    {
      path: '/chat',
      name: 'ChatPage',
      component: Chat
    }
  ]
})
