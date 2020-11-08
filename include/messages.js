module.exports = {
    async embedSend(command, descText, message) {
        message.channel.send({
            embed: {
                color: 3447003,
                title: command,
                description: descText,
                timestamp: new Date(),
                footer: {
                    text: "by Bravanzin",
                    icon_url:
                        "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png",
                },
            },
        });
    },

    async embedReply(command, descText, message) {
        message.reply({
            embed: {
                color: 3447003,
                title: command,
                description: descText,
                timestamp: new Date(),
                footer: {
                    text: "by Bravanzin",
                    icon_url:
                        "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png",
                },
            },
        });
    } 
}