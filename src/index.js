const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', () => {
    console.log('New Web Socket Connection')
})

server.listen(3000, () => {
    console.log('Server is Running on Port 3000')
})
