const events = require('./events.js')
const config = require('../config')
const redis = require('../redis')

// Socket namespace
let namespace

// on Connection
const onConnection = (socket) => {
  console.log(`Socket connected to port ${config.PORT}`)

  let userRoom, userName, userStatus
  const clientIp = socket.request.connection.remoteAddress;


    socket.on('joinRoom', ({ username, room, status }) => {
      console.log(`[SOCKET] User ${username} - ${clientIp} wants to join the room ${room}`)

      socket.join(room, async () => {
          console.log(`User ${username} joined the room ${room}`)
          userRoom = room
          userName = username
          userStatus = status

          try {
              await redis.addUser(room, userName, { username, status  })
              const users = await redis.usersByRoom(room)
              namespace.in(room).emit('userJoinedToRoom', { users, username })
          } catch (error) {
              console.log(error)
          }
       })

       socket.join(`user:${username}`)

    })


    socket.on('acceptPrivate',  events.acceptPrivate(socket, namespace ) )
    socket.on('declinePrivate',  events.declinePrivate(socket, namespace ) )
    socket.on('askPrivate',  events.askPrivateChat(socket, namespace ) )
    socket.on('publicMessage', events.publicMessage(socket, namespace))
    socket.on('leaveRoom', events.leaveRoom(socket, namespace))
    socket.on('privateMessage', events.privateMessage(socket, namespace))


    socket.on('disconnect', async () => {
      console.log(`User "${userName}" leaves the chat`)
      try {
          events.leaveChat(socket, namespace)({
              room: userRoom,
              username: userName
          })
      } catch (error) {
          console.log(error)
      }
  })

}

exports.createNameSpace = (io) => {
  exports.io = io
  namespace = io
      .of(config.CHAT_NAMESPACE)
      .on('connection', onConnection)
}
