const userModel = require('../models/user');
const messageEmbed = require('../include/messageEmbed');
const { MessageEmbed } = require("discord.js");

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const localeQueue = require(`../locales/${userReq.locale}.json`);
    const locale = localeQueue.queue;

    const queue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Queue");

    if (!queue) {
        messageEmbed.setDescription(locale.queue);
        return message.channel.send(messageEmbed);
    }

    const queueCount = queue.songs.length;

    let queueEmbed = new MessageEmbed()
        .setTitle(`Queue`)
        .setDescription(`${queueCount} ${locale.queueDesc}`)
        .setColor("3498DB")
        .setThumbnail(
            "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512"
        )
        .setTimestamp(new Date())
        .setFooter("by Bravanzin", "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512");

    queue.songs.map((song, index) => {
        if (index === 0) {
            queueEmbed.addField(`${locale.playing} ${song.title}`, song.url);
        } else if ( 0 < index && index < 11) {
            queueEmbed.addField(song.url, `${index}. ${song.title}`);
        } else if (index === 11) {
            queueEmbed.addField(`${locale.size[0]} ${queueCount - index} ${locale.size[1]}`, locale.enjoy );
            return;
        } else {
            return;
        }
    });

    message.channel.send(queueEmbed);

};

exports.info = {
    name: "queue",
};
