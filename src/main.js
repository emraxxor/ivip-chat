// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueMoment from 'vue-moment'
import VueResource from 'vue-resource'
import './styles/vars.scss'
import './styles/app.scss'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueYouTubeEmbed from 'vue-youtube-embed'
import '@fortawesome/fontawesome-free/js/all.js'
import { URL } from './config'
import VueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'

window.jQuery = require('jquery')
Vue.config.productionTip = false

// Socket config
Vue.use(new VueSocketIO({
  debug: true,
  connection: io(`${URL}/ivip-chat`, { autoConnect: false }),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
}))

Vue.use(VueYouTubeEmbed)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueMoment)
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
