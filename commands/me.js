const userGuild = require('../models/user');

exports.run = async (bot, message, args) => {
    const userInfo = message.author;
    const user = await userGuild.findOne({ userId: userInfo.id });

    message.channel.send({
        embed: {
            color: 3447003,
            title: userInfo.username,
            thumbnail: {
                url: userInfo.avatarURL(),
            },
            fields: [
                {
                    name: 'Playlist',
                    value: user.playlist ? user.playlist : "O usuário não adicionou uma playlist ainda."
                },
            ],
            timestamp: new Date(),
            footer: {
                text: "by Bravanzin",
                icon_url:
                    "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png",
            },
        },
    });
}

exports.info = {
    name: "me"
}