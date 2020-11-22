const userModel = require('../models/user');
const messageEmbed = require('../include/messageEmbed');

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const { pause } = require(`../locales/${userReq.locale}.json`);

    const queue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Pause");
    if (!queue) {
        messageEmbed.setDescription(pause.stopped);
        return message.channel.send(messageEmbed);
    }

    if (queue.playing) {
        queue.playing = false;
        queue.connection.dispatcher.pause(true);
        messageEmbed.setDescription(`${message.author.username} ${pause.paused}`);
        return message.channel.send(messageEmbed);
    }
};

exports.info = {
    name: "pause",
};
