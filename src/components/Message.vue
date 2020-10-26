<template>
  <div ref="msgs"  v-if="messages.length > 0"  class="">
    <div v-for="msg in messages" class="col-12">
      <div v-if="msg.type === 'incoming' " class="incoming_msg">

        <div class="incoming_msg_img">
          <img
            src="../assets/user-profile.png"
            alt="sunil"
          />
        </div>

        <div class="received_msg">
          <div class="received_withd_msg">
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
        <div class="sent_msg">
            <p> {{ msg.message }} </p>
          <span class="time_date"> {{ msg.time | moment("YYYY-MM-DD HH:mm:ss") }} </span>
        </div>
      </div>

    </div>

  </div>

</template>
<script>
export default {

  data() {
    return {
      msg:  {}
    }
  },

  watch : {
    messages() {

    }
  },

  methods : {


  },

  props: {
    messages: {
      type: Array,
      required: true
    }
  },

  mounted() {

  }
};
</script>
