import Vue from 'vue'
import {  URL, STORE } from '../../config'


export default {

  namespaced: true,

  state : {
      token: undefined,
      settings: {
          notifySound: true,
          fontSize: 12,
          awayMessage: 'I am busy right now...',
          awayEnabled: false,
      }
  },

  mutations : {

    setSettings(state,o) {
      state.settings = o
    },

    setToken(state, token) {
      state.token = token
    },
  },

  actions : {

    async rooms(state) {
      return new Promise(async (resolve, reject) => {
        try {
          const rooms = await Vue.http.get(`${URL}/rooms`)
          state.commit('setRooms', rooms.body, STORE.GLOBAL)
          resolve(rooms)
        } catch (error) {
          console.error(error)
          reject(error)
        }
      })
    },

    async authenticate(state, data) {
      return new Promise(async (resolve, reject) => {
        const { body } = await Vue.http.post(`${URL}/authentication/login`, data)

        if (body.code === 400 || body.code === 401 || body.code === 402 || body.code === 500) {
          reject({ message: body.message })
        } else {
          state.commit('setAuthenticate', true, STORE.GLOBAL)
          state.commit('setUserName', body.data.username, STORE.GLOBAL)
          state.commit('setUserGrant', body.data.grant, STORE.GLOBAL)
          state.commit('setToken',body.data.token)

          // #TODO AUTO LOGIN
          STORE.HEADER.AUTH.headers.Authorization = 'Bearer ' + body.data.token

          resolve(body.data)
        }
      })
   },


    updateSettings(state, settings) {
      state.commit('setSettings', settings)
    },

    async uploadImage(state, data) {
      return new Promise(async (resolve, reject) => {
        const { body } = await Vue.http.put(`${URL}/user/image`, data , STORE.HEADER.AUTH );
        if (body.code === 200 ) {
          resolve(body.data)
        } else {
          reject({ message: body.message })
        }
      })
    },

  },

  getters : {
    getSettings : state => state.settings,
  }


};
