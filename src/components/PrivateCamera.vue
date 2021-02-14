<template>
  <div class="video_private_container">
      <div class="video">
            <video ref="LocalVideo" class="video__myself" autoplay="true" muted="muted"></video>
      </div>
      <div class="video">
           <video ref="RemoteVideo" class="video__partner" autoplay></video>
     </div>
     <div class="video-turn-off">
       <button type="button" @click="closeVideoCall()"><i class="fa fa-power-off" aria-hidden="true"></i></button>
     </div>
  </div>
</template>
<script>
import { EVENTS, ICESERVERS } from '../config'
import { VideoConfiguration } from './VideoConfiguration'

/**
 * @author Attila Barna
 */
export default {
  props: {
    to: String,
    room: String,
    videoAnswer: Object,
    callee : {
      default: false
    }
  },
  mixins:[ VideoConfiguration ],

  data: () => ({
     constraints: {
      video: {
        width: 150,
        height: 120
      }
    },

    // Peer connection
    pc: undefined,
    remoteStream: undefined,
    remoteVideo: {},
  }),

  created() {
  },

  async created() {
    await this.startLocalMedia()
    await this.initAudioVideo()

    this.createPeerConnection()
    this.addLocalStream(this.pc)


    this.events()
    this.onAddStream()


    if ( !this.videoAnswer.video )
      // CALLER
      this.invite(this.pc, this.to, this.room)
    else
      // CALLEE
      this.handleVideoOfferMsg(this.videoAnswer.remoteDesc, this.pc, this.videoAnswer.from, this.room)
  },

  async mounted() {
    this.myVideo = this.$refs.LocalVideo
    this.remoteVideo = this.$refs.RemoteVideo
  },

  beforeDestroy() {
    this.closeVideoCall()
  },

  methods: {

    createPeerConnection() {
      if ( !this.pc )
       this.pc = new RTCPeerConnection(ICESERVERS)
    },

    async handleNewIceCandidateMsg(candidate) {
      try {

        if ( !this.pc )
          throw new Error("IllegalStateException")

        console.log(`[DEV] ${this.username} added a candidate : `);
        console.log(candidate)
        await this.pc.addIceCandidate(candidate);
        console.log(`[DEV] Candidate added successfully`);
      } catch (error) {
        console.log(`[DEV] Error adding a candidate in ${this.username}. Error: ${error}`)
      }
    },


    events() {

      // handleICECandidateEvent()
      this.pc.onicecandidate = ({ candidate }) => {
        if (!candidate) return
                console.log(`[DEV] ${this.username} try to send candidate`)
                setTimeout(() => {
                    console.log(`[DEV] Sending ICE candidate to ${this.to} , room: ${this.room} , from: ${this.from} `)
                    console.log(candidate)
                    this.$socket.emit(EVENTS.PC_SIGNALING, {
                        candidate,
                        target: this.to,
                        type : 'new-ice-candidate',
                        from: this.username,
                        room: this.room,
                    })
                }, 4500)
      }

     this.pc.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
     this.pc.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
     this.pc.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    },


    closeVideoCall() {
       if ( this.pc ) {
         this.$emit('closeCall');
         this.pc.close()
         this.pc = null
       }

       this.$socket.emit(EVENTS.PC_SIGNALING, {
          target: this.to,
          type : 'close-video-call',
          from: this.$store.state.username,
          room: this.room
        })
    },


    handleICEGatheringStateChangeEvent(event) {
    },

     handleSignalingStateChangeEvent(event) {
      switch(this.pc.signalingState) {
        case "closed":
          this.closeVideoCall();
          break;
      }
    },


    handleICEConnectionStateChangeEvent(event) {
      switch(this.pc.iceConnectionState) {
        case "closed":
        case "failed":
          this.closeVideoCall();
          break;
      }
    },


    onAddStream() {
      this.pc.onaddstream = event => {
        if (!this.remoteVideo.srcObject && event.stream) {
          this.remoteStream = event.stream
          this.remoteVideo.srcObject = this.remoteStream
        }
      }
    },

  },

  watch: {
    videoAnswer: async function(newv, oldv) {
      const desc = newv.remoteDesc
      const candidate = newv.candidate

      if (!!desc && desc !== oldv.remoteDesc) {
        console.log('Set remote description')
        console.log(desc)
        await this.setRemoteDescription(desc, this.pc)
      }

      if (!!candidate && candidate !== oldv.candidate)
        await this.handleNewIceCandidateMsg(candidate)


    }
  }

}

</script>

<style lang="scss" scoped>
.video {
  position: relative;
  width: 150px;
  height: 120px;

  &__partner {
    height: 100%;
    background-color: #353535;
  }

  &__myself {
    border: 1px solid #8e8e8e;
    bottom: 0;
    position: absolute;
    float: right;
    width: 150px;
    height: 120px;
    right: 0;
    height: 100px;
    z-index: 2;
  }

  &__spinner {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>

