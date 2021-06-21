const CONFIG = {
  PORT: process.env.PORT || 3000,
  CHAT_NAMESPACE: '/ivip-chat',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  ORIGINS: process.env.ORIGINS || '*:*',

  // This key have to be hard to guess!
  KEY: 'secret'
}

const DATASTORE = {
  USER: {
    PROFILE: '/datastore/profile'
  }
}

const CONFIG_ROOMS = [
  {
    id: 'ROOM_ARENA',
    name: 'Arena'
  }
]

module.exports = { CONFIG, CONFIG_ROOMS, DATASTORE }
