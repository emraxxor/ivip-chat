const redis = require('../redis')


const leaveRoom = (socket, namespace) => ({ room, username }) => {
  socket.leave(room, async () => {
      console.log(`[EVENT] User "${username}" left the room ${room}`)

      try {
          await redis.deleteUser(room, username)
          const users = await redis.getUsers(room)
          namespace.in(room).emit('userJoinedToRoom', { users, username })
      } catch (error) {
          console.log(error)
      }
  })
}


const leaveChat = (socket, namespace) => async ({ room, username }) => {
  try {
      await redis.deleteUser(room, username)
      const users = await redis.getUsers(room)

      socket.leave(room, () => {
          console.log(`[EVENT] User "${username}" left the room ${room}`)
          namespace.in(room).emit('leaveChat', { users,  username: username,  message: `${username} left the room`})
      })
  } catch (error) {
      console.log(error)
  }
}


const publicMessage = (namespace) => ({ room, message, username }) => {
  console.log(`[EVENT] Public messsage, room : ${room} , message: ${message} , username : ${username} `)
  namespace.in(room).emit('publicMessage', { message, username })
}



module.exports = {
    publicMessage,
    leaveRoom,
    leaveChat
}
