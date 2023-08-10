const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

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
    socket.on('sendMessage', (msg) => {
        io.emit('message', msg)
    })

    // Sharing Location
    socket.on('sendLocation', (location) => {
        socket.broadcast.emit('message', `http://google.com/maps?q=${location.latitude},${location.longitude}`)
    })

    // Disconnecting Event
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })

    /*
    let count = 0
    socket.emit('countUpdated', count)
    
    socket.on('increment', () => {
        count++
        // emit only works for that particular connection
        // socket.emit('countUpdated', count)

        // io.emit works for all connections
        io.emit('countUpdated', count)
    })
    */
})

server.listen(3000, () => {
    console.log('Server is Running on Port 3000')
})
