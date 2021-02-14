<template>
  <div ref="msgs"  v-if="messages.length > 0"  class="">
    <div v-if="chatType === walltype.TYPE_MESSENGER">
        <div ref="msgContainer" v-for="msg in messages" class="col-12" :key="msg.key">
          <div v-if="msg.type === 'incoming' " class="incoming_msg">

            <div class="incoming_msg_img">
              <img
                src="../assets/user-profile.png"
                alt="sunil"
              />
            </div>

            <div class="received_msg">
              <div class="received_withd_msg" style="text-align:left">
                <span class="msg_user_name" @click="clickOnUserName(msg.username)" >{{ msg.username }} :</span>
                <p> <MessageParser :msg="msg.message"/>  </p>
                <span class="time_date"> {{ msg.time | moment("YYYY-MM-DD HH:mm:ss") }} </span>
              </div>
            </div>
          </div>

        <div v-else-if="msg.type === 'system'" class="outgoing_msg">
            <div class="sent_msg">
                <p> System message: {{ msg.message }} </p>
              <span class="time_date"> {{ msg.time | moment("YYYY-MM-DD HH:mm:ss") }} </span>
            </div>
          </div>

          <div v-else-if="msg.type === 'sent'" class="outgoing_msg">

            <div class="sent_msg" style="text-align:left">
                <span class="msg_user_name">{{ msg.username }}:</span>
                <p> <MessageParser :msg="msg.message"/>  </p>
              <span class="time_date"> {{ msg.time | moment("YYYY-MM-DD HH:mm:ss") }} </span>
            </div>
          </div>
        </div>
    </div>
    <div v-else-if="chatType === walltype.TYPE_WALL">
         <div ref="wallContainer" v-for="msg in messages" class="col-12 wall-container" :key="msg.key">
              <div v-if="msg.type === 'incoming' || msg.type === 'sent'" class="msg-panel">
                      <span class="time_date">[{{ msg.time | moment("YYYY-MM-DD HH:mm:ss") }}]</span>
                      <span class="msg_user_name" @click="clickOnUserName(msg.username)" >[{{ msg.username }}]:</span>
                      <span class="chat_message"><MessageParser :msg="msg.message"/> </span>
              </div>
              <div v-else-if="msg.type === 'system'" class="msg-panel">
                      <span class="time_date"> {{ msg.time | moment("YYYY-MM-DD HH:mm:ss") }} </span>
                      <span class="msg_user_name">System message:</span>
                      <span class="chat_message"><MessageParser :msg="msg.message"/> </span>
              </div>

              </div>
         </div>
    </div>

  </div>

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { CHAT_TYPE } from '../config';
import MessageParser from './MessageParser'

export default {

  data : () => ({
    messages : [],
  }),

  sockets: {
      publicMessage : function(  {  message, username } ) {
          this.addMessage({
                  type : 'incoming',
                  username: username,
                  message : message,
                  time: new Date()
          })
      }
  },

  components : {
    MessageParser , CHAT_TYPE
  },

  computed : {
        ...mapGetters( {
              public : 'getPublic',
              user : 'getUserName',
              roomId : 'getRoom',
              chatType : 'getChatType'
        }  ),

        msg() {
          return this.$store.state.msg;
        },

        walltype() {
          return CHAT_TYPE
        }

  },

  watch : {

    msg(newv,oldv) {
       this.messages = this.$store.state.public[ this.$store.state.room ].messages
       this.$emit('onChange', newv ,oldv )

       if ( this.messages.length > 30 )
           this.$delete(this.messages, 0)

    },


    chatType() {
        console.log(this.chatType)
    },

    messages() {
    }
  },

  methods : {
        ...mapActions({ addMessage : 'addMessage' }),

        clickOnUserName(username) {
           this.$emit('clickOnUserName', username )
        }

  },

  props: {

  },

  mounted() {

  }
};
</script>
<style scoped>
  .msg_user_name {
    cursor: pointer;
  }
</style>
