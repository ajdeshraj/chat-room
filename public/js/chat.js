socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

document.querySelector('#msgForm').addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('Sent Message')

    // Getting message from html form
    const msg = e.target.elements.msgContent
    socket.emit('sendMessage', msg)
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
