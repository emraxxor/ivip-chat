const repository = require('../repository')
const fs = require('fs')
const { DATASTORE } = require('../config/index')
const imageThumbnail = require('image-thumbnail')
const crypto = require("crypto")

/**
 * @author Attila Barna
 */
class UserService {

  constructor() {

  }

  async profileImage( uid, image) {
     const user = await repository.userById(uid)
     if ( user ) {
       try {
          const folder = DATASTORE.USER.PROFILE + '/' + uid

          if ( ! fs.existsSync(folder) )
            fs.mkdirSync(folder);

            const data = image.split("base64,")[1]
            const filename = crypto.randomBytes(50).toString('hex') + '.png'
            const file =  folder + '/' + filename
            const thumbnail = await imageThumbnail(data, { width: 320, height: 240});
            await repository.updateProfilePicture(uid, filename)
            fs.writeFileSync(file, thumbnail )
        } catch(e) {
            console.log('ERROR: ' + e)
        }
     }
     return res.status(200).send({ code: 200, message: 'OK'  })
  }


  async userByName( username ) {
     return (await repository.userByName(username))
  }

  async login(username, userpassword) {
      return (await repository.login(username, userpassword))
  }

}


module.exports = new UserService()
