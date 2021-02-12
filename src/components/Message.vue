<template>
  <div ref="msgs"  v-if="messages.length > 0"  class="">
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
             <span class="msg_user_name">{{ msg.username }} :</span>
            <p> {{  msg.message }} </p>
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
            <p> {{ msg.message }} </p>
          <span class="time_date"> {{ msg.time | moment("YYYY-MM-DD HH:mm:ss") }} </span>
        </div>
      </div>

    </div>

  </div>

</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {

  data : () => ({
    messages : []
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

  computed : {
        ...mapGetters( {
              public : 'getPublic',
              user : 'getUserName',
              roomId : 'getRoom',
        }  ),

        msg() {
          return this.$store.state.msg;
        },

  },

  watch : {

    msg(newv,oldv) {
       this.messages = this.$store.state.public[ this.$store.state.room ].messages
       this.$emit('onChange', newv ,oldv )
    },

    messages() {
    }
  },

  methods : {
        ...mapActions({ addMessage : 'addMessage' }),

  },

  props: {

  },

  mounted() {

  }
};
</script>
