import Vue from 'vue'
import Vuex from 'vuex'

import { STATUS, CHAT_TYPE } from '../config'
import UserStore from './modules/UserStore'

Vue.use(Vuex)

/**
 * @author Attila Barna
 */
export default new Vuex.Store({

  state: {
    authenticated: false,
    room: undefined,
    username: undefined,
    usergrant: undefined,
    darktheme: false,
    status: STATUS.AVAILABLE,
    chatType: CHAT_TYPE.TYPE_MESSENGER,
    count: 0,
    msg: { type: '', username: '', message: '', time: '' },
    chatFontColor: '#000000',
    rooms: [],
    public: {},
    users: [],
    ignored: []
  },

  mutations: {

    addIgnored (state, name) {
      state.ignored.push({
        name
      })
    },

    removeIgnored (state, name) {
      state.ignored = state.ignored.filter(e => e.name !== name)
    },

    setRooms (state, rooms) {
      state.rooms = rooms
    },

    setRoom (state, room) {
      state.room = room
      if (state.public[state.room] == null) {
        state.public[state.room] = {
          roomName: state.room,
          messages: []
        }
      }
    },

    setAuthenticate (state, status) {
      state.authenticated = status
    },

    setUserName (state, name) {
      state.username = name
    },

    addUser (state, o) {
      state.count = state.count + 1
      o.key = state.count
      state.users.push(o)
    },

    setUsers (state, o) {
      Array.from(o).forEach(e => { state.count = state.count + 1; e['key'] = state.count })
      state.users = o
    },

    removeUser (state, userName) {
      state.users = state.users.filter(e => e.name !== userName)
    },

    addMessage (state, o) {
      state.count = state.count + 1
      o.key = state.count
      state.msg = o
      state.public[state.room].messages.push(state.msg)
    },

    setChatType (state, o) {
      state.chatType = o
    },

    setDarktheme (state, o) {
      state.darktheme = o
    },

    setChatFontColor (state, o) {
      state.chatFontColor = o
    },

    setUserGrant (state, o) {
      state.usergrant = o
    }

  },

  actions: {
    async addMessage (state, o) {
      state.commit('addMessage', o)
    },

    removeUser ({commit}, userName) {
      commit('removeUser', userName)
    },

    updateDark ({commit}, dark) {
      commit('setDarktheme', dark)
    },

    updateUsers ({commit}, users) {
      commit('setUsers', users)
    },

    addUser ({commit}, user) {
      commit('addUser', user)
    },

    updateRoom (state, room) {
      state.commit('setRoom', room)
    }

  },

  modules: {
    user: UserStore
  },

  getters: {
    getPublic: state => state.public,
    getRooms: state => state.rooms,
    getRoom: state => state.room,
    getUserName: state => state.username,
    getUserStatus: state => state.status,
    getAuthenticated: state => state.authenticated,
    getUsers: state => state.users,
    getDarktheme: state => state.darktheme,
    getChatType: state => state.chatType,
    getChatFontColor: state => state.chatFontColor
  }
})
