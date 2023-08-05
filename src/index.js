const path = require('path')
const express = require('express')

const app = express()

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

app.listen(3000, () => {
    console.log('Server is Running on Port 3000')
})
