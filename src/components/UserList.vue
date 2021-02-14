<template>
      <div no-body class="">
        <b-row header-tag="header" role="tab">
          <b-button block v-b-toggle.accordion-users >Users</b-button>
        </b-row>
        <b-collapse id="accordion-users" visible role="tabpanel">
              <div class="inbox_chat">
                  <div v-for="user in items" class="chat_list active_chat" :key="user.key"
                       @click.prevent.stop="handleClick($event, user)"
                  >
                          <div class="chat_people">
                            <div class="chat_img"> <img src="../assets/user-profile.png" alt="sunil"> </div>
                            <div class="chat_ib">
                              <h5> {{ user.name }} </h5>
                            </div>
                          </div>
                  </div>
              </div>
        </b-collapse>
        <vue-simple-context-menu
            :elementId="'UserContextMenu'"
            :options="options"
            :ref="'userContextMenu'"
            @option-clicked="optionClicked"
          />
      </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css'
import VueSimpleContextMenu from 'vue-simple-context-menu'
import { EVENTS } from "../config"


export default {

  components : {
    'vue-simple-context-menu' : VueSimpleContextMenu
  },

  sockets: {

       userJoinedToRoom : function(  { users, username } ) {
            this.updateUsers( users.map( e => {
              return {
                  name: e.username,
                  private : e.privateChat
              }
            })  );


          this.submitMessage( { username : 'system', message :  `${username} is joined to room.`, type: 'system' } )
      },

      leaveChat : function( {users, username} ) {
          this.removeUser(username)
          this.submitMessage( {  username : 'system', message :  `${username} is leaving the chat.`, type: 'system' } )
      }

  },

  computed : {
      ...mapGetters( { users : 'getUsers' } ),

      options : function() {
        return [
            {
               name : 'Private chat',
               value : 'private',
            },/*
            {
               name : 'Webcam',
               value : 'camera',
            },*/
            {
               name : 'Ignore/Unignore',
               value : 'ignore'
            }
        ]
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


  data: () => ({
      items : []
  }),

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
