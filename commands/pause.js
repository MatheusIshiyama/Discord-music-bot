const { embedSend, embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
        return embedReply("Pause", "Não estou tocando nada", message);
    }

    if (queue.playing) {
        queue.playing = false;
        queue.connection.dispatcher.pause(true);
        return embedSend(
            "Pause",
            `${message.author} ⏸ pausou a música.`,
            message
        );
    }
};

exports.info = {
    name: "pause",
};
