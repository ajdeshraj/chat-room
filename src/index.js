const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages.js')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log('New Web Socket Connection')

    //Joining Room
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))

        callback()
    })

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
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
        }
    })
})

server.listen(3000, () => {
    console.log('Server is Running on Port 3000')
})
