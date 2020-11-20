const { Schema, model } = require('mongoose');

const Guild = Schema({
    serverId: String,
    serverName: String,
    prefix: String,
    playlists: Array,
    memberCountId: String
})

module.exports = model('Guild', Guild)