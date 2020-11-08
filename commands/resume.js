exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return message.reply("Não estou tocando nada");
    }
    if (!queue.playing) {
        queue.playing = true;
        queue.connection.dispatcher.resume();
        return queue.textChannel.send(`${message.author} ▶ ligou a música.`)
    } 
}

exports.info = {
    name: "resume"
}