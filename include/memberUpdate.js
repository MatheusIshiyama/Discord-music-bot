const guildModel = require('../models/guild');

module.exports = {
    async countUpdate(guild) {
        const guildInfo = await guildModel.findOne({ id: guild.id });
        if(guildInfo.mcountId != null) {
        const channel = await guild.channels.cache.get(guildInfo.mcountId);
            channel.setName(`${guild.memberCount} usuarios`);
        }
    }
}