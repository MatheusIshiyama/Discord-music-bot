exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return message.reply("Não estou tocando nada");
    }

    queue.songs = [];
    queue.textChannel.send(`${message.author} limpou a fila de músicas.`);
}

exports.info = {
    name: "clear"
}