const http = require('http')
const redis = require('socket.io-redis')
const app = require('./app')
const config = require('./config')
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
