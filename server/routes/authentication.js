const express = require('express');
const { CONFIG_ROOMS, CONFIG } = require('../config');
const jwt = require('jsonwebtoken');
const redis = require('../redis')
const userService = require('../services/user-service')
const AuthenticationRouter = express.Router()

AuthenticationRouter.post('/login', async (req, res) =>  {
  const data = req.body

  console.log(`Login user ${data.username}`)

  // #TODO
  // Implement login method here
  // By default there is no authentication method implemented

  if (!data.username || !data.password ) return res.send({ code: 400, message: 'Data is required' })
  const udata = await userService.login(data.username, data.password)

  if ( udata.username === undefined ) return res.send({ code: 401, message: 'Invalid username or password' })

  redis
    .getUser(data.username, udata.id)
    .then(user => {
        if (!user) {
            redis.addUser(data.room, data.username, udata)
            console.log(`User ${data.username} is logged in successfully`)
            const token = jwt.sign({ ...udata },CONFIG.KEY)
            udata.token = token.toString()
            return res.status(200).send({ code: 200, message: 'Logged in succesfully' , data : {room: data.room, ...udata}  })
        }

        // The given user name is already used by somebody
        console.log(`User ${data.username} already exists`)
        return res.send({ code: 401, message: 'Username already exists' })
    })
})





module.exports = AuthenticationRouter
