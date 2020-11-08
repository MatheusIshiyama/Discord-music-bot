exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return message.reply("Não estou tocando nada");
    }

    queue.loop = !queue.loop;
    return queue.textChannel.send(`O loop está ${queue.loop? "**ligado**" : "**desligado**" }`);
}

exports.info = {
    name: "loop"
}