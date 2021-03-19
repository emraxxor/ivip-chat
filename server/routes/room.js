const express = require('express');
const { CONFIG_ROOMS } = require('../config');
const redis = require('../redis')

const RoomRouter = express.Router()
module.exports = RoomRouter

// route for get rooms
RoomRouter.get('/', (req,res) => {
  res.send(CONFIG_ROOMS)
})

module.exports = RoomRouter
