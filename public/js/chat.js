const socket = io()

// Elements
const $msgForm = document.querySelector('#msgForm')
const $msgFormInput = document.querySelector('input')
const $msgFormButton = document.querySelector('button')
const $sendLocation = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

// Templates
const msgTemplate = document.querySelector('#msgTemplate').innerHTML
const locationMsgTemplate = document.querySelector('#locationMsgTemplate').innerHTML

const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render(msgTemplate, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMsg', (msg) => {
    console.log(msg)
    const html = Mustache.render(locationMsgTemplate, {
        url: msg.url,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

document.querySelector('#msgForm').addEventListener('submit', (e) => {
    e.preventDefault()

    // Disable Form
    $msgFormButton.setAttribute('disabled', 'disabled')

    console.log('Sent Message')

    // Getting message from html form
    const msg = e.target.elements.msgContent
    socket.emit('sendMessage', msg, (error) => {
        // Reenable Form
        $msgFormButton.removeAttribute('disabled')
        $msgFormInput.value = ''
        $msgFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('Delivered!')
    })
})

document.querySelector('#sendLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    // Disable Button
    $sendLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocation.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})

socket.emit('join', {username, room})
