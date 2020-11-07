exports.run = async(bot, message, args) => {
    m = await message.channel.send({
        embed: {
            color: 3447003,
            description: `🏓 Ping?`
        }
    });
    m.edit({
        embed: {
            color: 3447003,
            description: `🏓 Pong! A latência é ${m.createdTimestamp - message.createdTimestamp}ms.`
        }
    });
}

exports.info = {
    name: "ping"
}