const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log('New Web Socket Connection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    // Sending Message
    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not Allowed!')
        }

        io.emit('message', msg)
        callback('Delivered!')
    })

    // Sharing Location
    socket.on('sendLocation', (location, callback) => {
        socket.broadcast.emit('locationMsg', `http://google.com/maps?q=${location.latitude},${location.longitude}`)
        callback()
    })

    // Disconnecting Event
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

server.listen(3000, () => {
    console.log('Server is Running on Port 3000')
})
