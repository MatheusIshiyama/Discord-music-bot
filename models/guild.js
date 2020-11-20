const { Schema, model } = require('mongoose');

const Guild = Schema({
    serverId: String,
    serverName: String,
    prefix: String,
    playlists: Array,
    memberCount: {
        channelId: String,
        onOff: Boolean
    }
})

module.exports = model('Guild', Guild)