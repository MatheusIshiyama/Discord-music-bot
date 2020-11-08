const { embedSend, embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
        return embedReply("Loop", "Não estou tocando nada", message);
    }

    queue.loop = !queue.loop;
    return embedSend(
        "Loop",
        `O loop está ${queue.loop ? "**ligado**" : "**desligado**"}`,
        message
    );
};

exports.info = {
    name: "loop",
};
