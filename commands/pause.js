exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return message.reply("Não estou tocando nada");
    }
    if (queue.playing) {
        queue.playing = false;
        queue.connection.dispatcher.pause(true);
        return queue.textChannel.send(`${message.author} ⏸ pausou a música.`)
    }
}

exports.info = {
    name: "pause"
}