const userModel = require('../models/user');
const messageEmbed = require('../include/messageEmbed');

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const { resume } = require(`../locales/${userReq.locale}.json`);

    const queue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Resume");

    if (!queue) {
        messageEmbed.setDescription(resume.queue);
        return message.channel.send(messageEmbed);
    }

    if (!queue.playing) {
        queue.playing = true;
        queue.connection.dispatcher.resume();
        messageEmbed.setDescription(resume.resumed);
        message.channel.send(messageEmbed);
    }
};

exports.info = {
    name: "resume",
};
