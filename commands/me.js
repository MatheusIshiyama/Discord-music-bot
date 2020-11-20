const userGuild = require('../models/user');

exports.run = async (bot, message, args) => {
    const userInfo = message.author;
    const user = await userGuild.findOne({ userId: userInfo.id });

    message.channel.send({
        embed: {
            color: 3447003,
            title: userInfo.username,
            thumbnail: {
                url: userInfo.avatarURL() ? userInfo.avatarURL() : "https://github.com/MatheusIshiyama/BravanzinBot/blob/master/assets/discordAvatar.jpg?raw=true",
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
                    bot.user.avatarURL(),
            },
        },
    });
}

exports.info = {
    name: "me"
}