const guildModel = require('../models/guild');

module.exports = {
    async countUpdate(guild) {
        const guildInfo = await guildModel.findOne({ serverId: guild.id });
        if(guildInfo.memberCountId != null) {
        const channel = await guild.channels.cache.get(guildInfo.memberCountId);
            channel.setName(`${guild.memberCount} usuarios`);
        }
    }
}