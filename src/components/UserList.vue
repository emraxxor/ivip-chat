<template>
  <div no-body>
        <b-row header-tag="header" role="tab">
          <b-button block @click="onButtonClick($event)" >Users</b-button>
        </b-row>
        <b-collapse v-if="display" visible role="tabpanel">
              <div class="inbox_chat">
                  <div  v-for="user in items"
                        class="chat_list active_chat"
                       :key="user.key"
                       @click.prevent.stop="handleClick($event, user)"
                  >
                          <div class="chat_people">
                            <div class="chat_img"> <img :src="`${url}/user/image/${user.name}`" alt="sunil"> </div>
                            <div class="chat_ib">
                              <h5> {{ user.name }} </h5>
                            </div>
                          </div>
                  </div>
              </div>
              <vue-simple-context-menu
                  :elementId="'UserContextMenu'"
                  :options="options"
                  :ref="'userContextMenu'"
                  @option-clicked="optionClicked"
                />
        </b-collapse>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css'
import VueSimpleContextMenu from 'vue-simple-context-menu'
import ToggleComponentVue from './ToggleComponent.vue'
import { EVENTS } from "../config"
import { URL } from '../config/index'


export default {

  mixins: [ToggleComponentVue],

  components : {
    VueSimpleContextMenu
  },

  props : {
      parent : {
        required: true
      }
  },

  data: () => ({
      items : [],
      display : true
  }),

  sockets: {
      userJoinedToRoom : function(  { users, username } ) {
            this.updateUsers( users.map( e => {
              return {
                  name: e.username,
                  private : e.privateChat
              }
            }) );

            this.submitMessage( { username : 'system', message :  `${username} is joined to room.`, type: 'system' } )
      },

      leaveChat : function( {users, username} ) {
          this.removeUser(username)
          this.submitMessage( {  username : 'system', message :  `${username} is leaving the chat.`, type: 'system' } )
      }
  },

  computed : {
      ...mapGetters( { users : 'getUsers' } ),

      url() {
          return URL
      },

      options : function() {
        const data = [
            {
               name : 'Private chat',
               value : 'private',
            },
            {
               name : 'Ignore/Unignore',
               value : 'ignore'
            }
        ]

        if ( this.$store.state.usergrant === 'admin' ) {
          data.push({
             name : 'Kick',
             value: 'kick'
          })
        }

        return data
      }
  },

  mounted() {
         this.items = this.users
  },

  watch : {
      users() {
         this.items = this.users
      }
  },

  methods : {
        ...mapActions({
          updateUsers : 'updateUsers',
          submitMessage : 'addMessage',
          removeUser : 'removeUser'
        }),

        handleClick (event, item) {
          if ( this.$store.getters.getUserName !== item.name ) {
            this.$refs.userContextMenu.showMenu(event, item)
            this.$emit('clickOnItem', item )
          }
        },

        setFilterValue(val) {
          if ( val === '' ) {
            this.items = this.users
            return
          }

          this.items = this.users.filter(e =>  e.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
        },

        optionClicked (event) {
          if ( event.option.value === 'private') {
            this.$socket.emit(EVENTS.ASK_PRIVATE , {
              ...Object.keys( this.$store.state ).reduce( (res,key) => (  res[key] = this.$store.state[key]  , res ) , {}    ),
              to : event.item.name
            })
          } else if ( event.option.value === 'camera') {
              this.$socket.emit(EVENTS.ASK_CAMERA , {
              ...Object.keys( this.$store.state ).reduce( (res,key) => (  res[key] = this.$store.state[key]  , res ) , {}    ),
              to : event.item.name
            })
          } else if ( event.option.value === 'ignore') {
              console.log(event.item.name)
              if ( this.$store.state.ignored.filter(e => e.name === event.item.name).length === 0 ) {
                  alert("Ignored")
                  this.$store.commit('addIgnored', event.item.name)
              } else {
                  alert("Unignored")
                  this.$store.commit('removeIgnored', event.item.name)
              }
          } else if ( event.option.value === 'kick') {
              this.$socket.emit(EVENTS.KICK_USER , {
                  user: event.item.name, room: this.$store.state.room
              })
          }
        }
  }
}
</script>
<style scoped>
  .inbox_chat {
    cursor: pointer;
    user-select: none;
  }

  @media only screen and (max-width: 600px) {
    .inbox_people {
      display: none;
    }
  }
</style>
