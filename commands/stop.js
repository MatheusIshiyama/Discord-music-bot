const userModel = require('../models/user');
const messageEmbed = require('../include/messageEmbed');

exports.run = async (bot, message, args) => {
    const userReq = userModel.findOne({ id: message.author.id });
    const { stop } = require(`../locales/${userReq.locale}.json`);

    const queue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Stop");
    if(!queue) {
        messageEmbed.setDescription(stop.queue);
        return message.channel.send(messageEmbed);
    } else {   
        queue.songs = [];
        queue.connection.dispatcher.end();
        messageEmbed.setDescription(`${message.author.username} ${stop.stopped}`);
        message.channel.send(messageEmbed);
    }
}

exports.info = {
    name: "stop"
}