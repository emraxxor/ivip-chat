const jwtMiddleWare = require('express-jwt')
const { CONFIG } = require('../config')
const middleware = jwtMiddleWare({secret: CONFIG.KEY,algorithms:['HS256']})

module.exports = {
    DefaultJwtMiddleWare : middleware
}
