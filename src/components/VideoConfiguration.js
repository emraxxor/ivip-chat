import { EVENTS, ICESERVERS, log } from '../config'
import crypto from 'crypto'

/**
 * Steps :
 *
 * 1. Caller
 *   invite():
 *     1.Create an RTCPeerConnection
 *     2.Call getUserMedia() to access the webcam and microphone
 *     3.Promise fulfilled: add the local stream by calling RTCPeerConnection.addStream()
 *
 *   handleNegotiationNeededEvent():
 *    1.Create an SDP offer by calling RTCPeerConnection.createOffer()
 *    2.Promise fulfilled: set the description of Naomi’s end of the call by calling RTCPeerConnection.setLocalDescription()
 *    3.Promise fulfilled: send the offer through the signaling server to Priya in a message of type “video-offer”
 *
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
 *
 * 2. Callee
 *    handleNewIceCandidateMsg() :
 *       1.Create an RTCIceCandidate object using the SDP provided in the candidate.
 *       2.Deliver the candidate to Priya’s ICE layer by passing it to RTCPeerConnection.addIceCandidate()
 *
 *
 */
export const VideoConfiguration = {
  data () {
    return {
      // Media config
      constraints: {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        },
        video: {
          width: 400,
          height: 250
        }
      },

      // TURN/STUN ice servers
      configuration: ICESERVERS.servers,

      // Offer config
      offerOptions: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      },

      // Local video
      myVideo: undefined,
      localStream: undefined,
      username: ''
    }
  },

  created () {
    this.username = this.$store.state.username
  },

  beforeDestroy () {
    this.localStream.getTracks().forEach(track => track.stop())
  },

  methods: {

    async startLocalMedia () {
      log(`Requesting ${this.username} video stream`)
      if ('mediaDevices' in navigator) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(this.constraints)
          this.myVideo.srcObject = stream
          this.myVideo.volume = 0
          this.localStream = stream
        } catch (error) {
          log(`getUserMedia error: ${error}`)
        }
      }
    },

    initAudioVideo () {
      const video = this.localStream.getVideoTracks()
      const audio = this.localStream.getAudioTracks()

      if (video.length > 0) log(`Using video device: ${video[0].label}`)
      if (audio.length > 0) log(`Using audio device: ${audio[0].label}`)
    },

    async setRemoteDescription (remoteDesc, pc) {
      try {
        log(`[DEV] ${this.username} setRemoteDescription: start`)
        await pc.setRemoteDescription(remoteDesc)
        log(`[DEV] ${this.username} setRemoteDescription: finished`)
      } catch (error) {
        log(`[DEV] Error setting the RemoteDescription in ${this.username}. Error: ${error}`)
      }
    },

    async invite (pc, to, room) {
      log(`[DEV] invite ${pc} to : ${to} room: ${room}`)
      try {
        const offer = await pc.createOffer(this.offerOptions)
        await pc.setLocalDescription(offer)
        this.sendPCSignaling(pc.localDescription, 'video-offer', to, room)
      } catch (error) {
        log(`[DEV] Error creating the offer from ${this.username}. Error: ${error}`)
      }
      return null
    },

    async createAnswer (pc, to, room) {
      log(`[DEV] ${this.username} create an answer: start`)
      try {
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        this.sendPCSignaling(pc.localDescription, 'video-answer', to, room)
      } catch (error) {
        log(`[DEV] Error creating the answer from ${this.username}. Error: ${error}`)
      }
    },

    async handleVideoOfferMsg (desc, pc, from, room) {
      log(`[DEV] handleVideoOfferMsg: ${this.username} gets an offer from ${from}`)
      await this.setRemoteDescription(desc, pc)
      this.createAnswer(pc, from, room)
    },

    sendPCSignaling (sdp, type, to, room) {
      log(`[DEV] ${this.username} sends the ${type} through the signal channel to ${to} in room ${room}`)
      this.$socket.emit(EVENTS.PC_SIGNALING, {
        sdp: sdp,
        target: to,
        type: type,
        from: this.username,
        room: room
      })
    },

    addLocalStream (pc) {
      pc.addStream(this.localStream)
    },

    pauseVideo () {
      this.localStream.getVideoTracks().forEach(t => (t.enabled = !t.enabled))
    },

    pauseAudio () {
      this.localStream.getAudioTracks().forEach(t => (t.enabled = !t.enabled))
    },

    TURNCredentials (name, secret) {
      // eslint-disable-next-line one-var
      let unixTimeStamp = parseInt(Date.now() / 1000) + 24 * 3600, // this credential would be valid for the next 24 hours
        username = [unixTimeStamp, name].join(':'),
        password,
        hmac = crypto.createHmac('sha1', secret)
      hmac.setEncoding('base64')
      hmac.write(username)
      hmac.end()
      password = hmac.read()
      return {
        username: username,
        password: password
      }
    }
  }
}
