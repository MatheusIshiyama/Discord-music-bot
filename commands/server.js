const messages = require("../include/messages");
const guildModel = require('../models/guild');

exports.run = async (bot, message, args) => {
    const server = await guildModel.findOne({ serverId: message.guild.id });
    message.channel.send({
        embed: {
            color: 3447003,
            title: "Server",
            thumbnail: {
                url:
                `${message.guild.iconURL() ?  message.guild.iconURL() : "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png"}`,
            },
            description: `Informações do servidor`,
            fields: [
                {
                    name: `Servidor: \`${server.serverName}\``,
                    value: `prefix do servidor \`${server.prefix}\``,
                },
                {
                    name: "Playlists do servidor",
                    value: `${server.playlists ? server.playlists[0] : "O servidor ainda não possui playlists"}`
                }
            ],
            timestamp: new Date(),
            footer: {
                text: "by Bravanzin",
                icon_url:
                    "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png",
            },
        },
    });
}

exports.info = {
    name: "server"
}