const https = require('https')
const redis = require('socket.io-redis')
const app = require('./app')
const fs = require('fs')
const { CONFIG } = require('./config')
const logger = require('simple-node-logger').createLogManager().createLogger('[MAIN]')

const server = https.createServer({key: fs.readFileSync('ssl/server.key'), cert: fs.readFileSync('ssl/server.cert')}, app)
// const server = http.createServer(app)
// Attach server to the socket
app.io.attach(server)
app.io.origins([CONFIG.ORIGINS])

app.io.adapter(redis({
  host: CONFIG.REDIS_HOST,
  port: CONFIG.REDIS_PORT
}))

server.listen(CONFIG.PORT, () => {
  logger.info(`Server Listening on port ${CONFIG.PORT}`)
})
