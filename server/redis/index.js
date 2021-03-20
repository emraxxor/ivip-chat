const redis = require('redis')
const bluebird = require('bluebird')
const { CONFIG } = require('../config')

// Using promises
bluebird.promisifyAll(redis)

function Redis() {
  this.client = redis.createClient({
      host: CONFIG.REDIS_HOST
  })
}

/**
* Add a user to the specified room
*/
Redis.prototype.addUser = function (room, uid , udata) {
  console.log(`[REDIS] Add ${uid} to ${room} udata: ${JSON.stringify(udata)}`)

  udata.rooms = [room];
  udata.alive = new Date( new Date().getTime() + (120*1000) )

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
          if ( users )
            return Object.keys(users).map(e => JSON.parse(users[e]))

          return []
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
 * Get user by room and uid
 */
Redis.prototype.getUserByRoom = function (room, uid) {
  return this.client
      .hgetAsync(room, uid)
      .then(
          res => JSON.parse(res),
          err => { console.log('getUserByRoom ', err) }
      )
}


Redis.prototype.getUser = async function (uid) {
  return this.client
      .hgetAsync('users', uid)
      .then(
          res => JSON.parse(res),
          err => { console.log('getUser ', err) }
      )
}

Redis.prototype.alive = async function (uid) {
  const user = this.getUser(uid)
  if ( user ) {
    user.alive = new Date( new Date().getTime() + (400*1000) )

    this.client
    .hsetAsync('users', uid , JSON.stringify(user))
    .then(
        ()  => {},
        err => console.log('alive', err)
    )
  }
}

Redis.prototype.removePrivateChat = async function (ufrom,uto) {
  let privs = await this.getPrivateChat(ufrom)
  if ( privs && privs.indexOf(uto) !== -1 ) {
      privs = privs.filter( e => e !== uto)
      this.setPrivateChat(ufrom,privs)
  }
}


Redis.prototype.setPrivateChat = async function (ufrom, data) {
  return await this.client
      .hsetAsync('privates', ufrom, JSON.stringify(data))
      .then(
        ()  => console.debug('setPrivateChat ', `Private ufrom:${ufrom} to ${data}`),
        err => { console.log('setPrivateChat ', err) }
      )
}

Redis.prototype.existsPrivateChat = async function (ufrom,uto) {
  const privs = await this.getPrivateChat(ufrom)
  return privs && privs.indexOf(uto) !== -1 ;
}


Redis.prototype.existsCamera = async function (ufrom,uto) {
  const cams = await this.getCamera(ufrom)
  return cams && cams.indexOf(uto) !== -1 ;
}

Redis.prototype.addPrivateChat = async function (ufrom,uto) {
  const privs = await this.getPrivateChat(ufrom)
  if ( privs && privs.indexOf(uto) === -1 ) {
      privs.push(uto)
      await this.setPrivateChat(ufrom,privs)
  }  else if ( !privs ) {
    let data = [uto]
    await this.setPrivateChat(ufrom,data)
  }
}

Redis.prototype.setCamera = async function (ufrom, data) {
  return await this.client
      .hsetAsync('webcams', ufrom, JSON.stringify(data))
      .then(
        ()  => console.debug('setCamera ', `Camera from:${ufrom} to ${data}`),
        err => { console.log('setCamera ', err) }
      )
}

Redis.prototype.addCamera = async function (ufrom,uto) {
  const cams = await this.getCamera(ufrom)
  if ( cams && cams.indexOf(uto) === -1 ) {
      cams.push(uto)
      await this.setCamera(ufrom,cams)
  }  else if ( !cams ) {
    let data = [uto]
    await this.setCamera(ufrom,data)
  }
}

Redis.prototype.removeCamera = async function (ufrom,uto) {
  const cams = await this.getCamera(ufrom)
  if ( cams && cams.indexOf(uto) !== -1 ) {
      cams = cams.filter( e => e !== uto)
      this.setCamera(ufrom,cams)
  }
}

Redis.prototype.getCamera = async function (ufrom) {
  return await this.client
      .hgetAsync('webcams', ufrom)
      .then(
          res => JSON.parse(res),
          err => { console.log('getCamera ', err) }
      )
}

Redis.prototype.getPrivateChat = async function (ufrom) {
  return await this.client
      .hgetAsync('privates', ufrom)
      .then(
          res => JSON.parse(res),
          err => { console.log('getPrivateChat ', err) }
      )
}


/**
 * Delete the given user from the privates
 */
Redis.prototype.deleteUserFromPrivates = function (username) {
  this.client
      .hdelAsync('privates', username)
      .then(
          res => (res),
          err => { console.log('deleteUserFromPrivates ', err) }
      )
}

/**
 * Delete the given user from the room
 */
Redis.prototype.deleteUserFromRoom = function (room, uid) {
  if ( !room || !uid )
    return

  if ( !this.getUserByRoom(room,uid) )
    return

  this.client
      .hdelAsync(room, uid)
      .then(
          res => (res),
          err => { console.log('deleteUserFromRoom ', err) }
      )
}


/**
 * Delete the given user from the room
 */
Redis.prototype.deleteUser = function (uid) {
  this.client
      .hdelAsync('users', uid)
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
