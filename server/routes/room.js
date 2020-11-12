const express = require('express');
const redis = require('../redis')
const config = require('../config')

const RoomRouter = express.Router()
module.exports = RoomRouter


const rooms = [
  {
      id: 'ROOM_ARENA',
      name: 'Arena'
  }
]


// route for get rooms
RoomRouter.get('/', (req,res) => {
  res.send(rooms)
})

module.exports = RoomRouter
