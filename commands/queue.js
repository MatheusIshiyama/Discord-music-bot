const { embedSend, embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if(!queue) {
        return embedReply("Queue", "Não estou tocando nada", message);
    }

    const queueCount = queue.songs.length;
    let msg;

    msg = `**Tocando:** \`${queue.songs[0].title}\`\n **Próximas:**`;
    if (queueCount < 10) {
        for(i = 1; i < queueCount; i++) {
            msg += `\n **${i}.** \`${queue.songs[i].title}\``;
        }
    } else {
        for(i = 1; i <= 10; i++) {
            msg += `\n **${i}.** \`${queue.songs[i].title}\``;
        }
        msg += `\n \`e mais ${queueCount-10}\``;
    }

    embedSend("Queue", msg, message);
}

exports.info = {
    name: "queue"
}