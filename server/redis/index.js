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
Redis.prototype.addUser = function (room, socketId, userObject) {
  this.client
      .hsetAsync(room, socketId, JSON.stringify(userObject))
      .then(
          ()  => console.debug('addUser ', userObject.username + ' added to the room ' + room),
          err => console.log('addUser', err)
      )
}
