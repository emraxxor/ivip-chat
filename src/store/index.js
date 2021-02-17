import { stat } from 'fs'
import { resolve } from 'path'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import { STATUS, URL , ACTIONS, CHAT_TYPE } from '../config'


/**
 * @author Attila Barna
 */
export default new Vuex.Store({

  state : {
    authenticated : false,
    room: undefined,
    username: undefined,
    darktheme : false,
    status: STATUS.AVAILABLE,
    chatType : CHAT_TYPE.TYPE_MESSENGER,
    count : 0,
    msg : { type: '', username: '', message:'', time:'' },
    chatFontColor : '#000000',
    rooms: [],
    public :  {},
    users : [],
  },

  mutations : {

    setRooms(state, rooms) {
      state.rooms = rooms
    },

    setRoom(state, room) {
      state.room = room
      if ( state.public[state.room] == null ) {
        state.public[state.room] = {
          roomName : state.room,
          messages : []
        }
      }
    },

    setAuthenticate(state, status) {
      state.authenticated = status
    },

    setUserName(state, name) {
      state.username = name
    },

    addUser(state, o ) {
      state.count = state.count + 1
      o.key = state.count
      state.users.push( o )
    },

    setUsers(state, o ) {
      Array.from(o).forEach( e => ( state.count = state.count + 1 ,  e['key'] = state.count , e  ) )
      state.users = o
    },

    removeUser(state,userName) {
      state.users = state.users.filter( e => e.name !== userName)
    },

    addMessage(state, o) {
      state.count = state.count + 1
      o.key = state.count
      state.msg = o;
      state.public[state.room].messages.push(state.msg)
    },

    setChatType(state,o) {
      state.chatType = o;
    },

    setDarktheme(state,o) {
      state.darktheme = o
    },

    setChatFontColor(state,o) {
      state.chatFontColor = o;
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

    updateDark({commit}, dark) {
      commit('setDarktheme', dark)
    },

    updateUsers({commit}, users ) {
      commit('setUsers', users)
    },

    addUser({commit}, user) {
      commit('addUser', user)
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
     getPublic : state => state.public,
     getRooms : state => state.rooms,
     getRoom : state => state.room,
     getUserName : state => state.username,
     getUserStatus : state => state.status,
     getAuthenticated : state => state.authenticated,
     getUsers : state => state.users,
     getDarktheme : state => state.darktheme,
     getChatType : state => state.chatType,
     getChatFontColor : state => state.chatFontColor
  }
})
