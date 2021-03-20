<template>
  <div ref="msgs"  v-if="messages.length > 0"  class="">
    <div v-if="chatType === walltype.TYPE_MESSENGER">
        <div ref="msgContainer" v-for="msg in messages" class="col-12" :key="msg.key">
          <div v-if="msg.type === 'incoming' " class="incoming_msg">

            <div class="incoming_msg_img">
              <img
                :src="`${url}/user/image/${msg.username}`"
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
         <div ref="wallContainer" v-for="msg in messages" class="col-12 wall-msg-panel" :key="msg.key">
              <div v-if="msg.type === 'incoming' || msg.type === 'sent'" class="msg-panel" :style=" { fontSize: settings.fontSize + 'px' } ">
                      <span class="time_date">[{{ msg.time | moment("YYYY-MM-DD HH:mm:ss") }}]</span>
                      <span class="msg_user_name" :style="`color:${msg.color};font-weight:bold;`"  @click="clickOnUserName(msg.username)" >[{{ msg.username }}]:</span>
                      <span class="chat_message" :style="`color:${msg.color};font-weight:bold;`" ><MessageParser :msg="msg.message"/> </span>
              </div>
              <div v-else-if="msg.type === 'system'" class="msg-panel" :style=" { fontSize: settings.fontSize + 'px' } ">
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
import { CHAT_TYPE, EVENTS } from '../config';
import { URL } from '../config/index'
import MessageParser from './MessageParser'
import chatMsgSfx from '../assets/chat.mp3'
import SettingsStore from './settings/tabs/SettingsStore.vue';

const chatMsgSfxAudio = new Audio(chatMsgSfx);

export default {

  data : () => ({
    messages : [],
  }),

  mixins: [SettingsStore],

  sockets: {
      publicMessage : function(  {  message, username, color } ) {

          if ( this.$store.state.ignored.filter( e => e.name === username).length > 0 )
            return

          if ( this.settings.notifySound && message.indexOf(this.user) !== -1 )
             chatMsgSfxAudio.play()

          if ( this.settings.awayEnabled && message.indexOf(this.user) !== -1  )
              this.sendAwayMessage()

          this.addMessage({
                  type : 'incoming',
                  username: username,
                  message : message,
                  time: new Date(),
                  color: color
          })
      }
  },

  components : {
       MessageParser
  },

  computed : {
        ...mapGetters( {
              public : 'getPublic',
              user : 'getUserName',
              roomId : 'getRoom',
              chatType : 'getChatType',
              settings: 'user/getSettings'
        }),

        msg() {
          return this.$store.state.msg;
        },

        url() {
          return URL
        },

        walltype() {
          return CHAT_TYPE
        }

  },

  watch : {

    msg(newv,oldv) {
       this.messages = this.$store.state.public[ this.$store.state.room ].messages
       this.$emit('onChange', newv ,oldv )

       if ( this.messages.length > 60 )
           this.$delete(this.messages, 0)

    },


    chatType() {
    },

    messages() {
    }
  },

  methods : {
        ...mapActions({ addMessage : 'addMessage' }),

        clickOnUserName(username) {
           this.$emit('clickOnUserName', username )
        },

        sendAwayMessage() {
          this.$socket.emit(EVENTS.SUBMIT_MESSAGE , {
                room: this.$store.getters.getRoom,
                username : this.$store.getters.getUserName,
                message: this.settings.awayMessage,
                color: this.$store.getters.getChatFontColor
          })

          this.$store.dispatch('addMessage',{
                type : 'sent',
                message : this.settings.awayMessage,
                username: this.$store.getters.getUserName,
                time: new Date(),
                color: this.$store.getters.getChatFontColor
          })
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
