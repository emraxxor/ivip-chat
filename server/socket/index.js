const events = require('./events.js')
const config = require('../config')
const redis = require('../redis')

// Socket namespace
let namespace

// on Connection
const onConnection = (socket) => {
  console.log(`Socket connected to port ${config.PORT}`)
  let userRoom, userName

  socket.on('joinRoom', ({ username, room, status }) => {
      console.log(`User ${username} wants to join the room ${room}`)

      socket.join(room, async () => {
          console.log(`User ${username} joined the room ${room}`)
          userRoom = room
          userName = username

          try {
              await redis.addUser(room, userName, { username, status, privateChat: false, conference: false })
              const users = await redis.getUsers(room)
              namespace.in(room).emit('newUser', { users, username })
          } catch (error) {
              console.log(error)
          }


      })

    })
}

exports.createNameSpace = (io) => {
  exports.io = io
  namespace = io
      .of(config.CHAT_NAMESPACE)
      .on('connection', onConnection)
}
