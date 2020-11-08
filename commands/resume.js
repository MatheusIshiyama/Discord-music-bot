const { embedSend, embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
        return embedReply("Resume", "Não estou tocando nada", message);
    }
    if (!queue.playing) {
        queue.playing = true;
        queue.connection.dispatcher.resume();
        return embedSend(
            "Queue",
            `${message.author} ▶ ligou a música.`,
            message
        );
    }
};

exports.info = {
    name: "resume",
};
