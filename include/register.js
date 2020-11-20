const guildModel = require('../models/guild');
const userModel = require('../models/user');

module.exports = {
    async guildRegister(guild) {
        const req = await guildModel.findOne({ serverId: guild.id });
        if(!req) {
            const guildInfo = new guildModel({
                serverId: guild.id,
                serverName: guild.name,
                prefix: ";",
                playlists: null,
                memberCountId: null
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
    },

    async user(user) {
        const req = await userModel.findOne({ userId: user.id });
        if(!req) {
            const userInfo = new userModel({
                userId: user.id,
                userName: user.username,
                playlist: null,
                favSong: null
            });
            await userInfo.save();
            console.log(`${user.username} se registrou`);
        } else {
            if(req.userName != user.username) {
                console.log(`Usuário: ${req.userName} atualizou o nome para ${user.username}`);
                await userModel.findOneAndUpdate({ userId: user.id}, { userName: user.username });
            }
        }
    }
}