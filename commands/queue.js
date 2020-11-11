const { MessageEmbed } = require("discord.js");
const { embedSend, embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
        return embedReply("Queue", "Não estou tocando nada", message);
    }

    const queueCount = queue.songs.length;

    let queueEmbed = new MessageEmbed()
        .setTitle(`**Queue**`)
        .setDescription(`${queueCount} músicas na fila`)
        .setColor("3498DB");

    queue.songs.map((song, index) => {
        if (index === 0) {
            queueEmbed.addField(`Tocando: ${song.title}`, song.url);
        } else if ( 0 < index && index < 10) {
            queueEmbed.addField(song.url, `${index + 1}. ${song.title}`);
        } else if (index === 10) {
            queueEmbed.addField(`e mais ${queueCount - index} músicas na fila`, `by Bravanzin` );
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
