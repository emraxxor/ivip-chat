<template>
    <DialogDrag ref="dialog" :title="title"  :options="{ width: width,top:20, height: height }" @close="close">

<div class="" style="width:100%;height:{height}px;">
    <div class="chat-window" style="width:100%">
        <div class="">
        	<div class="panel panel-default">
                <div class="panel-heading top-bar">
                    <div class="col-md-8 col-xs-8" style="text-align:left;">
                        <h3 class="panel-title"><span class="glyphicon glyphicon-comment"></span>{{ data.username }}</h3>
                    </div>
                </div>
                <div class="panel-body msg_container_base">
                    <div v-for="msg in messages" :key="msg.cnt" class="row msg_container base_sent" :class=" msg.type=='SENT' ? 'base_sent' : 'base_receive'">
                        <div class="col-md-10 col-xs-10">
                            <div class="messages" :class=" msg.type=='SENT' ? 'msg_sent' : 'msg_receive'" style="text-align:left">
                                <p>{{msg.message}}</p>
                                <time datetime="">{{msg.username}} • {{msg.date}}</time>
                            </div>
                        </div>
                        <div class="col-md-2 col-xs-2 avatar">
                            <img src="../assets/user-profile.png" class=" img-responsive ">
                        </div>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="input-group">
                        <input v-on:keyup.enter="submit" v-model="msg" type="text" class="form-control input-sm chat_input" placeholder="Write your message here..." />
                        <span class="input-group-btn">
                          <button v-on:click="submit" class="btn btn-primary btn-sm" id="btn-chat">Send</button>
                        </span>
                    </div>
                </div>
    		</div>
        </div>
    </div>


</div>


    </DialogDrag>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { ACTIONS, EVENTS } from "../config"
import DialogDrag from 'vue-dialog-drag'
import 'vue-dialog-drag/dist/vue-dialog-drag.css'
import '../styles/private.css'

/**
 *
 * @author Attila Barna
 */
export default {

  data : () => ({
        cnt : 0,
        msg : '',
        messages: []
  }),

  sockets: {

      privateMessage : function( { from, to , message, status  } ) {
          if ( from == this.data.username ) {
            this.messages.push({
                        type : 'RECEIVED',
                        cnt : this.cnt,
                        message : message,
                        username: from,
                        time: new Date()
              })
            this.cnt++;
          }
      }
  },


  created() {

  },

  mounted() {
    this.$refs.dialog.$el.children[1].style.padding = 0
  },

  computed : {

  },

  props : {
      title: {
            default: 'Title'
      },
      width: {
            default : 500,
      },
      height: {
            default: 500
      },
      data : {
            default : {}
      }
  },


  methods : {

      close: function() {
        this.$emit('close', this.data)
      },

       submit(e) {
            if ( this.msg.length > 0 ) {

              this.$socket.emit(EVENTS.SEND_PRIVATE_MESSAGE , {
                username : this.$store.getters.getUserName,
                to: this.data.username,
                message: this.msg,
                status : this.$store.state.status
              })

              this.messages.push({
                        type : 'SENT',
                        cnt : this.cnt,
                        message : this.msg,
                        username: this.$store.getters.getUserName,
                        time: new Date()
              })

              this.cnt++
              this.msg = ''
            }
       }


  },


  components : {
    DialogDrag
  }
}
</script>
