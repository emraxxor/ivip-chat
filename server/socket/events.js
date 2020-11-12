const redis = require('../redis')


/**
 * The given user leaves the given room
 */
const leaveRoom = (socket, namespace) => ({ room, username }) => {
  socket.leave(room, async () => {
      console.log(`[EVENT] User "${username}" left the room ${room}`)

      try {
        // todo user leaves the room
      } catch (error) {
          console.log(error)
      }
  })
}

/**
 * Remote user is accepted the request
 */
const acceptPrivate = (socket,namespace) => async({to , from , type }) => {
      console.log(`${from} is accepted private request for ${to} `)
      const user = await redis.getUser(to)
      if ( user ) {
        redis.addPrivateChat(from,to)
        namespace.in(`user:${to}`).emit('notice',  {  username: from , type: type   }  )
      } else {
        // notice the user about the given user is no longer available on the chat
        // #todo
      }
}

/**
 * Remote user is declined the private request
 *
 * @param socket
 * @param namespace
 */
const declinePrivate = (socket,namespace) => async({to , from , type }) => {
      console.log(`${from} is declined private request for ${to}`)
      const user = await redis.getUser(to)
      if ( user ) {
        namespace.in(`user:${to}`).emit('notice',  {  username: from , type : type  }  )
      } else {
        // notice the user about the given user is no longer available on the chat
        // #todo
      }
}

/**
 * Remote user initiates a conversation
 */
const askPrivateChat = (socket, namespace) => async ({ username, to , status, authenticated  }) => {
  console.log(`Private chat ask : ${username} -> ${to} `)

  try {
    const user = await redis.getUser(to)
    if ( user ) {
        if ( ! await redis.existsPrivateChat(username,to)   ) {
            console.log(`Ask user: ${to}`)
            namespace.in(`user:${to}`).emit('notice',  { username, to , status, authenticated , type: 'ask' }  )
        }
    } else {
      // notice the user about the given user is no longer available on the chat
      // #todo
    }
  } catch(error) {
    console.log(error)
  }
}


/**
 * Send private message to the given user
 */
const privateMessage = (socket, namespace) => async ({ username, to , message, status }) => {
  console.log(`Private chat : ${username} -> ${to} `)

  try {
    const user = await redis.getUser(to)
    if ( user ) {
        if ( await redis.existsPrivateChat(username,to) || await redis.existsPrivateChat(to,username)   ) {
            console.log(`Send message from: ${username} to user: ${to} , msg: ${message} `)
            namespace.in(`user:${to}`).emit('privateMessage',  { from: username, to: to , message, status  } )
        }
    } else {
      // notice the user about the given user is no longer available on the chat
      // #todo
    }
  } catch(error) {
    console.log(error)
  }
}


/**
 * Its called when the user closes their browser
 *
 * @param  socket
 * @param  namespace
 */
const leaveChat = (socket, namespace) => async ({ room, username }) => {
  try {
      await redis.deleteUserFromRoom(room, username)
      await redis.deleteUser(username)
      const users = await redis.usersByRoom(room)

      socket.leave(`user:${username}`)
      socket.leave(room, () => {
          console.log(`[EVENT] User "${username}" left the room ${room}`)
          namespace.in(room).emit('leaveChat', { users,  username: username,  message: `${username} left the room`})
      })
  } catch (error) {
      console.log(error)
  }
}

/**
 * A public message has been sent in a public room
 * The current message is going to be broadcasted for all the users who are already in the specified room
 * @param namespace
 */
const publicMessage = (namespace) => ({ room, message, username }) => {
  console.log(`[EVENT] Public messsage, room : ${room} , message: ${message} , username : ${username} `)
  namespace.in(room).emit('publicMessage', { message, username })
}


module.exports = {
    privateMessage,
    acceptPrivate,
    declinePrivate,
    publicMessage,
    leaveRoom,
    leaveChat,
    askPrivateChat
}
