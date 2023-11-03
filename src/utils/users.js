const users = []

// Add User
const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!user || !room) {
        return {
            error: 'Username and Room are Required'
        }
    }

    // Check for Existing User
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validating Username
    if (existingUser) {
        return {
            error: 'Username is in Use!'
        }
    }

    // Store User
    const user = {id, username, room}
    users.push(user)
    return {user}
}

// Remove User
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// Get User
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

// Get Users Present in Room
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
