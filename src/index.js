const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

let count = 0
io.on('connection', (socket) => {
    console.log('New Web Socket Connection')

    socket.emit('countUpdated', count)
    
    socket.on('increment', () => {
        count++
        // emit only works for that particular connection
        // socket.emit('countUpdated', count)

        // io.emit works for all connections
        io.emit('countUpdated', count)
    })
})

server.listen(3000, () => {
    console.log('Server is Running on Port 3000')
})
