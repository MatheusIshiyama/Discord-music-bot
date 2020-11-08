const { embedSend, embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
        return embedReply(
            "Skip",
            "Não estou tocando nada para que eu possar passar de música",
            message
        );
    }

    queue.playing = true;
    queue.connection.dispatcher.end();
    return embedSend("Skip", `${message.author} ⏭ passou de música`, message);
};

exports.info = {
    name: "skip",
};
