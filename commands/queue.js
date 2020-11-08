exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return message.reply("Não estou tocando nada");
    }

    const queueCount = queue.songs.length;

    if (queueCount < 10) {
        for(i = 0; i < queueCount; i++) {
            message.channel.send(queue.songs[i].title);
        }
    } else {
        for(i = 0; i <= 10; i++) {
            message.channel.send(queue.songs[i].title);
        }
        message.channel.send(`e mais ${queueCount-10}`);
    }
}

exports.info = {
    name: "queue"
}