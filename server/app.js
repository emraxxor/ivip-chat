const express = require('express')
const app = express()
const io = app.io = require('socket.io')()
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const authentication = require('./routes/authentication')
const user = require('./routes/user')
const rooms = require('./routes/room')
const socket = require('./socket')

app.use(cors())
app.use(bodyParser.json())

// MIDDLEWARE
app.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

// ROUTING
app.use('/authentication', authentication)
app.use('/user', user)
app.use('/rooms', rooms)

app.use(express.static(path.join(__dirname, '../dist')))

socket.createNameSpace(io)

module.exports = app
