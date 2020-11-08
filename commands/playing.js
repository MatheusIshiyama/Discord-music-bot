exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return message.reply("Não estou tocando nada");
    }
    const song = queue.songs[0];
    return message.reply(`${song.title}\n${song.url}`);
}

exports.info = {
    name: "playing"
}