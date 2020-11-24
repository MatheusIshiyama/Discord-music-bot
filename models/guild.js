const { Schema, model } = require('mongoose');

const Guild = Schema({
    id: String,
    name: String,
    locale: String,
    prefix: String,
    playlists: [
        {
            title: String,
            url: String
        }
    ],
    mcountId: String,
    dynamic: {
        id: String,
        texts: Array
    }
})

module.exports = model('Guild', Guild)