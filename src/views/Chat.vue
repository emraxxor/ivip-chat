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
             <MessageVue ref="messages" :messages="messages" ></MessageVue>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input type="text" class="write_msg" v-model="msg" v-on:keyup.enter="submit" placeholder="Type a message" />
              <button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>

    </div></div>

</template>
<script>

import '../styles/chat.scss';
import { ACTIONS, EVENTS } from "../config"
import { mapActions, mapGetters } from 'vuex'
import MessageVue from '@/components/Message.vue'
import UserList from '@/components/UserList.vue'


/**
 * @author Attila Barna
 */
export default {

  data()  {
    return {
      msg : '',
    }
  },

  computed : {
      ...mapGetters( { messages : 'getMessages' } ),
  },

  components : {
    MessageVue,
    UserList
  },


  sockets: {

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

    submit() {
      if ( this.msg.length > 0 ) {
        this.submitMessage( { msg: this.msg  , type:  'sent' } )
        this.msg = ''
      }
    }
  }



}
</script>
