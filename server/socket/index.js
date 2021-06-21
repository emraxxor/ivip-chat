const events = require('./events.js')
const redis = require('../redis')
const { CONFIG, CONFIG_ROOMS } = require('../config/index.js')
const logger = require('simple-node-logger').createLogManager().createLogger('[SOCKET]')

// Socket namespace
let namespace

// on Connection
const onConnection = async (socket) => {
  logger.info(`Socket connected to port ${CONFIG.PORT}`)

  let userRoom, userName
  const clientIp = socket.request.connection.remoteAddress

  socket.on('joinRoom', async ({ username, room, status }) => {
    logger.info(`[SOCKET] User ${username} - ${clientIp} wants to join the room ${room}`)
    const udata = (await redis.getUser(username))

    if (!udata) { return }

    socket.join(room, async () => {
      logger.info(`User ${username} joined the room ${room}`)
      userRoom = room
      userName = username

      try {
        const users = await redis.usersByRoom(room)
        namespace.in(room).emit('userJoinedToRoom', { users, username })
      } catch (error) {
        logger.info(error)
      }
    })

    socket.join(`user:${username}`)
  })

  socket.on('acceptPrivate', events.acceptPrivate(socket, namespace))
  socket.on('alive', events.alive(socket, namespace))
  socket.on('acceptCamera', events.acceptCamera(socket, namespace))
  socket.on('declinePrivate', events.declinePrivate(socket, namespace))
  socket.on('declineCamera', events.declineCamera(socket, namespace))
  socket.on('askPrivate', events.askPrivateChat(socket, namespace))
  socket.on('askCamera', events.askCamera(socket, namespace))
  socket.on('publicMessage', events.publicMessage(socket, namespace))
  socket.on('leaveRoom', events.leaveRoom(socket, namespace))
  socket.on('privateMessage', events.privateMessage(socket, namespace))
  socket.on('PCSignaling', events.PCSignaling(socket, namespace))
  socket.on('closePrivateChat', events.closePrivateChat(socket, namespace))

  socket.on('kickUser', async ({user, room}) => {
    const udata = await redis.getUser(userName)
    logger.info(`[EVENT] Kick user, room : ${room} , Moderator: ${userName},  user : ${user} `)

    if (udata.grant === 'admin') {
      await redis.deleteUserFromPrivates(user)
      await redis.deleteUser(user)
      await CONFIG_ROOMS.forEach(e => redis.deleteUserFromRoom(e.id, user))
      namespace.in(`user:${user}`).emit('kickUser', { user, room })
    }
  })

  socket.on('disconnect', async () => {
    logger.info(`User "${userName}" leaves the chat`)
    try {
      events.leaveChat(socket, namespace)({
        room: userRoom,
        username: userName
      })
    } catch (error) {
      logger.info(error)
    }
  })
}

exports.createNameSpace = (io) => {
  exports.io = io
  namespace = io
    .of(CONFIG.CHAT_NAMESPACE)
    .on('connection', onConnection)
}
