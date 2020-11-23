const userModel = require('../models/user');
const messageEmbed = require('../include/messageEmbed');

exports.run = async (bot, message, args) => {
    const userReq = userModel.findOne({ id: message.author.id });
    const { shuffle } = require(`../locales/${userReq.locale}.json`);

    const queue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Shuffle");

    if(!queue) {
        messageEmbed.setDescription(shuffle.queue);
        return message.channel.send(messageEmbed);
    } else {   
        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        messageEmbed.setDescription(`${message.author.username} ${shuffle.shuffled}`);
        message.channel.send(messageEmbed);
    }
}

exports.info = {
    name: "shuffle"
}