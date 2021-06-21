<template>

<div v-if="display">
<vue-drag-resize class="dialog-window" ref="dialog" :w="width" :h="height" :parent="false" >

<div ref="modaldialog" visible class="modal">
<div class="modal-dialog-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{data.username}}</h5>
        <div class="row">
          <div class="col-xs-12 mr-5">

            <div class="text-right">
            <button type="button" class="btn pull-right" @click="minimize($event)" aria-label="Minimize">
                  <i class="fas fa-window-minimize"></i>
            </button>
            <button type="button" class="close" data-dismiss="modal"  @click="close($event)" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body chat-dialog">
            <div class="chat-dialog__dialog_container" style="width:100%;">
            <div v-if="privateCamera" class="chat-dialog__camera">
              <PrivateCamera
                    :to="data.username"
                    :room="data.username"
                    :callee="data.callee"
                    :videoAnswer="videoAnswer"
                    @closeCall="onCloseCall"
              >
              </PrivateCamera>
            </div>
            <div v-else class="chat-dialog__camera">
                <button v-if="canWrite"  @click="startCamera">Turn on camera</button>
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
                                <input v-on:keyup.enter="submit" :disabled="!canWrite" v-model="msg" type="text" class="form-control input-sm chat_input" placeholder="Write your message here..." />
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
</div>
</template>
<script>
import { EVENTS, PCSIGNAL } from '../config'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-dialog-drag/dist/vue-dialog-drag.css'
import '../styles/private.css'
import PrivateCamera from './PrivateCamera'

/**
 *
 * @author Attila Barna
 */
export default {

  props: {
    title: {
      default: 'Title'
    },
    width: {
      default: 800
    },
    height: {
      default: 500
    },
    data: {
      default: {}
    }
  },

  data: () => ({
    cnt: 0,
    msg: '',
    messages: [],
    privateCamera: false,
    canWrite: true,
    display: true,
    videoAnswer: {
      video: undefined,
      remoteDesc: undefined,
      candidate: undefined,
      close: false
    }
  }),

  components: {
    'vue-drag-resize': VueDraggableResizable,
    PrivateCamera
  },

  watch: {
    messages: function (newv, oldv) {
      if (this.display) {
        setTimeout(() => {
          this.$refs.messagesBody.scrollTop = this.$refs.messagesBody.scrollHeight
        }, 100)
      }

      if (this.messages.length > 30) { this.$delete(this.messages, 0) }
    },

    data (o, n) {
      this.display = !n.minimized

      if (this.display) { setTimeout(() => { this.$refs.dialog.$el.style.transform = 'translate(-50%,-50%)' }, 100) }
    }
  },

  sockets: {

    privateMessage: function ({ from, to, message, status }) {
      if (from === this.data.username && this.canWrite) {
        this.messages.push({
          type: 'RECEIVED',
          cnt: this.cnt,
          message: message,
          username: from,
          time: new Date()
        })
        this.cnt++
        this.data.msgcnt++
        this.data.__ob__.dep.notify()
      }
    },

    closePrivateChat: function ({from, target}) {
      if (from === this.data.username) {
        this.canWrite = false
        this.privateCamera = false
        this.messages.push({
          type: 'RECEIVED',
          cnt: this.cnt,
          message: `${from} is left the private chat`,
          username: 'SYSTEM',
          time: new Date()
        })
      }
    },

    PCSignaling: function ({ target, from, candidate, sdp, type, room }) {
      if (from === this.$store.state.username) return

      if (sdp) {
        if (sdp.type === PCSIGNAL.OFFER) {
          this.openCamera(sdp, from)
        } else if (sdp.type === PCSIGNAL.ANSWER) {
          this.videoAnswer = { ...this.videoAnswer, remoteDesc: sdp }
        } else {
          console.warn('[DEV] Unsupported SDP type')
        }
      } else if (candidate) {
        this.videoAnswer = { ...this.videoAnswer, candidate }
      } else {
        this.videoAnswer = { ...this.videoAnswer, video: undefined, remoteDesc: undefined, from: undefined }
        this.privateCamera = false
      }
    }
  },

  created () {
    this.username = this.$store.state.username
  },

  mounted () {
    this.$refs.dialog.$el.children[1].style.padding = 0
    this.$refs.modaldialog.style.display = 'block' // <b-modal> creates a new layer, so use css instead of that
    this.$refs.dialog.style.transform = 'translate(-50%, -50%)'
  },

  computed: {

  },

  beforeDestroy () {
    this.closePrivate()
  },

  methods: {

    openCamera (sdp, from) {
      this.videoAnswer = { ...this.videoAnswer, video: true, remoteDesc: sdp, from }
      this.privateCamera = true
    },

    startCamera () {
      this.privateCamera = true
    },

    close: function (e) {
      this.$emit('close', this.data)
    },

    onCloseCall () {
      this.privateCamera = false
    },

    closePrivate () {
      this.$socket.emit(EVENTS.CLOSE_PRIVATE, { from: this.$store.getters.getUserName, target: this.data.username })
    },

    minimize (event) {
      this.data.minimized = true
      this.data.msgcnt = 0
      this.data.__ob__.dep.notify()
      this.display = false
    },

    submit (e) {
      if (this.msg.length > 0) {
        this.$socket.emit(EVENTS.SEND_PRIVATE_MESSAGE, {
          username: this.$store.getters.getUserName,
          to: this.data.username,
          message: this.msg,
          status: this.$store.state.status
        })

        this.messages.push({
          type: 'SENT',
          cnt: this.cnt,
          message: this.msg,
          username: this.$store.getters.getUserName,
          time: new Date()
        })

        this.cnt++
        this.msg = ''
      }
    }

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

  .modal {
    display: block;
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
