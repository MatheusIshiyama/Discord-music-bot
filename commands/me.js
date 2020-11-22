const userModel = require("../models/user");
const { MessageEmbed } = require('discord.js');

exports.run = async (bot, message, args) => {
    const userInfo = message.author;
    const userReq = await userModel.findOne({ id: message.author.id });
    const { me } = require(`../locales/${userReq.locale}.json`);

    const msg = new MessageEmbed()
        .setTitle(message.author.username)
        .setColor("3498DB")
        .setThumbnail(userInfo.avatarURL() ? userInfo.avatarURL() : "https://github.com/MatheusIshiyama/BravanzinBot/blob/master/assets/discordAvatar.jpg?raw=true")
        .setTimestamp(new Date())
        .setFooter(`by ${bot.user.username}`, bot.user.avatarURL())
        .addField("Playlist", (userReq.playlist.url ? userReq.playlist.url : me.playlist));
    
    message.channel.send(msg);
};

exports.info = {
    name: "me",
};
