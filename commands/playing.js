const { embedSend, embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
        return embedReply("Playing", "Não estou tocando nada", message);
    }
    const song = queue.songs[0];
    return embedSend("Playing", `${song.title}\n${song.url}`, message);
};

exports.info = {
    name: "playing",
};
