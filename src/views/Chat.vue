<template>
<!-- basic template from https://bootsnipp.com/ -->
<div class="container-fluid">

<div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>Online</h4>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <input type="text" class="search-bar"  placeholder="Search" >
                <span class="input-group-addon">
                <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                </span> </div>
            </div>
          </div>
          <div ref="accordion" class="accordion" role="tablist">
             <UserList ref="userlist"  @sendMessage="submitMessage"></UserList>
          </div>
        </div>
        <div class="mesgs">
          <div class="msg_history" ref="messagePanel">
             <MessageVue
                @onChange="onChangeMessagePanel"
             ></MessageVue>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input type="text" class="write_msg" v-model="msg" v-on:keyup.enter="submit" placeholder="Type a message" />
              <button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>

    </div>

  <div v-for="notice in notices" :key="notice.username">
      <Dialog :data="notice" title="Private chat" open='true' @validate="onNoticeAccept" @invalidate="onNoticeDecline">
          <div slot="dialogBody">
             <div v-if="notice.type == 'ask_private'">
                   {{ notice.username }} wants to make a private chat with you.
             </div>
             <div v-if="notice.type == 'ask_camera'">
                   {{ notice.username }} wants to request access to your camera.
             </div>
             <div v-else-if="notice.type == 'accept_private'">
                   {{ notice.username }} is accepted your request.
             </div>
            <div v-else-if="notice.type == 'accept_camera'">
                   {{ notice.username }} is accepted your request.
             </div>
             <div v-else-if="notice.type == 'decline_private'">
                   {{ notice.username }} is declined your request.
             </div>
             <div v-else-if="notice.type == 'decline_camera'">
                   {{ notice.username }} is declined your request.
             </div>
          </div>
      </Dialog>
  </div>

  <PrivateChat ref="privs" v-for="priv in accepted" @close="privateWindowOnClose" :key="priv.username" :data="priv" title="Private chat">
  </PrivateChat>

</div>

</template>
<script>

import '../styles/chat.scss';
import { ACTIONS, EVENTS, PCSIGNAL } from "../config"
import { mapActions, mapGetters } from 'vuex'
import MessageVue from '@/components/Message.vue'
import UserList from '@/components/UserList.vue'
import Dialog from '@/components/DialogWindow.vue'
import PrivateChat from '@/components/PrivateChat.vue'

/**
 * @author Attila Barna
 */
export default {

  data : () => ({
      msg : '',
      notices : [],
      accepted : [],
      webcams : []
  }),

  computed : {
      ...mapGetters( {
              public  : 'getPublic',
              room : 'getRoom',
              userName : 'getUserName',
              userStatus : 'getUserStatus',
              isAuthenticated : 'getAuthenticated'
      } ),
  },

  components : {
    MessageVue,
    Dialog,
    UserList,
    PrivateChat,
  },

  sockets: {

      notice : function( data ) {
          const exists = this.notices.filter(e => e.username === data.username && e.type == data.type ).length > 0
          if ( !exists ) {
            this.notices.push({...data})
          }
      },

  },

  beforeCreate: function() {
      this.$socket.emit(EVENTS.JOIN_ROOM, this.$store.state)
  },

  watch : {

  },

  mounted() {
  },

  methods :  {
    ...mapActions({ submitMessage : 'addMessage' }),

    privateWindowOnClose(item) {
        this.accepted = this.accepted.filter(e => e.username !== item.username)
    },

    onChangeMessagePanel(newv,oldv) {
      setTimeout(() => {
        this.$refs.messagePanel.scrollTop = this.$refs.messagePanel.scrollHeight
      },100)
    },

    onNoticeAccept : function(item) {
      if ( item.type == 'ask_private' ) {
         this.$socket.emit(EVENTS.ACCEPT_PRIVATE ,  { to : item.username , from : item.to , type : 'accept_private' }  )
         this.accepted.push({...item, callee : true})
      } else if ( item.type == 'ask_camera' ) {
         console.log(`Usercamera offer to ${item.username}`)
         this.$refs.usercamera.offer(item.username)
         this.$socket.emit(EVENTS.ACCEPT_CAMERA ,   { to : item.username , from : item.to , type : 'accept_camera' }  )
      } else if ( item.type == 'accept_private' ) {
         this.accepted.push({...item, callee: false})
      }  else if ( item.type == 'accept_camera' ) {
         this.notices.push(item)
      }

      this.notices = this.notices.filter(e => e.username !== item.username)
    },

    onNoticeDecline : function(item) {
      if ( item.type == 'ask_private' ) {
        this.$socket.emit(EVENTS.DECLINE_PRIVATE ,  { to : item.username , from : item.to, type : 'decline_private' }  )
      } else if ( item.type == 'ask_camera' ) {
         this.$socket.emit(EVENTS.DECLINE_CAMERA ,  { to : item.username , from : item.to, type : 'decline_camera' }  )
      }
      this.notices = this.notices.filter(e => e.username !== item.username)
    },

    submit() {
      if ( this.msg.length > 0 ) {

        this.$socket.emit(EVENTS.SUBMIT_MESSAGE , {
          room: this.$store.getters.getRoom,
          username : this.$store.getters.getUserName,
          message: this.msg
        })

        this.submitMessage({
                  type : 'sent',
                  message : this.msg,
                  username: this.$store.getters.getUserName,
                  time: new Date()
        })
        this.msg = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .video-panel {
    display: flex;
  }
</style>
