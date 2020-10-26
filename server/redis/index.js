const redis = require('redis')
const bluebird = require('bluebird')
const config = require('../config')

// Using promises
bluebird.promisifyAll(redis)

function Redis() {
  this.client = redis.createClient({
      host: config.REDIS_HOST
  })
}



/**
* Add a user to the specified room
*/
Redis.prototype.addUser = function (room, uid , udata) {
  console.log(`[REDIS] Add ${uid} to ${room} udata: ${JSON.stringify(udata)}`)

  udata.rooms = [room];

  this.client
      .hsetAsync(room, uid , JSON.stringify(udata))
      .then(
          ()  => console.debug('addUser ', udata.username + ' added to the room ' + room),
          err => console.log('addUser', err)
      )

  this.client
      .hsetAsync('users', uid , JSON.stringify(udata))
      .then(
          ()  => {},
          err => console.log('addUser', err)
      )
}

/**
 *  Get all connected users
 */
Redis.prototype.users = function () {
  return this.client
      .hgetallAsync('users')
      .then(users => {
          return Object.keys(users).map(e => JSON.parse(users[e]))
      }, error => {
          console.log('users ', error)
      })
}

/**
 * Get all users by room
 */
Redis.prototype.usersByRoom = function (room) {
  return this.client
      .hgetallAsync(room)
      .then(users => {
          return Object.keys(users).map(e => JSON.parse(users[e]))
      }, error => {
          console.log('users ', error)
      })
}


/**
 * Get user by room and socketId
 * @param  {} room
 * @param  {} socketId
 */
Redis.prototype.getUser = function (room, socketId) {
  return this.client
      .hgetAsync(room, socketId)
      .then(
          res => JSON.parse(res),
          err => { console.log('getUser ', err) }
      )
}


/**
 * Delete the given user from the room
 */
Redis.prototype.deleteUser = function (room, socketId) {
  return this.client
      .hdelAsync(room, socketId)
      .then(
          res => (res),
          err => { console.log('deleteUser ', err) }
      )
}


/**
 * Get the clients connected to the given room
 */
Redis.prototype.getClientsByRoom = function (io, namespace, room) {
  return new Promise((resolve, reject) => {
      io.of(namespace).adapter.clients([room], (err, clients) => {
          if (err) reject(err)
          resolve(clients)
      })
  })
}



module.exports = new Redis()
