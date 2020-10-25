import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * @author Attila Barna
 */
export default new Vuex.Store({

  state : {

    currentState : {
      msg: ''
    },

    messages :  []
  },

  mutations : {


    setMsg(state, payload ) {
      state.currentState.msg = payload
    },

    addMessage(state, o) {
      state.messages.push(o)
    }


  },

  actions : {
    async addMessage(state, msg) {
      state.commit('addMessage', {
        type: 'sent',
        time : new Date(),
        message : msg
      } )
    }

  },

  modules : {},


  getters : {
     getMessages : state => state.messages
  }
})
