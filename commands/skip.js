exports.run = async () => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("Não estou tocando nada para que eu possar passar de música");

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ passou de música`);
}

exports.info = {
    name: "skip"
}