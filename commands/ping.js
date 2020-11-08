exports.run = async (bot, message, args) => {
    m = await message.channel.send({
        embed: {
            color: 3447003,
            title: "Ping",
            description: `🏓 Ping?`,
            timestamp: new Date(),
            footer: {
                text: "by Bravanzin",
                icon_url:
                    "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png",
            },
        },
    });
    m.edit({
        embed: {
            color: 3447003,
            title: "Ping",
            description: `🏓 Pong! A latência é ${
                m.createdTimestamp - message.createdTimestamp
            }ms.`,
            timestamp: new Date(),
            footer: {
                text: "by Bravanzin",
                icon_url:
                    "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png",
            },
        },
    });
};

exports.info = {
    name: "ping",
};
