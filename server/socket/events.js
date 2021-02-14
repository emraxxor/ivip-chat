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
        redis.addPrivateChat(to,from)
        namespace.in(`user:${to}`).emit('notice',  {  username: from , type: type   }  )
      } else {
        // notice the user about the given user is no longer available on the chat
        // #todo
      }
}


/**
 * Remote user is accepted the request to camera
 */
const acceptCamera = (socket,namespace) => async({to , from , type }) => {
  console.log(`${from} is accepted request to camera for ${to} `)
  const user = await redis.getUser(to)
  if ( user ) {
    redis.addCamera(from,to)
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
 * Remote user is declined the request to camera
 *
 * @param socket
 * @param namespace
 */
const declineCamera = (socket,namespace) => async({to , from , type }) => {
  console.log(`${from} is declined private request to camera for ${to}`)
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
            namespace.in(`user:${to}`).emit('notice',  { username, to , status, authenticated , type: 'ask_private' }  )
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
 * Remote user {username} ask a permission for the webcam
 */
const askCamera = (socket, namespace) => async ({ username, to , status, authenticated  }) => {
  console.log(`Camera ask : ${username} -> ${to} `)

  try {
    const user = await redis.getUser(to)
    if ( user ) {
        if ( ! await redis.existsCamera(username,to)   ) {
            console.log(`Ask user: ${to}`)
            namespace.in(`user:${to}`).emit('notice',  { username, to , status, authenticated , type: 'ask_camera' }  )
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
      const privs = await redis.getPrivateChat(username)
      const users = await redis.usersByRoom(room)

      if ( privs  )
        privs.forEach( e => namespace.in(`user:${e}`).emit('closePrivateChat',  { from: username, target: e  } ) ) ;

      await redis.deleteUserFromPrivates(username)
      await redis.deleteUserFromRoom(room, username)
      await redis.deleteUser(username)

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
 *  Closing private chat
 *
 * @param  socket
 * @param  namespace
 */
const closePrivateChat = (socket, namespace) => async ({ from, target }) => {
  try {
      console.log(`${from} is closed the privet chat with ${target}`)
      await redis.removePrivateChat(from,target)
      namespace.in(`user:${target}`).emit('closePrivateChat',  { from, target  } )
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



const PCSignaling = (namespace) => ({ target , from, room , candidate ,type, sdp  }) => {
  console.log(`[PC] Private chat - User "${from}" sends a ${type} to "${target}"`)
  namespace.in(`user:${target}`).emit('PCSignaling',  {  target , from, candidate, sdp, type, room })
}


module.exports = {
    privateMessage,
    acceptPrivate,
    declinePrivate,
    publicMessage,
    leaveRoom,
    leaveChat,
    askPrivateChat,
    askCamera,
    acceptCamera,
    declineCamera,
    PCSignaling,
    closePrivateChat
}
