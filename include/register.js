const guildModel = require('../models/guild');

module.exports = {
    async guildRegister(guild) {
        const req = await guildModel.findOne({ serverId: guild.id });
        if(!req) {
            const guildInfo = new guildModel({
                serverId: guild.id,
                serverName: guild.name,
                prefix: ";",
                playlists: null
            })
            await guildInfo.save();
            console.log(`O bot entrou no servidor "${guild.name}"`);
        }
    },

    async guildRemove(guild) {
        const req = await guildModel.findOne({ serverId: guild.id });
        if(req) {
            req.deleteOne({ serverId: `${guild.id}`});
            console.log(`O bot saiu do servidor "${guild.name}"`);
        }
    },

    async guildUpdate(guild) {
        const req = await guildModel.findOne({ serverId: guild.id });
        if(req) {
            if(req.serverName != guild.name) {
                console.log(`Servidor "${req.serverName}" atualizou o nome para "${guild.name}"`)
                await guildModel.findOneAndUpdate({ serverId: guild.id}, { serverName: guild.name });
            }
        }
    }
}