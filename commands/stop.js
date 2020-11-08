const { embedSend, embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return embedReply("Stop", "Não estou tocando nada", message);
    }

    queue.songs = [];
    queue.connection.dispatcher.end();
    return embedSend("Stop", `${message.author} parou a música.`, message);
}

exports.info = {
    name: "stop"
}