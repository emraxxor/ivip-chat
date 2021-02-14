const express = require('express');
const redis = require('../redis')
const config = require('../config')

const AuthenticationRouter = express.Router()

AuthenticationRouter.post('/login', (req, res) => {
  const data = req.body

  console.log(`Login user ${data.username}`)

  // #TODO
  // Implement login method here
  // By default there is no authentication method implemented

  if (!data.username) return res.send({ code: 400, message: 'Data is required' })

  redis
  .getUser(data.username, config.KEY)
  .then(user => {
    if (!user) {
      redis.addUser(data.username, config.KEY, data)
      console.log(`User ${data.username} logged`)
      return res.send({ code: 200, message: 'Logged in succesfully' , data : data })
    }

    // FOR TEST
    //redis.deleteUser(data.username, config.KEY)

    // The given user name is already used by somebody
    console.log(`User ${data.username} already exists`)
    return res.send({ code: 401, message: 'Username already exists' })
  })
})





module.exports = AuthenticationRouter
