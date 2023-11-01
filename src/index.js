const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log('New Web Socket Connection')

    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    // Sending Message
    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not Allowed!')
        }

        io.emit('message', generateMessage(msg))
        callback('Delivered!')
    })

    // Sharing Location
    socket.on('sendLocation', (location, callback) => {
        socket.broadcast.emit('locationMsg', generateLocationMessage(`http://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })

    // Disconnecting Event
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

server.listen(3000, () => {
    console.log('Server is Running on Port 3000')
})
