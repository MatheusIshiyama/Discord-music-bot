const { embedSend, embedReply } = require('../include/messages');

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
        return embedReply("Clear", "Não estou tocando nada", message );
    }

    queue.songs = [];
    return embedSend("Clear", `${message.author} limpou a fila de músicas.`, message);
};

exports.info = {
    name: "clear",
};
