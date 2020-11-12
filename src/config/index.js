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
  DECLINE_PRIVATE : 'declinePrivate',
  SUBMIT_MESSAGE : 'publicMessage',
  ASK_PRIVATE : 'askPrivate',
  SEND_PRIVATE_MESSAGE : 'privateMessage',
}


export const STATUS = {
  AVAILABLE: 'available',
  AWAY: 'away',
  BUSY : 'busy'
}
