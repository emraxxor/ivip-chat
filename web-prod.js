const express = require("express");
const app = express()
const http = require('https')
const fs = require('fs')
const path = require("path");
const io = app.io = require('socket.io')()
//const server = http.createServer(app)
const server = http.createServer({key: fs.readFileSync('ssl/server.key'),cert: fs.readFileSync('ssl/server.cert')},app)

const DIST_DIR = path.join(__dirname, "dist");
const PORT = process.env.WEB_PORT || 8080;
const ORIGINS = process.env.ORIGINS || '*:*';

// Attach server to the socket
app.io.attach(server)
app.io.origins([ORIGINS])

app.use(express.static(DIST_DIR));

app.get("*", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

server.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`)
})
