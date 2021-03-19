const express = require('express')
const { DefaultJwtMiddleWare } = require('../jwt')
const UserService = require('../services/user-service')
const UserRouter = express.Router()
const { DATASTORE } = require('../config/index')
const path = require('path');
const fs = require('fs')



UserRouter.put('/image', DefaultJwtMiddleWare , async (req, res) =>  {
  const { user, body } = req

  if ( body.image ) {
    UserService.profileImage(user.id, body.image)
    return res.status(200).send({ code: 200, message: 'Ok' , data : {}  })
  }
})


UserRouter.get('/image/:name', async (req, res) =>  {
  const name = req.params.name

  try {
      const user = await UserService.userByName(name)
      if ( user ) {
        const file = `${DATASTORE.USER.PROFILE }/${user.id}/${user.picture}`
        if ( ! fs.existsSync(file) )
          throw Error("Image does not exists")

        return res.sendFile(file)
      } else {
        throw Error("User does not exists")
      }
  }
  catch(error) {
      return res.sendFile(path.resolve('server/assets/user-profile.png'))
  }

})

module.exports = UserRouter
