const userModel = require("../models/user");
const messageEmbed = require("../include/messageEmbed");

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const { clear } = require(`../locales/${userReq.locale}.json`);

    const queue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Clear");

    if (!queue) {
        messageEmbed.setDescription(clear.stopped);
        return message.channel.send(messageEmbed);
    } else {
        queue.songs = [];
        messageEmbed.setDescription(message.author.username + clear.clear);
        return message.channel.send(messageEmbed);
    }
};

exports.info = {
    name: "clear",
};
