const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

document.querySelector('#msgForm').addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('Sent Message')

    // Getting message from html form
    const msg = e.target.elements.msgContent
    socket.emit('sendMessage', msg, (message) => {
        console.log(message)
    })
})

document.querySelector('#sendLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})
/*
socket.on('countUpdated', (count) => {
    console.log('The count has been updated', count)
})

document.querySelector('#incrementCount').addEventListener('click', () => {
    console.log('Clicked')
    socket.emit('increment')
})
*/
