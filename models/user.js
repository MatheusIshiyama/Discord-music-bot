const { Schema, model } = require('mongoose');

const User = Schema({
    userId: String,
    userName: String,
    playlist: String
})

module.exports = model('User', User);