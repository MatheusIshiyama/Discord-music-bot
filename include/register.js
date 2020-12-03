const guildModel = require("../models/guild");
const userModel = require("../models/user");

module.exports = {
    async guildRegister(guild) {
        const req = await guildModel.findOne({ id: guild.id });
        if (!req) {
            const guildInfo = new guildModel({
                id: guild.id,
                name: guild.name,
                locale: "en-us",
                prefix: ";",
                playlists: null,
                mcountId: null
            });
            await guildInfo.save();
        }
    },

    async guildRemove(guild) {
        const req = await guildModel.findOne({ id: guild.id });
        if (req) {
            req.deleteOne({ id: `${guild.id}` });
        }
    },

    async guildUpdate(guild) {
        const req = await guildModel.findOne({ id: guild.id });
        if (req) {
            if (req.name != guild.name) {
                await req.updateOne({ name: guild.name });
            }
        }
    },

    async user(user) {
        const req = await userModel.findOne({ id: user.id });
        if (!req) {
            const userInfo = new userModel({
                id: user.id,
                name: user.username,
                locale: "en-us",
                playlist: {
                    title: null,
                    url: null,
                    thumbnail: null,
                },
                favSong: {
                    title: null,
                    url: null,
                    thumbnail: null,
                }
            });
            await userInfo.save();
        } else {
            if (req.name != user.username) {
                await req.updateOne({ name: user.username });
            }
        }
    },
};
