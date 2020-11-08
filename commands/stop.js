exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return message.reply("Não estou tocando nada");
    }

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} parou a música.`);
}

exports.info = {
    name: "stop"
}