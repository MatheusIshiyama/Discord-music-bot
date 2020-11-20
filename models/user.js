const { Schema, model } = require('mongoose');

const User = Schema({
    userId: String,
    userName: String,
    playlist: String,
    favSong: String
})

module.exports = model('User', User);