const { embedSend, embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return embedReply("Shuffle", "Não estou tocando nada", message);
    }

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    return embedSend("Shuffle", `${message.author} aleatorizou a ordem das músicas.`, message);
}

exports.info = {
    name: "shuffle"
}