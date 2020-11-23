const userModel = require('../models/user');
const guildModel = require('../models/guild');
const { MessageEmbed } = require('discord.js');

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const guildReq = await guildModel.findOne({ serverId: message.guild.id });
    const { server } = require(`../locales/${userReq.locale}.json`);

    const msg = new MessageEmbed()
        .setTitle("Server")
        .setDescription(server.desc)
        .setColor("3498DB")
        .setThumbnail(
            message.guild.iconURL() ?  message.guild.iconURL() : "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512"
        )
        .addFields(
            { name: `${server.server} \`${guildReq.serverName}\``, value: `${server.prefix} \`${guildReq.prefix}\`` },
            { name: `${server.playlists.title}`, value: guildReq.playlists ? guildReq.playlists : server.playlists.desc }
            )
        .setTimestamp(new Date())
        .setFooter("by Bravanzin", "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512");
    
    message.channel.send(msg);
}

exports.info = {
    name: "server"
}