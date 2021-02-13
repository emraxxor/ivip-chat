<template>

<vue-drag-resize class="dialog-window" ref="dialog"  :w="width" :h="height" :parent="false" >

<div ref="modaldialog" class="modal">
<div class="modal-dialog-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{data.username}}</h5>
        <button type="button" class="close" data-dismiss="modal"  @click="close($event)" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <div class="chat-dialog__dialog_container" style="width:100%;">
            <div v-if="privateCamera" class="chat-dialog__camera">
              <PrivateCamera
                    :to="data.username"
                    :room="data.username"
                    :callee="data.callee"
                    :videoAnswer="videoAnswer"
              >
              </PrivateCamera>
            </div>
            <div v-else class="chat-dialog__camera">
                <button @click="startCamera">Turn on camera</button>
            </div>

            <div class="chat-window">
                <div class="">
                  <div class="panel panel-default">
                        <div class="panel-heading top-bar">
                            <div class="col-md-8 col-xs-8" style="text-align:left;">
                                <h3 class="panel-title"><span class="glyphicon glyphicon-comment"></span>{{ data.username }}</h3>
                            </div>
                        </div>
                        <div ref="messagesBody" class="panel-body msg_container_base" style="min-height:275px; max-height:275px;">
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
      </div>
    </div>
</div>
</div>


    </vue-drag-resize>
</template>
<script>
import { EVENTS, PCSIGNAL } from "../config"
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-dialog-drag/dist/vue-dialog-drag.css'
import '../styles/private.css'
import PrivateCamera from './PrivateCamera';

/**
 *
 * @author Attila Barna
 */
export default {

  data : () => ({
      cnt : 0,
      msg : '',
      messages: [],
      privateCamera: false,
      videoAnswer: {
        video: undefined,
        remoteDesc: undefined,
        candidate: undefined,
        close: false
      }
  }),

  watch : {
    messages : function(newv,oldv) {
        setTimeout( () => {
          this.$refs.messagesBody.scrollTop = this.$refs.messagesBody.scrollHeight
        },100)
    }
  },

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
      },

       PCSignaling: function({ target , from, candidate, sdp, type, room }) {
          if (from === this.$store.state.username) return

          if (sdp) {
            if (sdp.type === PCSIGNAL.OFFER ) {
              console.log(`[DEV] Received signal (offer) from ${from} `)
              this.openCamera(sdp, from)
            } else if (sdp.type === PCSIGNAL.ANSWER ) {
              console.log(`[DEV] Received signal (answer) from ${from} `)
              this.videoAnswer = { ...this.videoAnswer, remoteDesc: sdp }
            } else {
              console.log("[DEV] Unsupported SDP type")
            }
          }  else if (candidate) {
                console.log(`[DEV] Received candidate from ${from} `)
                console.log(candidate)
                this.videoAnswer = { ...this.videoAnswer, candidate }
          } else {
                this.privateCamera = false
          }
       }
  },


  created() {
    this.username = this.$store.state.username
  },

  mounted() {
    this.$refs.dialog.$el.children[1].style.padding = 0
    this.$refs.modaldialog.style.display = "block"; // <b-modal> creates a new layer, so use css instead of that
    this.$refs.dialog.style.transform = "translate(-50%, -50%)"
  },

  computed : {

  },

  beforeDestroy() {
    this.closePrivate()
  },

  props : {
      title: {
            default: 'Title'
      },
      width: {
            default : 800,
      },
      height: {
            default: 500
      },
      data : {
            default : {}
      }
  },


  methods : {

      openCamera(sdp, from){
        this.videoAnswer = { ...this.videoAnswer, video: true, remoteDesc: sdp, from }
        this.privateCamera = true
      },

      startCamera() {
         this.privateCamera = true;
      },

      close: function(e) {
        this.$emit('close', this.data)
      },

      closePrivate() {

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
    'vue-drag-resize' : VueDraggableResizable,
    PrivateCamera
  }
}
</script>
<style lang="scss" scoped>
  .dialog-window {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .chat-window {
    width: 70% !important;
  }

  .chat-dialog {

    &__camera {
      width: 30%;
    }



    &__dialog_container {
       display: flex;
    }
  }
</style>
