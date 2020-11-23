const userModel = require('../models/user');
const messageEmbed = require('../include/messageEmbed');

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const { skip } = require(`../locales/${userReq.locale}.json`);

    const queue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Skip");

    if (!queue) {
        messageEmbed.setDescription(skip.queue);
        return message.channel.send(messageEmbed);
    } else {   
        queue.playing = true;
        queue.connection.dispatcher.end();
        messageEmbed.setDescription(`${message.author.username} ${skip.skipped}`);
        message.channel.send(messageEmbed);
    }
};

exports.info = {
    name: "skip",
};
