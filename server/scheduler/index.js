const { CONFIG_ROOMS } = require('../config');
const cron = require('node-cron')
const redis = require('../redis')

class BaseScheduler {

    start() {
      cron.schedule('*/5 * * * *', async () => {
        const users = await redis.users()
        users.forEach( async user => {
            if ( new Date(user.alive) < new Date() ) {
              await redis.deleteUserFromPrivates(user.username)
              await redis.deleteUser(user.username)
              await CONFIG_ROOMS.forEach(e => redis.deleteUserFromRoom(e.id, user.username ))
            }
        });
      });
    }
}


module.exports = new BaseScheduler()
