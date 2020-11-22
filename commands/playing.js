const userModel = require("../models/user");
const messageEmbed = require("../include/messageEmbed");

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const { playing } = require(`../locales/${userReq.locale}.json`);

    const queue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Playing");

    if (!queue) {
        messageEmbed.setDescription(playing.stopped);
        message.channel.send(messageEmbed);
    } else {
        const song = queue.songs[0];
        messageEmbed.setDescription(`\`${song.title}\`\n${song.url}`);
        message.channel.send(messageEmbed);
    }
};

exports.info = {
    name: "playing",
};
