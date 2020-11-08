exports.run = async (bot, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
        return message.reply({
            embed: {
                color: 3447003,
                title: "Clear",
                description: "Não estou tocando nada",
                timestamp: new Date(),
                footer: {
                    text: "by Bravanzin",
                    icon_url:
                        "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png",
                },
            },
        });
    }

    queue.songs = [];
    queue.textChannel.send({
        embed: {
            color: 3447003,
            title: "Help",
            description: `${message.author} limpou a fila de músicas.`,
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
    name: "clear",
};
