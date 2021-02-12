const http = require('http')
const redis = require('socket.io-redis')
const app = require('./app')
const fs = require('fs')
const config = require('./config')

//const server = http.createServer({key: fs.readFileSync('ssl/server.key'),cert: fs.readFileSync('ssl/server.cert')},app)
const server = http.createServer(app)

// Attach server to the socket
app.io.attach(server)
app.io.origins([config.ORIGINS])

app.io.adapter(redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT
}))

server.listen(config.PORT, () => {
    console.log(`Server Listening on port ${config.PORT}`)
})
