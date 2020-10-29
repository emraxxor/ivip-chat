<template>
<!-- basic template from https://bootsnipp.com/ -->
<div class="container-fluid">

<div class="video-panel">

</div>
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
             <MessageVue ref="messages" ></MessageVue>
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
             <div v-if="notice.type == 'ask'">
                   {{ notice.username }} wants to make a private chat with you.
             </div>
             <div v-else-if="notice.type == 'accept'">
                   {{ notice.username }} is accepted your request.
             </div>
             <div v-else-if="notice.type == 'decline'">
                   {{ notice.username }} is declined your request.
             </div>
          </div>
      </Dialog>
  </div>

  <PrivateChat  v-for="priv in accepted" @close="privateWindowOnClose" :key="priv.username" :data="priv" title="Private chat">
      <div slot="dialogBody">
          {{ priv.username }} wants to make a private chat with you.
      </div>
  </PrivateChat>

</div>

</template>
<script>

import '../styles/chat.scss';
import { ACTIONS, EVENTS } from "../config"
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
  }),

  computed : {
      ...mapGetters( { messages : 'getMessages' } ),
  },

  components : {
    MessageVue,
    Dialog,
    UserList,
    PrivateChat
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
    messages() {
       this.$refs.messagePanel.scrollTop = this.$refs.messagePanel.scrollHeight
    }
  },

  mounted() {
  },

  methods :  {
    ...mapActions({ submitMessage : 'addMessage' }),

    privateWindowOnClose(item) {
        this.accepted = this.accepted.filter(e => e.username !== item.username)
    },

    onNoticeAccept : function(item) {
      if ( item.type == 'ask' ) {
         this.$socket.emit(EVENTS.ACCEPT_PRIVATE ,  { to : item.username , from : item.to , type : 'accept' }  )
         this.accepted.push(item)
      }

      this.notices = this.notices.filter(e => e.username !== item.username)
    },

    onNoticeDecline : function(item) {
      if ( item.type == 'ask' )
        this.$socket.emit(EVENTS.DECLINE_PRIVATE ,  { to : item.username , from : item.to, type : 'decline' }  )

      this.notices = this.notices.filter(e => e.username !== item.username)
    },

    submit() {
      if ( this.msg.length > 0 ) {
        this.$socket.emit(EVENTS.SUBMIT_MESSAGE , { ...this.$store.state, message: this.msg  })
        this.submitMessage({
                  type : 'sent',
                  message : this.msg,
                  time: new Date()
        })
        this.msg = ''
      }
    }
  }
}
</script>
