const userModel = require('../models/user');
const messageEmbed = require('../include/messageEmbed');

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const { join } = require(`../locales/${userReq.locale}.json`);
    const { channel } = message.member.voice;

    messageEmbed.setTitle("Join")
    if (!channel) {
        messageEmbed.setDescription(join.channel);
        return message.channel.send(messageEmbed);
    }

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
        messageEmbed.setDescription(join.permission);
        return message.channel.send(messageEmbed);
    }
    message.member.voice.channel.join();
};

exports.info = {
    name: "join",
};
