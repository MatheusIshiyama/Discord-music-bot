const guildModel = require('../models/guild');

module.exports = {
    async countUpdate(guild) {
        const guildInfo = await guildModel.findOne({ id: guild.id });
        const localeApp = require(`../locales/${guildInfo.locale}.json`);
        const locale = localeApp.app.mcount;
        if(guildInfo.mcountId != null) {
        const channel = await guild.channels.cache.get(guildInfo.mcountId);
            channel.setName(`${guild.memberCount} ${locale}`);
        }
    }
}