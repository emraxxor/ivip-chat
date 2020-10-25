export const url = `${process.env.VUE_APP_SOCKET_HOST || 'http://localhost'}:${process.env.VUE_APP_SOCKET_PORT || '3000'}`

export const STORE_ACTIONS = {
    joinRoom: 'joinRoom'
}
