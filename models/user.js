const { Schema, model } = require('mongoose');

const User = Schema({
    user: {
        id: String,
        name: String
    },
    playlist: {
        title: String,
        url: String,
        thumbnail: String
    },
    favSong: {
        title: String,
        url: String,
        thumbnail: String
    },
    toDo: {
        status: Boolean,
        title: String,
        desc: String
    }
})

module.exports = model('User', User);