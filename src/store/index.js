import { resolve } from 'path'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import { STATUS, URL , ACTIONS } from '../config'


/**
 * @author Attila Barna
 */
export default new Vuex.Store({

  state : {
    authenticated : false,
    room: undefined,
    username: undefined,
    status: STATUS.AVAILABLE,
    rooms: [],
    messages :  [],
    users : [],
  },

  mutations : {

    setRooms(state, rooms) {
      state.rooms = rooms
    },

    setRoom(state, room) {
      state.room = room
    },

    setAuthenticate(state, status) {
      state.authenticated = status
    },

    setUserName(state, name) {
      state.username = name
    },

    setUsers(state, users) {
       state.users = users
    },

    removeUser(state,userName) {
      state.users = state.users.filter( e => e.name !== userName)
    },

    addMessage(state, o) {
      state.messages.push(o)
    }

  },

  actions : {
    async addMessage(state, o ) {
      state.commit('addMessage', o )
    },


    async authenticate(state, data) {
      return new Promise(async (resolve, reject) => {
        const { body } = await Vue.http.post(`${URL}/authentication/login`, data)

        if (body.code === 400 || body.code === 401 || body.code === 500)
          reject({ message: body.message })

        state.commit('setAuthenticate', true)
        state.commit('setUserName', body.data.username)
        resolve(body.data)
      })

    },


    removeUser({commit}, userName) {
      commit('removeUser', userName)
    },

    updateUsers({commit}, users ) {
        commit('setUsers', users)
    },

    updateRoom( state, room ) {
        state.commit('setRoom', room)
    },

    async rooms({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const rooms = await Vue.http.get(`${URL}/rooms`)
          commit('setRooms', rooms.body)
          resolve(rooms)
        } catch (error) {
          console.error(error)
          reject(error)
        }
      })
    },


  },

  modules : {

  },


  getters : {
     getMessages : state => state.messages ,
     getRooms : state => state.rooms,
     getRoom : state => state.room,
     getUserName : state => state.username,
     getUserStatus : state => state.status,
     getAuthenticated : state => state.authenticated,
     getUsers : state => state.users
  }
})
