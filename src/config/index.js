export const URL = `${process.env.VUE_APP_SOCKET_HOST || 'http://localhost'}:${process.env.VUE_APP_SOCKET_PORT || '3000'}`

export const ACTIONS = {
    AUTHENTICATE : 'authenticate',
    JOIN_ROOM : 'joinRoom',
    ROOMS_LIST  : 'rooms',
    UPDATE_ROOM : 'updateRoom'
}


export const EVENTS = {
  JOIN_ROOM: 'joinRoom',
  ACCEPT_PRIVATE : 'acceptPrivate',
  ACCEPT_CAMERA : 'acceptCamera',
  DECLINE_PRIVATE : 'declinePrivate',
  DECLINE_CAMERA : 'declineCamera',
  SUBMIT_MESSAGE : 'publicMessage',
  ASK_PRIVATE : 'askPrivate',
  ASK_CAMERA : 'askCamera',
  SEND_PRIVATE_MESSAGE : 'privateMessage',
  PC_SIGNALING : 'PCSignaling',
}


export const STATUS = {
  AVAILABLE: 'available',
  AWAY: 'away',
  BUSY : 'busy'
}

export const PCSIGNAL = {
  OFFER : 'offer',
  ANSWER : 'answer'
}

export const log = (arg) => {
  var now = (window.performance.now() / 1000).toFixed(3)
  console.log(`${now}: ${arg}`)
}

export const ICESERVERS = {
  iceServers : [
     {
      urls: 'turn:server.com:3478',
      username: 'user',
      credential: 'password'
     },
     {
      urls: 'stun:stun.l.google.com:19302',
     },
  ],
  iceTransportPolicy: "relay"
}
